import moment from 'moment'

import { Typography } from 'antd'

import { HistoryDeposit } from 'model/history.controller'
import ColumnToken from './columnToken'

export const HISTORY_DEPOSIT_COLUMNS = [
  {
    title: 'TIME',
    render: (record: HistoryDeposit) => (
      <Typography.Text>
        {moment(record.time * 1000).format('MMM DD, YYYY HH:mm')}
      </Typography.Text>
    ),
  },
  {
    title: 'TOKEN',
    width: 300,
    render: (record: HistoryDeposit) => <ColumnToken record={record} />,
  },
]
