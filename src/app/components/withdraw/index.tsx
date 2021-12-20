import { Row, Col, Typography, Button } from 'antd'
import LPT from './lpt'
import Info from './info'

const Withdraw = ({
  lptAddress,
  onClose = () => {},
}: {
  lptAddress: string
  onClose?: () => void
}) => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Typography.Title level={5}>Withdraw Liquidity</Typography.Title>
      </Col>
      <Col span={24}>
        <LPT lptAddress={lptAddress} onChange={() => {}} />
      </Col>
      <Col span={24}>
        <Info mintAddresses={['']} amounts={['']} />
      </Col>
      <Col span={24}>
        <Button
          type="primary"
          onClick={() => {}}
          disabled={false}
          block
          loading={false}
        >
          Withdraw
        </Button>
      </Col>
    </Row>
  )
}

export default Withdraw
