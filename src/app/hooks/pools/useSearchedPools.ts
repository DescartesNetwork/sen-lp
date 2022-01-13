import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'
import { forceCheck } from '@senswap/react-lazyload'
import { useMint } from '@senhub/providers'

import { PoolsState } from 'os/store/pools.reducer'
import { AppState } from 'app/model'

const KEYSIZE = 3
let timeOutForceCheck: NodeJS.Timeout

export const useSearchedPools = (pools: PoolsState) => {
  const { tokenProvider } = useMint()
  const [searchedPools, setSearchedPools] = useState<PoolsState>({})
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
    [pools, search, tokenProvider],
  )

  const searchPools = useCallback(
    async (pools: PoolsState) => {
      if (!search || search.length < KEYSIZE) return setSearchedPools(pools)
      const newSearchedPools: PoolsState = {}
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
