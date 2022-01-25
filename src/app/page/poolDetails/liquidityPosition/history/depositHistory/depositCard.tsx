import { Card, Col, Row, Space, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'

const DepositCard = () => {
  return (
    <Card
      bordered={false}
      className="history-card"
      style={{ boxShadow: 'unset', borderRadius: 8 }}
      bodyStyle={{ padding: '8px 12px' }}
    >
      <Row gutter={12}>
        <Col>
          <IonIcon style={{ color: '#7A7B85' }} name="enter-outline" />
        </Col>
        <Col flex="auto">
          <Space direction="vertical">
            <Typography.Text>1BTC + 2 SEN</Typography.Text>
            <Typography.Text type="secondary">
              3 Dec, 2021 15:13
            </Typography.Text>
          </Space>
        </Col>
        <Col>
          <Typography.Text>10 LP</Typography.Text>
        </Col>
      </Row>
    </Card>
  )
}

export default DepositCard
