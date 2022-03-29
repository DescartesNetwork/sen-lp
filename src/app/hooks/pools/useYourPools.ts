import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { usePool, useWallet } from '@senhub/providers'
import { PoolData } from '@senswap/sen-js'

import { AppState } from 'app/model'

export const useYourPools = () => {
  const [yourPools, setYourPools] = useState({})
  const lpts = useSelector((state: AppState) => state.lpts)
  const { wallet } = useWallet()
  const { pools } = usePool()

  const getYourPools = useCallback(() => {
    const newYourPools: Record<string, PoolData> = {}
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
