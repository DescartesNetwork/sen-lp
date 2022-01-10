import { useCallback, useEffect, useState } from 'react'

import { usePool } from 'senhub/providers'
import { PoolsState } from 'os/store/pools.reducer'
import { useSentrePools } from './useSentrePools'

export const useCommunityPools = () => {
  const [communityPools, setCommunityPools] = useState<PoolsState>({})
  const { pools } = usePool()
  const { checkSentrePools } = useSentrePools()

  const checkCommunityPools = useCallback(
    (poolAddress: string) => !checkSentrePools(poolAddress),
    [checkSentrePools],
  )

  const filterCommunityPools = useCallback(
    (pools: PoolsState) => {
      const newCommunityPools: PoolsState = {}
      for (const poolAddress in pools)
        if (checkCommunityPools(poolAddress))
          newCommunityPools[poolAddress] = pools[poolAddress]
      return setCommunityPools(newCommunityPools)
    },
    [checkCommunityPools],
  )

  useEffect(() => {
    filterCommunityPools(pools)
  }, [pools, filterCommunityPools])

  return { communityPools, filterCommunityPools, checkCommunityPools }
}
