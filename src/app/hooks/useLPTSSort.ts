import { useCallback, useEffect, useMemo, useState } from 'react'
import { TokenInfo } from '@solana/spl-token-registry'

import { useMint, usePool } from 'senhub/providers'
import { account, utils } from '@senswap/sen-js'
import { fetchCGK } from 'shared/util'

export const useLPTSSort = (listSentrePools: string[]) => {
  const { tokenProvider } = useMint()
  const [poolTVL, setPoolTVL] = useState<Record<string, number>>({})
  const { pools } = usePool()

  const getTVL = useCallback(
    async (poolAddress: string) => {
      try {
        const { reserve_a, reserve_b, mint_a, mint_b } = pools[poolAddress]
        const mintAddresses = [mint_a, mint_b]
        const tokenInfos: Array<TokenInfo | any> = await Promise.all(
          mintAddresses.map((mintAddress) => {
            if (!account.isAddress(mintAddress)) return {}
            return tokenProvider.findByAddress(mintAddress)
          }),
        )
        const reserves = [reserve_a, reserve_b]
        const decimals = tokenInfos.map(({ decimals }) => decimals)
        const data = await Promise.all(
          tokenInfos.map(({ extensions }) => {
            if (!extensions?.coingeckoId) return {} as any
            return fetchCGK(extensions?.coingeckoId)
          }),
        )
        const prices = data.map(({ price }) => price)
        let tvl = 0
        for (const i in reserves) {
          if (reserves[i] && decimals[i] && prices[i]) {
            const amount = Number(utils.undecimalize(reserves[i], decimals[i]))
            tvl = tvl + amount * prices[i]
          }
        }
        return tvl
      } catch (er) {
        return 0
      }
    },
    [pools, tokenProvider],
  )

  const calcPoolTVL = useCallback(async () => {
    if (!Object.keys(pools).length) return
    if (Object.keys(poolTVL).length) return
    const newPoolTVL: Record<string, number> = {}
    await Promise.all(
      Object.keys(pools).map(async (addr) => {
        const tvl = await getTVL(addr)
        newPoolTVL[addr] = tvl
      }),
    )
    setPoolTVL(newPoolTVL)
  }, [getTVL, poolTVL, pools])

  useEffect(() => {
    calcPoolTVL()
  }, [calcPoolTVL, poolTVL])

  const sortedPools = useMemo(() => {
    if (!Object.keys(poolTVL).length) return []
    return listSentrePools
      .map((address) => ({ address, ...pools[address] }))
      .sort(({ address: fistAddr }, { address: secondAddr }) => {
        const firstTVL = poolTVL[fistAddr] || 0
        const secondTvl = poolTVL[secondAddr] || 0
        return secondTvl - firstTVL
      })
  }, [listSentrePools, poolTVL, pools])

  return sortedPools
}
