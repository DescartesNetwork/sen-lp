import { useCallback, useEffect, useState } from 'react'

import { usePool, useWallet } from 'senhub/providers'
import { PoolsState } from 'os/store/pools.reducer'
import { useSelector } from 'react-redux'
import { AppState } from 'app/model'

export const useYourPools = () => {
  const [yourPools, setYourPools] = useState<PoolsState>({})
  const lpts = useSelector((state: AppState) => state.lpts)
  const { wallet } = useWallet()
  const { pools } = usePool()

  const getYourPools = useCallback(() => {
    const newYourPools: PoolsState = {}
    for (const lptAddr in lpts) {
      const { pool } = lpts[lptAddr]
      const poolData = pools[pool]
      if (poolData && poolData.owner === wallet.address)
        newYourPools[pool] = poolData
    }
    return setYourPools(newYourPools)
  }, [lpts, pools, wallet.address])

  useEffect(() => {
    getYourPools()
  }, [getYourPools])

  return { yourPools }
}
