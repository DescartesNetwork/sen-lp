import LazyLoad from '@sentre/react-lazyload'

import { OrderData } from '@senswap/sen-js'
import { Typography } from 'antd'
import ColumnAsk from './columnAsk'
import ColumnBid from './columnBid'
import ColumnDiscount from './columnDiscount'
import ColumnStatus from './columnStatus'

const ROW_HEIGHT = 52

export type OrderType = OrderData & {
  address: string
}

export const ADMIN_COLUMNS = [
  {
    title: 'PAY',
    dataIndex: 'ask_amount',
    key: 'ask_amount',
    render: (ask_amount: bigint, record: OrderType) => (
      <LazyLoad height={ROW_HEIGHT} overflow>
        <ColumnAsk orderAddress={record.address} />
      </LazyLoad>
    ),
  },
  {
    title: 'RECEIVE',
    dataIndex: 'bid_amount',
    key: 'bid_amount',
    render: (bid_amount: bigint, record: OrderType) => (
      <LazyLoad height={ROW_HEIGHT} overflow>
        <ColumnBid orderAddress={record.address} />
      </LazyLoad>
    ),
  },
  {
    title: 'LOCKED',
    dataIndex: 'locked_time',
    key: 'locked_time',
    render: (locked_time: bigint) => (
      <LazyLoad height={ROW_HEIGHT} overflow>
        <Typography.Text>
          {Number(locked_time) / (24 * 60 * 60)} days
        </Typography.Text>
      </LazyLoad>
    ),
  },
  {
    title: 'DISCOUNT',
    render: (record: OrderType) => (
      <LazyLoad height={ROW_HEIGHT} overflow>
        <ColumnDiscount orderAddress={record.address} />
      </LazyLoad>
    ),
  },
  {
    title: 'ACTIONS',
    key: 'state',
    dataIndex: 'state',
    render: (state: number, record: OrderType) => (
      <LazyLoad height={ROW_HEIGHT} overflow>
        <ColumnStatus state={state} orderData={record} />
      </LazyLoad>
    ),
  },
]
