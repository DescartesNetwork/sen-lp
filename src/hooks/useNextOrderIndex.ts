import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useWalletAddress } from '@sentre/senhub'

import { AppState } from 'model'
import configs from 'configs'

const LIMIT = 10000

const useNextOrderIndex = (retailerAddress: string): number => {
  const [index, setIndex] = useState(0)
  const { orders } = useSelector((state: AppState) => state)
  const walletAddress = useWalletAddress()

  const orderAddresses = Object.keys(orders)
  const searchIndex = useCallback(async () => {
    try {
      const {
        sol: { purchasing },
      } = configs
      let index = 0
      while (index < LIMIT) {
        const orderAddress = await purchasing.deriveOrderAddress(
          index,
          walletAddress,
          retailerAddress,
        )
        if (!orderAddresses.includes(orderAddress)) break
        index = index + 1
      }
      return setIndex(index)
    } catch (er: any) {
      return setIndex(0)
    }
  }, [retailerAddress, orderAddresses, walletAddress])

  useEffect(() => {
    searchIndex()
  }, [searchIndex])

  return index
}

export default useNextOrderIndex
