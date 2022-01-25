import { Typography } from 'antd'

export const HISTORY_COLUMN = [
  {
    title: 'TIME',
    dataIndex: 'time',
  },
  {
    title: 'TOKEN',
    dataIndex: 'token',
    render: (text: string) => <Typography.Text>{text}</Typography.Text>,
  },
  {
    title: 'LIQUIDITY POSITION',
    dataIndex: 'liquidity',
    render: (text: string) => <Typography.Text>{text}</Typography.Text>,
  },
]

export const DATA_DEMO = [
  {
    time: '14 Nov, 2021 16:00',
    token: '1BTC + 2 SEN',
    liquidity: '10LP',
  },
  {
    time: '13 Nov, 2021 16:00',
    token: '1BTC + 2 SEN',
    liquidity: '10LP',
  },
  {
    time: '11 Nov, 2021 16:00',
    token: '1BTC + 2 SEN',
    liquidity: '10LP',
  },
  {
    time: '12 Nov, 2021 16:00',
    token: '1BTC + 2 SEN',
    liquidity: '10LP',
  },
]
