import { Row, Col, Typography } from 'antd'
import { utils } from '@senswap/sen-js'

import FullSide from './fullSide'

const FEE_DECIMALS_PERCENT = 7

const Deposit = ({
  poolAddress,
  onClose = () => {},
}: {
  poolAddress: string
  onClose?: () => void
}) => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Typography.Title level={5}>Deposit Liquidity</Typography.Title>
      </Col>
      <Col span={24}>
        <Typography.Paragraph type="secondary">
          <strong>Liquidity provider incentive.</strong> Liquidity providers
          earn a {0.1}% fee on all trades proportional to their share of the
          pool. Fees are accrued into the pool and can be claimed by withdrawing
          your liquidity.
        </Typography.Paragraph>
        <Typography.Paragraph type="secondary">
          <strong>Asymmetric Deposit.</strong> Instead of depositing amounts of
          tokens proportionally, Asymmetric Deposit allows you to deposit even
          one side of token. The pool will automatically re-balance itself.
        </Typography.Paragraph>
      </Col>
      <Col span={24}>
        <FullSide poolAddress={poolAddress} onClose={onClose} />
      </Col>
    </Row>
  )
}

export default Deposit
