import { useCallback, useEffect, useState } from 'react'
import { PoolData } from '@senswap/sen-js'

import { useSentrePools } from './useSentrePools'
import { usePool } from 'hooks/pools/usePool'

export const useCommunityPools = () => {
  const [communityPools, setCommunityPools] = useState({})
  const { pools } = usePool()
  const { checkSentrePools } = useSentrePools()

  const checkCommunityPools = useCallback(
    (poolAddress: string) => !checkSentrePools(poolAddress),
    [checkSentrePools],
  )

  const filterCommunityPools = useCallback(
    (pools) => {
      const newCommunityPools: Record<string, PoolData> = {}
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
