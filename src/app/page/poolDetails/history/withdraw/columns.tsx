import moment from 'moment'

import { Typography } from 'antd'
import ColumnToken from './columnToken'

import { HistoryWithdraw } from 'app/model/history.controller'

export const HISTORY_COLUMNS = [
  {
    title: 'TIME',
    render: (record: HistoryWithdraw) => (
      <Typography.Text>
        {moment(record.time * 1000).format('MMM DD, YYYY HH:mm')}
      </Typography.Text>
    ),
  },
  {
    title: 'TOKEN',
    width: 300,
    render: (record: HistoryWithdraw) => <ColumnToken record={record} />,
  },
]
