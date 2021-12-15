import { Fragment, useCallback, useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'

import { notifyError } from 'app/helper'
import { AppDispatch } from 'app/model'
import { getLPTs, upsetLPT } from 'app/model/lpts.controller'
import { useAccount, useWallet } from 'senhub/providers'

// Watch id
let watchId = 0

const LptWatcher = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { accounts } = useAccount()
  const {
    wallet: { address: walletAddress },
  } = useWallet()

  // First-time fetching
  const accountData = useMemo(
    () =>
      Object.keys(accounts).map((accountAddress) => ({
        address: accountAddress,
        ...accounts[accountAddress],
      })),
    [accounts],
  )
  const fetchData = useCallback(async () => {
    try {
      await dispatch(getLPTs({ accounts: accountData })).unwrap()
    } catch (er) {
      await notifyError(er)
    }
  }, [dispatch, accountData])
  // Watch account changes
  const watchData = useCallback(async () => {
    if (watchId) return console.warn('Already watched')
    const callback = (er: string | null, re: any) => {
      if (er) return console.error(er)
      const { address, data } = re
      return dispatch(upsetLPT({ address, data }))
    }
    const filters = [{ memcmp: { bytes: walletAddress, offset: 32 } }]
    watchId = window.sentre.splt.watch(callback, filters)
  }, [dispatch, walletAddress])

  useEffect(() => {
    fetchData()
    watchData()
    // Unwatch (cancel socket)
    return () => {
      ;(async () => {
        try {
          await window.sentre.splt.unwatch(watchId)
        } catch (er) {}
      })()
      watchId = 0
    }
  }, [fetchData, watchData])

  return <Fragment />
}

export default LptWatcher