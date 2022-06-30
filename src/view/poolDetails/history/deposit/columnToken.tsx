import { useSelector } from 'react-redux'
import { utils } from '@senswap/sen-js'
import { usePool, util } from '@sentre/senhub'

import { Space, Typography } from 'antd'

import { AppState } from 'model'
import { HistoryDeposit } from 'model/history.controller'
import { MintSymbol } from 'shared/antd/mint'
import useMintDecimals from 'shared/hooks/useMintDecimals'

const ColumnToken = ({ record }: { record: HistoryDeposit }) => {
  const {
    main: { selectedPoolAddress: poolAddress },
  } = useSelector((state: AppState) => state)
  const { pools } = usePool()
  const { mint_a, mint_b } = pools[poolAddress] || {}
  const decimalA = useMintDecimals(mint_a) || 0
  const decimalB = useMintDecimals(mint_b) || 0

  return (
    <Typography.Text>
      <Space size={4}>
        {util
          .numeric(utils.undecimalize(record.amount_a, decimalA))
          .format('0,0.[0000]')}
        <MintSymbol mintAddress={mint_a} />+{' '}
        {util
          .numeric(utils.undecimalize(record.amount_b, decimalB))
          .format('0,0.[0000]')}
        <MintSymbol mintAddress={mint_b} />
      </Space>
    </Typography.Text>
  )
}

export default ColumnToken
