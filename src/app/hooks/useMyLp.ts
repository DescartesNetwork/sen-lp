import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { utils } from '@senswap/sen-js'

import { AppState } from 'app/model'

const LPT_DECIMALS = 9

export const useMyLp = (poolAddress: string) => {
  const { lpts } = useSelector((state: AppState) => state)

  const { amount, balance } = useMemo(() => {
    const addr =
      Object.keys(lpts).find((addr) => lpts[addr].pool === poolAddress) || ''
    const amount = lpts[addr]?.amount || BigInt(0)
    const balance = Number(utils.undecimalize(amount, LPT_DECIMALS))
    return { amount, balance }
  }, [lpts, poolAddress])

  return {
    amount,
    balance,
  }
}
