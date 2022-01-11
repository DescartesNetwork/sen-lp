import { useMemo } from 'react'

import { PoolsState } from 'os/store/pools.reducer'
import { useFilterPools } from './useFilterPools'
import { useSearchedPools } from './useSearchedPools'
import { useSortedPools } from './useSortedPools'

export const useListPoolAddress = (pools: PoolsState) => {
  const { filteredPools } = useFilterPools(pools)
  const { searchedPools } = useSearchedPools(filteredPools)
  const { sortedPools } = useSortedPools(searchedPools)
  const listPoolAddress = useMemo(() => Object.keys(sortedPools), [sortedPools])
  return { listPoolAddress }
}
