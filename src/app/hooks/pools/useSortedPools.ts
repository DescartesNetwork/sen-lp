import { usePoolTvl } from 'app/hooks/usePoolTvl'
import { useCallback, useEffect, useState } from 'react'

import { PoolsState } from 'os/store/pools.reducer'

export const useSortedPools = (pools: PoolsState) => {
  const [sortedPools, setSortedPools] = useState<PoolsState>({})
  const { getTvl } = usePoolTvl()

  const sortPools = useCallback(
    async (pools: PoolsState) => {
      let listPoolAddress = Object.keys(pools)
      const newSortedPools: PoolsState = {}
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
