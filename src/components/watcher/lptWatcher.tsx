import { Fragment, useCallback, useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { account } from '@senswap/sen-js'
import { useAccount, useWalletAddress } from '@sentre/senhub'

import { notifyError } from 'helper'
import { AppDispatch } from 'model'
import { getLPTs, upsetLPT } from 'model/lpts.controller'

// Watch id
let watchId = 0

const LptWatcher = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { accounts } = useAccount()
  const walletAddress = useWalletAddress()

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
      if (!account.isAddress(walletAddress)) return
      await dispatch(getLPTs({ accounts: accountData })).unwrap()
    } catch (er) {
      await notifyError(er)
    }
  }, [dispatch, accountData, walletAddress])
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
