import { useCallback, useEffect, useState } from 'react'

import { usePool } from 'senhub/providers'
import { PoolsState } from 'os/store/pools.reducer'
import { useSelector } from 'react-redux'
import { AppState } from 'app/model'

export const useDepositedPools = () => {
  const [depositedPools, setDepositedPools] = useState<PoolsState>({})
  const lpts = useSelector((state: AppState) => state.lpts)
  const { pools } = usePool()

  const getDepositedPools = useCallback(() => {
    const newDepositedPools: PoolsState = {}
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
