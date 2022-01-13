import { utils } from '@senswap/sen-js'
import { usePool } from '@senhub/providers'

import { Row, Col, Typography } from 'antd'
import FullSide from './fullSide'

import { useState } from 'react'

const FEE_DECIMALS_PERCENT = 7

const Deposit = ({
  poolAddress,
  onClose = () => {},
}: {
  poolAddress: string
  onClose?: () => void
}) => {
  const { pools } = usePool()
  const [selectMint, setSelectMint] = useState('all')
  const { fee_ratio, tax_ratio } = pools[poolAddress] || {}
  const feeRatio = fee_ratio || BigInt(0)
  const taxRatio = tax_ratio || BigInt(0)

  const totalRatio = utils.undecimalize(
    feeRatio + taxRatio,
    FEE_DECIMALS_PERCENT,
  )
  const asymmetric = selectMint !== 'all'
  const asymmetricColor = asymmetric ? '#F9575E' : 'inherit'
  const asymmetricType = asymmetric ? undefined : 'secondary'

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Typography.Title level={5}>Deposit Liquidity</Typography.Title>
      </Col>
      <Col span={24}>
        <Typography.Paragraph type="secondary">
          <strong>Liquidity provider incentive.</strong> Liquidity providers
          earn a {totalRatio}% fee on all trades proportional to their share of
          the pool. Fees are accrued into the pool and can be claimed by
          withdrawing your liquidity.
        </Typography.Paragraph>
        <Typography.Paragraph type={asymmetricType}>
          <strong style={{ color: asymmetricColor }}>
            Asymmetric Deposit.
          </strong>{' '}
          Instead of depositing amounts of tokens proportionally, Asymmetric
          Deposit allows you to deposit even one side of token. The pool will
          automatically re-balance itself.
        </Typography.Paragraph>
      </Col>
      <Col span={24}>
        <FullSide
          poolAddress={poolAddress}
          onClose={onClose}
          onChange={setSelectMint}
        />
      </Col>
    </Row>
  )
}

export default Deposit
