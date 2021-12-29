import { useState } from 'react'

import { Button, Col, Row, Space, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import Confirm from './confirm'
import Form from './form'
import Discount from './discount'

const LOCKTIMES = [7, 30, 60, 90]

const Reinvestment = ({ poolAddress }: { poolAddress: string }) => {
  const [visible, setVisible] = useState(false)
  const [amount, setAmount] = useState('')
  const [locktime, setLocktime] = useState(LOCKTIMES[0])

  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} lg={12}>
        <Space direction="vertical" size={10}>
          <Space size={4}>
            <Typography.Text>Lock Time (days)</Typography.Text>
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
            SNTR Buy-Back Offering:
          </span>{' '}
          Sell your LPTs with juicy profit. No gas, no slippage. The tokens will
          be unlocked after the selected period.
        </Typography.Text>
      </Col>
      <Col span={24}>
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <Form
              poolAddress={poolAddress}
              value={amount}
              onChange={setAmount}
            />
          </Col>
          <Col span={24}>
            <Button
              type="primary"
              icon={<IonIcon name="diamond" />}
              onClick={() => setVisible(true)}
              block
            >
              Buy SEN
            </Button>
          </Col>
        </Row>
      </Col>
      <Confirm visible={visible} onClose={() => setVisible(false)} />
    </Row>
  )
}

export default Reinvestment
