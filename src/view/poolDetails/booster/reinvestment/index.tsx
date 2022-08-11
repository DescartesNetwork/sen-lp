import { useState } from 'react'
import { useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'

import { Button, Col, Row, Space, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import Confirm from './confirm'
import Form from './form'
import Discount from './discount'

import { VESTING } from 'constant'
import { AppState } from 'model'
import { usePool } from 'hooks/pools/usePool'

const LOCKTIMES = VESTING.map(({ locktime }) => locktime)

const Reinvestment = ({ poolAddress }: { poolAddress: string }) => {
  const [visible, setVisible] = useState(false)
  const [amount, setAmount] = useState('')
  const [locktime, setLocktime] = useState(LOCKTIMES[0])
  const { retailers } = useSelector((state: AppState) => state)
  const { pools } = usePool()

  const poolData = pools[poolAddress]
  const retailerIndex = Object.values(retailers).findIndex(
    ({ mint_bid }) => mint_bid === poolData?.mint_lpt,
  )
  const retailerAddress = Object.keys(retailers)[retailerIndex]
  const noRetailer = !account.isAddress(retailerAddress)

  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} lg={12}>
        <Space direction="vertical" size={10}>
          <Space size={4}>
            <Typography.Text>Lock Time (Days)</Typography.Text>
            <IonIcon name="alert-circle-outline" />
          </Space>
          <Space size={16}>
            {LOCKTIMES.map((value) => (
              <Button
                key={value}
                type={locktime === value ? 'primary' : 'default'}
                icon={value}
                onClick={() => setLocktime(value)}
              />
            ))}
          </Space>
        </Space>
      </Col>
      <Col xs={24} lg={12}>
        <Discount locktime={locktime} />
      </Col>
      <Col span={24}>
        <Typography.Text>
          <span style={{ fontWeight: 700, color: 'inherit' }}>
            SNTR Buy-back Offering:
          </span>{' '}
          Selling your LP tokens with juicy profit. No fee, no slippage. The
          tokens will be unlocked after the selected period.
        </Typography.Text>
      </Col>
      <Col span={24}>
        <Form poolAddress={poolAddress} value={amount} onChange={setAmount} />
      </Col>
      <Col span={24}>
        <Button
          type="primary"
          icon={
            <IonIcon name={noRetailer ? 'help-circle-outline' : 'diamond'} />
          }
          onClick={() => setVisible(true)}
          disabled={!parseFloat(amount) || noRetailer}
          block
        >
          {noRetailer ? 'There is no campaign on this pool' : 'Buy SNTR'}
        </Button>
      </Col>
      {!noRetailer && (
        <Confirm
          retailerAddress={retailerAddress}
          amount={amount}
          locktime={locktime}
          visible={visible}
          onClose={() => setVisible(false)}
        />
      )}
    </Row>
  )
}

export default Reinvestment
