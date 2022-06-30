import { useCallback, useEffect, useState } from 'react'
import { usePool } from '@sentre/senhub'
import { PoolData } from '@senswap/sen-js'

import configs from 'configs'

const {
  sol: { senOwners },
} = configs

export const useSentrePools = () => {
  const [sentrePools, setSentrePools] = useState({})
  const { pools } = usePool()

  const checkSentrePools = useCallback(
    (poolAddress: string) => senOwners.includes(pools[poolAddress].owner),
    [pools],
  )

  const filterSentrePools = useCallback(
    (pools) => {
      const newSentrePools: Record<string, PoolData> = {}
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
