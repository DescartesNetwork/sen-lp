import moment from 'moment'

import { Typography } from 'antd'
import ColumnToken from './columnToken'

import { HistoryWithdrawType } from 'app/model/history.controller'

export const HISTORY_COLUMN = [
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
    render: (text: string, record: HistoryWithdrawType) => (
      <ColumnToken record={record} />
    ),
  },
]
