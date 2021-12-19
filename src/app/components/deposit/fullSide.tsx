import { Row, Col, Button, Checkbox } from 'antd'
import { useState } from 'react'
import LPT from './lpt'
/**
 * Main
 */
const FullSide = ({
  poolAddress,
  onClose = () => {},
}: {
  poolAddress: string
  onClose?: () => void
}) => {
  const [acceptable, setAcceptable] = useState(false)
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <LPT value={''} poolAddress={''} />
      </Col>
      <Col span={24}>
        <Checkbox
          checked={acceptable}
          onChange={() => setAcceptable(!acceptable)}
        >
          I have read. understand and agree to Sentre Liquid Swap Term of Use
        </Checkbox>
      </Col>
      <Col span={24}>
        <Button
          type="primary"
          onClick={() => {}}
          disabled={!acceptable}
          block
          loading={false}
        >
          Deposit
        </Button>
      </Col>
    </Row>
  )
}

export default FullSide
