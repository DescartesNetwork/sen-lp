import { useCallback, useEffect, useMemo, useState } from 'react'

import { useMint, usePool } from 'senhub/providers'
import { getTVL } from 'app/helper'

export const useTVLSortPool = (listSentrePools: string[]) => {
  const { tokenProvider } = useMint()
  const [poolTVL, setPoolTVL] = useState<Record<string, number>>({})
  const { pools } = usePool()

  const calcPoolTVL = useCallback(async () => {
    if (!Object.keys(pools).length) return
    if (Object.keys(poolTVL).length) return
    const newPoolTVL: Record<string, number> = {}
    await Promise.all(
      Object.keys(pools).map(async (addr) => {
        const tvl = await getTVL(addr, tokenProvider, pools)
        newPoolTVL[addr] = tvl
      }),
    )
    setPoolTVL(newPoolTVL)
  }, [poolTVL, pools, tokenProvider])

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
