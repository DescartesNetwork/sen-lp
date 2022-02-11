import { useSelector } from 'react-redux'
import { usePool } from '@senhub/providers'
import { utils } from '@senswap/sen-js'

import { Space, Typography } from 'antd'

import { AppState } from 'app/model'
import { HistoryDeposit } from 'app/model/history.controller'
import { MintSymbol } from 'shared/antd/mint'
import useMintDecimals from 'shared/hooks/useMintDecimals'
import { numeric } from 'shared/util'

const ColumnToken = ({ record }: { record: HistoryDeposit }) => {
  const {
    main: { selectedPoolAddress: poolAddress },
  } = useSelector((state: AppState) => state)
  const { mint_a, mint_b } = usePool().pools?.[poolAddress] || ''
  const decimalA = useMintDecimals(mint_a) || 0
  const decimalB = useMintDecimals(mint_b) || 0
  return (
    <Typography.Text>
      <Space size={4}>
        {numeric(utils.undecimalize(record.amount_a, decimalA)).format(
          '0,0.[0000]',
        )}
        <MintSymbol mintAddress={mint_a} />+{' '}
        {numeric(utils.undecimalize(record.amount_b, decimalB)).format(
          '0,0.[0000]',
        )}
        <MintSymbol mintAddress={mint_b} />
      </Space>
    </Typography.Text>
  )
}

export default ColumnToken
