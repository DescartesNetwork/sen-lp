import { useCallback, useEffect, useState } from 'react'
import { PoolData } from '@senswap/sen-js'

import { usePoolTvl } from 'app/hooks/usePoolTvl'

export const useSortedPools = (pools: Record<string, PoolData>) => {
  const [sortedPools, setSortedPools] = useState({})
  const { getTvl } = usePoolTvl()

  const sortPools = useCallback(
    async (pools) => {
      let listPoolAddress = Object.keys(pools)
      const newSortedPools: Record<string, PoolData> = {}
      // Get tvl all pools
      const poolsTvl: Record<string, number> = {}
      await Promise.all(
        listPoolAddress.map(
          async (addr) => (poolsTvl[addr] = await getTvl(addr)),
        ),
      )
      // Sort with Tvl
      const shortedAddress = listPoolAddress.sort(
        (first, second) => poolsTvl[second] - poolsTvl[first],
      )
      for (const poolAddress of shortedAddress)
        newSortedPools[poolAddress] = pools[poolAddress]
      return setSortedPools(newSortedPools)
    },
    [getTvl],
  )

  useEffect(() => {
    sortPools(pools)
  }, [pools, sortPools])

  return { sortedPools }
}
