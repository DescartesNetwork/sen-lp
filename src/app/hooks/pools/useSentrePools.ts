import { useCallback, useEffect, useState } from 'react'
import { usePool } from '@senhub/providers'

import configs from 'app/configs'
import { PoolsState } from 'os/store/pools.reducer'

const {
  sol: { senOwners },
} = configs

export const useSentrePools = () => {
  const [sentrePools, setSentrePools] = useState<PoolsState>({})
  const { pools } = usePool()

  const checkSentrePools = useCallback(
    (poolAddress: string) => senOwners.includes(pools[poolAddress].owner),
    [pools],
  )

  const filterSentrePools = useCallback(
    (pools: PoolsState) => {
      const newSentrePools: PoolsState = {}
      for (const poolAddress in pools)
        if (checkSentrePools(poolAddress))
          newSentrePools[poolAddress] = pools[poolAddress]
      return setSentrePools(newSentrePools)
    },
    [checkSentrePools],
  )

  useEffect(() => {
    filterSentrePools(pools)
  }, [pools, filterSentrePools])

  return { sentrePools, filterSentrePools, checkSentrePools }
}
