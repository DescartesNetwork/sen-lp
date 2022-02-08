import moment from 'moment'

import { Typography } from 'antd'

import { HistoryDepositType } from 'app/model/history.controller'
import ColumnToken from './columnToken'
import ColumnLp from '../columnLp'

export const HISTORY_DEPOSIT_COLUMN = [
  {
    title: 'TIME',
    dataIndex: 'time',
    render: (time: number) => (
      <Typography.Text>
        {moment(time * 1000).format('MMM DD, YYYY HH:mm')}
      </Typography.Text>
    ),
  },
  {
    title: 'TOKEN',
    dataIndex: 'token',
    width: 220,
    render: (text: string, record: HistoryDepositType) => (
      <ColumnToken record={record} />
    ),
  },
  {
    title: 'LIQUIDITY POSITION',
    dataIndex: 'liquidity',
    render: (text: string, record: HistoryDepositType) => (
      <ColumnLp amount_a={record.amount_a} amount_b={record.amount_b} />
    ),
  },
]
