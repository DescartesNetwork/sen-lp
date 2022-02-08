import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { account, Swap, utils } from '@senswap/sen-js'
import { useMint, usePool, useWallet } from '@senhub/providers'

import { Space, Typography } from 'antd'

import { AppState } from 'app/model'
import { numeric } from 'shared/util'

const ColumnLp = ({
  amount_a,
  amount_b,
}: {
  amount_a: bigint
  amount_b: bigint
}) => {
  const [lpt, setLPT] = useState('')
  const {
    main: { selectedPoolAddress: poolAddress },
  } = useSelector((state: AppState) => state)
  const { pools } = usePool()
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const { getMint } = useMint()

  const { reserve_a, reserve_b, mint_lpt, fee_ratio, tax_ratio } =
    pools[poolAddress]

  const estimateLPT = useCallback(async () => {
    if (!account.isAddress(walletAddress)) return setLPT('')
    try {
      const {
        [mint_lpt]: { supply },
      } = await getMint({ address: mint_lpt })
      const { lpt } = Swap.oracle.sided_deposit(
        amount_a,
        amount_b,
        reserve_a,
        reserve_b,
        supply,
        fee_ratio,
        tax_ratio,
      )
      return setLPT(utils.undecimalize(lpt, 9))
    } catch (er: any) {
      window.notify({ type: 'error', description: er.message })
    }
  }, [
    amount_a,
    amount_b,
    fee_ratio,
    getMint,
    mint_lpt,
    reserve_a,
    reserve_b,
    tax_ratio,
    walletAddress,
  ])

  useEffect(() => {
    estimateLPT()
  }, [estimateLPT])
  return (
    <Typography.Text>
      <Space size={4}>{numeric(lpt).format('0,0.[0000]')} LP</Space>
    </Typography.Text>
  )
}

export default ColumnLp
