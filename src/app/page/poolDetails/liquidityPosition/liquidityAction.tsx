import { Button, Col, Row } from 'antd'
import IonIcon from 'shared/antd/ionicon'

const LiquidityAction = () => {
  return (
    <Row gutter={[12, 12]}>
      <Col span={12}>
        <Button icon={<IonIcon name="log-out-outline" />} block>
          Withdraw
        </Button>
      </Col>
      <Col span={12}>
        <Button type="primary" icon={<IonIcon name="log-in-outline" />} block>
          Deposit
        </Button>
      </Col>
    </Row>
  )
}

export default LiquidityAction
