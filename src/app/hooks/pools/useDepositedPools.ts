import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { usePool } from '@senhub/providers'
import { PoolData } from '@senswap/sen-js'

import { AppState } from 'app/model'

export const useDepositedPools = () => {
  const [depositedPools, setDepositedPools] = useState<
    Record<string, PoolData>
  >({})
  const lpts = useSelector((state: AppState) => state.lpts)
  const { pools } = usePool()

  const getDepositedPools = useCallback(() => {
    const newDepositedPools: Record<string, PoolData> = {}
    for (const lptAddr in lpts) {
      const { pool, amount } = lpts[lptAddr]
      if (amount > BigInt(0)) newDepositedPools[pool] = pools[pool]
    }
    return setDepositedPools(newDepositedPools)
  }, [lpts, pools])

  useEffect(() => {
    getDepositedPools()
  }, [getDepositedPools])

  return { depositedPools }
}
