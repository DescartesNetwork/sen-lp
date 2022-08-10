import { Fragment, useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { account } from '@senswap/sen-js'
import { useWalletAddress } from '@sentre/senhub'

import { notifyError } from 'helper'
import { AppDispatch } from 'model'
import { getRetailers, upsetRetailer } from 'model/retailers.controller'
import configs from 'configs'

const {
  sol: { purchasing },
} = configs

// Watch id
let watchId = 0

const RetailerWatcher = () => {
  const dispatch = useDispatch<AppDispatch>()
  const walletAddress = useWalletAddress()

  // First-time fetching
  const fetchData = useCallback(async () => {
    try {
      if (!account.isAddress(walletAddress)) return
      await dispatch(getRetailers()).unwrap()
    } catch (er) {
      await notifyError(er)
    }
  }, [dispatch, walletAddress])
  // Watch account changes
  const watchData = useCallback(async () => {
    if (watchId) return console.warn('Already watched')
    const callback = (er: string | null, re: any) => {
      if (er) return console.error(er)
      const { address, data } = re
      return dispatch(upsetRetailer({ address, data }))
    }
    const filters = [{ dataSize: 161 }]
    watchId = purchasing.watch(callback, filters)
  }, [dispatch])

  useEffect(() => {
    fetchData()
    watchData()
    // Unwatch (cancel socket)
    return () => {
      ;(async () => {
        try {
          await purchasing.unwatch(watchId)
        } catch (er) {}
      })()
      watchId = 0
    }
  }, [fetchData, watchData])

  return <Fragment />
}

export default RetailerWatcher
