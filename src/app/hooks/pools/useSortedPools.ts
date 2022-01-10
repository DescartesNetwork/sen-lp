import { useCallback, useEffect, useState } from 'react'

import { PoolsState } from 'os/store/pools.reducer'

export const useSortedPools = (pools: PoolsState) => {
  const [sortedPools, setSortedPools] = useState<PoolsState>({})

  const sortPools = useCallback((pools: PoolsState) => {
    const newSortedPools: PoolsState = {}
    // Todo short
    for (const poolAddress in pools)
      newSortedPools[poolAddress] = pools[poolAddress]
    return setSortedPools(newSortedPools)
  }, [])

  useEffect(() => {
    sortPools(pools)
  }, [pools, sortPools])

  return { sortedPools }
}
