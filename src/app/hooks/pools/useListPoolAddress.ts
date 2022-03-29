import { useMemo } from 'react'
import { PoolData } from '@senswap/sen-js'

import { useFilterPools } from './useFilterPools'
import { useSearchedPools } from './useSearchedPools'
import { useSortedPools } from './useSortedPools'

export const useListPoolAddress = (pools: Record<string, PoolData>) => {
  const { filteredPools } = useFilterPools(pools)
  const { searchedPools } = useSearchedPools(filteredPools)
  const { sortedPools } = useSortedPools(searchedPools)
  const listPoolAddress = useMemo(() => Object.keys(sortedPools), [sortedPools])
  return { listPoolAddress }
}
