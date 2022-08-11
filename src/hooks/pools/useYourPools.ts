import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useWalletAddress } from '@sentre/senhub'
import { PoolData } from '@senswap/sen-js'

import { AppState } from 'model'
import { usePool } from 'hooks/pools/usePool'

export const useYourPools = () => {
  const [yourPools, setYourPools] = useState({})
  const lpts = useSelector((state: AppState) => state.lpts)
  const walletAddress = useWalletAddress()
  const { pools } = usePool()

  const getYourPools = useCallback(() => {
    const newYourPools: Record<string, PoolData> = {}
    for (const lptAddr in lpts) {
      const { pool } = lpts[lptAddr]
      const poolData = pools[pool]
      if (poolData && poolData.owner === walletAddress)
        newYourPools[pool] = poolData
    }
    return setYourPools(newYourPools)
  }, [lpts, pools, walletAddress])

  useEffect(() => {
    getYourPools()
  }, [getYourPools])

  return { yourPools }
}
