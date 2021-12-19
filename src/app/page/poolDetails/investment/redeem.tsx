import { Button, Card, Col, Divider, Row, Space, Typography } from 'antd'
import { MintAvatar } from 'app/shared/components/mint'
import IonIcon from 'shared/antd/ionicon'

const CardContent = ({
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

const Redeem = () => {
  const data = [
    { label: 'Total Amount (SEN)', value: 37 },
    { label: 'Locked Periold', value: 7, symbol: 'Days' },
    { label: 'Accrue Days', value: 1, symbol: 'Days' },
    { label: 'Start Date', value: '15/12/2021' },
    { label: 'End Date', value: '22/12/2021' },
    { label: 'Estimated Interest', value: 1141241215, est: true },
  ]
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Space>
          <MintAvatar mintAddress={''} size={24} />
          <Divider type="vertical" />
          <Typography.Text>Vesting token in 7 Days</Typography.Text>
        </Space>
      </Col>
      <Col span={24}>
        <Card
          bodyStyle={{ padding: 24, borderRadius: 8 }}
          style={{ background: 'transparent' }}
        >
          <Row gutter={[16, 16]}>
            {data?.map((item, idx) => (
              <Col xs={12} lg={8} key={idx}>
                <CardContent
                  label={item.label}
                  value={item.value}
                  est={item.est}
                  symbol={item.symbol}
                />
              </Col>
            ))}
          </Row>
        </Card>
      </Col>
      <Col span={24}>
        <Button
          type="primary"
          icon={<IonIcon name="diamond" />}
          onClick={() => {}}
          block
        >
          Redeem
        </Button>
      </Col>
    </Row>
  )
}

export default Redeem
