import { useCallback, useEffect, useState } from 'react'
import { utils } from '@senswap/sen-js'

import { useMint, usePool } from 'senhub/providers'
import { fetchCGK } from 'shared/util'

export const useMintPrice = (mintAddress: string) => {
  const { tokenProvider, getMint } = useMint()
  const { pools } = usePool()
  const [mintPrice, setMintPrice] = useState(0)

  const getMintUSD = useCallback(
    async (mintAddress: string, amount: bigint) => {
      const tokenInfo = await tokenProvider.findByAddress(mintAddress)
      if (!tokenInfo) return 0
      const ticket = tokenInfo.extensions?.coingeckoId
      if (!ticket) return 0
      const cgkData = await fetchCGK(ticket)
      return (
        Number(utils.undecimalize(amount, tokenInfo.decimals)) * cgkData.price
      )
    },
    [tokenProvider],
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
      const balanceA: number = await getMintUSD(mint_a, reserve_a)
      const balanceB: number = await getMintUSD(mint_b, reserve_b)
      return (balanceA + balanceB) / Number(utils.undecimalize(supply, 9))
    },
    [getMint, getMintUSD, pools],
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
        const cgkData = await fetchCGK(ticket)
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
