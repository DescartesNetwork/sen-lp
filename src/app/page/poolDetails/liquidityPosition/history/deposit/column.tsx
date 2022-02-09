import moment from 'moment'

import { Typography } from 'antd'

import { HistoryDepositType } from 'app/model/history.controller'
import ColumnToken from './columnToken'

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
    width: 300,
    render: (text: string, record: HistoryDepositType) => (
      <ColumnToken record={record} />
    ),
  },
]
