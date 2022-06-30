import { useCallback, useEffect, useState } from 'react'

import { usePoolTvl } from './usePoolTvl'

export const useTotalPoolTvl = (poolAddresses?: string[]) => {
  const [totalTvl, setTotalTvl] = useState(0)
  const { getTvl } = usePoolTvl()

  const calculateTotalTvl = useCallback(
    async (poolAddresses?: string[]) => {
      if (!poolAddresses?.length) return setTotalTvl(0)
      let totalTVL = 0
      for (const poolAddress of poolAddresses) {
        const tvl = await getTvl(poolAddress)
        totalTVL += tvl
      }
      setTotalTvl(totalTVL)
    },
    [getTvl],
  )

  useEffect(() => {
    calculateTotalTvl(poolAddresses)
  }, [calculateTotalTvl, poolAddresses])

  return totalTvl
}
