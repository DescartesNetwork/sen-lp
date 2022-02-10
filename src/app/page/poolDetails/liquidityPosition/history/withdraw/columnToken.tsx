import { utils } from '@senswap/sen-js'

import { Space, Typography } from 'antd'
import { HistoryWithdraw } from 'app/model/history.controller'
import { MintSymbol } from 'shared/antd/mint'
import useMintDecimals from 'shared/hooks/useMintDecimals'

import { numeric } from 'shared/util'

const ColumnToken = ({ record }: { record: HistoryWithdraw }) => {
  const decimalA = useMintDecimals(record.mint_a) || 0
  const decimalB = useMintDecimals(record.mint_b) || 0

  return (
    <Typography.Text>
      <Space size={4}>
        {numeric(utils.undecimalize(BigInt(record.amount_a), decimalA)).format(
          '0,0.[0000]',
        )}
        <MintSymbol mintAddress={record.mint_a} />+{' '}
        {numeric(utils.undecimalize(BigInt(record.amount_b), decimalB)).format(
          '0,0.[0000]',
        )}
        <MintSymbol mintAddress={record.mint_b} />
      </Space>
    </Typography.Text>
  )
}

export default ColumnToken
