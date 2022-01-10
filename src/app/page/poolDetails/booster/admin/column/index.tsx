import { OrderData } from '@senswap/sen-js'
import { Typography } from 'antd'
import ColumnAsk from './columnAsk'
import ColumnBid from './columnBid'
import ColumnStatus from './columnStatus'

export type OrderType = OrderData & {
  address: string
}

export const ADMIN_COLUMNS = [
  {
    title: 'PAY',
    dataIndex: 'ask_amount',
    key: 'ask_amount',
    width: 120,
    render: (askAmount: bigint, record: OrderType) => (
      <ColumnAsk ask_amount={askAmount} retailer={record.retailer} />
    ),
  },
  {
    title: 'RECEIVE',
    dataIndex: 'bid_amount',
    key: 'bid_amount',
    width: 120,
    render: (bidAmount: bigint, record: OrderType) => (
      <ColumnBid bid_amount={bidAmount} retailer={record.retailer} />
    ),
  },
  {
    title: 'LOCKED',
    dataIndex: 'locked_time',
    key: 'locked_time',
    width: 80,
    render: (locked_time: bigint) => (
      <Typography.Text>
        {Number(locked_time) / (24 * 60 * 60)} days
      </Typography.Text>
    ),
  },

  {
    title: 'ACTIONS',
    key: 'state',
    dataIndex: 'state',
    width: 100,
    render: (state: number, record: OrderType) => (
      <ColumnStatus state={state} orderData={record} />
    ),
  },
]
