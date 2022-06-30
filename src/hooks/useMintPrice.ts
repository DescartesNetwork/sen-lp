import { useCallback, useEffect, useState } from 'react'
import { utils } from '@senswap/sen-js'
import { useMint, usePool, util } from '@sentre/senhub'

/**
 * @param mintAddress
 * @param strict true: if has token unknown => returns 0
 * @returns
 */
export const useMintPrice = (mintAddress: string, strict?: boolean) => {
  const { tokenProvider, getMint, getDecimals } = useMint()
  const { pools } = usePool()
  const [mintPrice, setMintPrice] = useState(0)

  const getTokenPrice = useCallback(
    async (tokenAddress: string) => {
      const tokenInfo = await tokenProvider.findByAddress(tokenAddress)
      const ticket = tokenInfo?.extensions?.coingeckoId
      if (!ticket) {
        if (strict) throw new Error('Unknown Token')
        return 0
      }
      const cgkData = await util.fetchCGK(ticket)
      const price = cgkData.price
      if (!price) {
        if (strict) throw new Error('Not find on Cgk')
        return 0
      }
      return price
    },
    [strict, tokenProvider],
  )

  const getTokenUsd = useCallback(
    async (mintAddress: string, amountBigint: bigint) => {
      const mintPrice = await getTokenPrice(mintAddress)
      const mintDecimals = await getDecimals(mintAddress)
      const amount = Number(utils.undecimalize(amountBigint, mintDecimals))
      return amount * mintPrice
    },
    [getDecimals, getTokenPrice],
  )

  const getMintLptPrice = useCallback(
    async (lptAddress: string) => {
      const poolData = Object.values(pools).find(
        (pool) => pool.mint_lpt === lptAddress,
      )
      if (!poolData) return 0
      const { reserve_a, reserve_b, mint_a, mint_b } = poolData
      if (reserve_a * reserve_b === BigInt(0)) return 0
      const {
        [lptAddress]: { supply },
      } = await getMint({ address: lptAddress })
      const balanceA: number = await getTokenUsd(mint_a, reserve_a)
      const balanceB: number = await getTokenUsd(mint_b, reserve_b)
      return (balanceA + balanceB) / Number(utils.undecimalize(supply, 9))
    },
    [getMint, getTokenUsd, pools],
  )

  const getMintPrice = useCallback(
    async (mintAddress: string) => {
      try {
        const tokenInfo = await tokenProvider.findByAddress(mintAddress)
        // mint lpt
        if (!tokenInfo) {
          const mintLptPrice = await getMintLptPrice(mintAddress)
          return setMintPrice(mintLptPrice)
        }
        // token
        const ticket = tokenInfo.extensions?.coingeckoId
        if (!ticket) return setMintPrice(0)
        const cgkData = await util.fetchCGK(ticket)
        return setMintPrice(cgkData.price)
      } catch (error) {
        return 0
      }
    },
    [getMintLptPrice, tokenProvider],
  )

  useEffect(() => {
    getMintPrice(mintAddress)
  }, [getMintPrice, mintAddress])

  return mintPrice
}
