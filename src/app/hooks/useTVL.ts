import { useEffect, useState } from 'react'

import { useMint, usePool } from 'senhub/providers'
import { getTVL } from 'app/helper'
export const useTVL = (poolAddress?: string) => {
  const { tokenProvider } = useMint()
  const { pools } = usePool()
  const [tvl, setTVL] = useState(0)

  useEffect(() => {
    ;(async () => {
      if (!poolAddress) return
      const tvlResult = await getTVL(poolAddress, tokenProvider, pools)
      setTVL(tvlResult)
    })()
  }, [poolAddress, pools, tokenProvider])

  return {
    tvl,
  }
}
