import { utils } from '@senswap/sen-js'
import { Fragment } from 'react'
import { util } from '@sentre/senhub'

import { Space, Typography } from 'antd'
import { HistoryWithdraw } from 'model/history.controller'
import { MintSymbol } from 'shared/antd/mint'

const ColumnToken = ({ record }: { record: HistoryWithdraw }) => {
  return (
    <Typography.Text>
      <Space size={4}>
        {record.actions.map(({ mint, amount, decimals }, index) => {
          const amountUi = utils.undecimalize(amount, decimals)
          return (
            <Fragment key={index}>
              {util.numeric(amountUi).format('0,0.[0000]')}
              <MintSymbol mintAddress={mint} />
              {index !== record.actions.length - 1 && '+'}
            </Fragment>
          )
        })}
      </Space>
    </Typography.Text>
  )
}

export default ColumnToken
