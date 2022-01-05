import { useCallback, useEffect, useState } from 'react'
import { TokenInfo } from '@solana/spl-token-registry'
import { account, utils } from '@senswap/sen-js'

import { useMint, usePool } from 'senhub/providers'
import { fetchCGK } from 'shared/util'

export const useTVL = (poolAddress?: string) => {
  const { tokenProvider } = useMint()
  const { pools } = usePool()
  const [tvl, setTVL] = useState(0)

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
        ;[0, 1, 2].forEach((i) => {
          if (reserves[i] && decimals[i] && prices[i])
            tvl +=
              Number(utils.undecimalize(reserves[i] as bigint, decimals[i])) *
              prices[i]
        })
        setTVL(tvl)
        return tvl
      } catch (er) {
        return setTVL(0)
      }
    },
    [pools, tokenProvider],
  )

  useEffect(() => {
    if (!poolAddress) return
    getTVL(poolAddress)
  }, [getTVL, poolAddress])

  return {
    tvl,
    getTVL,
  }
}
