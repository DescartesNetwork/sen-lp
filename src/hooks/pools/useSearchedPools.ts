import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { account, PoolData } from '@senswap/sen-js'
import { forceCheck } from '@sentre/react-lazyload'
import { tokenProvider } from '@sentre/senhub'

import { AppState } from 'model'

const KEYSIZE = 3
let timeOutForceCheck: NodeJS.Timeout

export const useSearchedPools = (pools: Record<string, PoolData>) => {
  const [searchedPools, setSearchedPools] = useState({})
  const {
    main: { search },
  } = useSelector((state: AppState) => state)

  const checkPool = useCallback(
    async (poolAddress: string) => {
      if (account.isAddress(search) && search === poolAddress) return true
      const tokenInfos = await tokenProvider.find(search)
      if (!tokenInfos) return false

      const { mint_a, mint_b } = pools[poolAddress]
      const mintAddress = tokenInfos.map(({ address }) => address)
      if (mintAddress.includes(mint_a)) return true
      if (mintAddress.includes(mint_b)) return true
      return false
    },
    [pools, search],
  )

  const searchPools = useCallback(
    async (pools) => {
      if (!search || search.length < KEYSIZE) return setSearchedPools(pools)
      const newSearchedPools: Record<string, PoolData> = {}
      for (const poolAddress in pools) {
        const displayPool = await checkPool(poolAddress)
        if (displayPool) newSearchedPools[poolAddress] = pools[poolAddress]
      }
      return setSearchedPools(newSearchedPools)
    },
    [checkPool, search],
  )

  useEffect(() => {
    searchPools(pools)
    if (timeOutForceCheck) clearTimeout(timeOutForceCheck)
    timeOutForceCheck = setTimeout(forceCheck, 500)
  }, [pools, searchPools])

  return { searchedPools }
}
