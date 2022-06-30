import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { PoolData } from '@senswap/sen-js'

import { AppState } from 'model'

/**
 * Filter & display Archived Pool with showArchived option
 */
export const useFilterPools = (pools: Record<string, PoolData>) => {
  const [filteredPools, setFilterPools] = useState({})
  const {
    settings: { showArchived },
  } = useSelector((state: AppState) => state)

  const checkArchivedPools = useCallback(
    (poolAddress: string) => {
      const { reserve_a, reserve_b } = pools[poolAddress] || {}
      return !reserve_a || !reserve_b
    },
    [pools],
  )

  const filterPools = useCallback(
    (pools) => {
      const displayPools: Record<string, PoolData> = {}
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
