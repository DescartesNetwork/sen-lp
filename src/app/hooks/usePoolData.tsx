import { usePool } from '@senhub/providers'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { AppState } from 'app/model'

const usePoolData = () => {
  const { pools } = usePool()
  const {
    main: { selectedPoolAddress: poolAddress },
  } = useSelector((state: AppState) => state)

  const poolData = useMemo(() => {
    return pools[poolAddress] || {}
  }, [poolAddress, pools])

  return poolData
}

export default usePoolData
