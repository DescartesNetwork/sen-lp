import { useCallback, useEffect, useState } from 'react'

import { PoolsState } from 'os/store/pools.reducer'
import { AppState } from 'app/model'
import { useSelector } from 'react-redux'

/**
 * Filter & display Archived Pool with showArchived option
 */
export const useFilterPools = (pools: PoolsState) => {
  const [filteredPools, setFilterPools] = useState<PoolsState>({})
  const {
    settings: { showArchived },
  } = useSelector((state: AppState) => state)

  const checkArchivedPools = useCallback(
    (poolAddress: string) => {
      const { reserve_a, reserve_b } = pools[poolAddress]
      return !reserve_a || !reserve_b
    },
    [pools],
  )

  const filterPools = useCallback(
    (pools: PoolsState) => {
      const displayPools: PoolsState = {}
      for (const poolAddress in pools)
        if (showArchived || !checkArchivedPools(poolAddress))
          displayPools[poolAddress] = pools[poolAddress]
      return setFilterPools(displayPools)
    },
    [checkArchivedPools, showArchived],
  )

  useEffect(() => {
    filterPools(pools)
  }, [pools, filterPools])

  return { filteredPools }
}
