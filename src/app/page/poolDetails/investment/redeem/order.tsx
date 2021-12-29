import { Space, Typography } from 'antd'

const Order = ({
  label = '',
  value = '',
  symbol = undefined,
  est = false,
}: {
  label?: string
  value?: string | number
  est?: boolean
  symbol?: string | undefined
}) => {
  return (
    <Space direction="vertical" size={0}>
      <Typography.Text type="secondary">{label}</Typography.Text>
      <Typography.Text type={est ? 'secondary' : undefined}>
        {value}
        {symbol && <span>{symbol}</span>}
      </Typography.Text>
    </Space>
  )
}

export default Order
