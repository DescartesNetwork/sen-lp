import { Row, Col, Button, Checkbox } from 'antd'
import { useState } from 'react'
import Amount from '../amount'
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
  const [amounts, setAmounts] = useState<bigint[]>([BigInt(0), BigInt(0)])

  const onAmounts = (i: number, amount: bigint) => {
    let newAmounts = [...amounts]
    newAmounts[i] = amount
    setAmounts(newAmounts)
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Amount
          mintAddress={''}
          value={amounts[0]}
          onChange={(amount) => onAmounts(0, amount)}
        />
      </Col>
      <Col span={24}>
        <Amount
          mintAddress={''}
          value={amounts[0]}
          onChange={(amount) => onAmounts(0, amount)}
        />
      </Col>
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
