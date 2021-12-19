import { useState } from 'react'

import { Col, Row, Space, Typography, Select, Button } from 'antd'
import NumericInput from 'shared/antd/numericInput'
import IonIcon from 'shared/antd/ionicon'

const SelectMint = () => {
  const [selected, setSelected] = useState('sl_default')
  return (
    <Select
      value={selected}
      onChange={setSelected}
      bordered={false}
      style={{ marginLeft: '-7px' }}
    >
      <Select.Option value={'sl_default'}>
        <Typography.Text>BTC/SEN</Typography.Text>
      </Select.Option>
      {[1, 2, 3].map((option, idx) => (
        <Select.Option value={`option_${option}`} key={idx}>
          Option {option}
        </Select.Option>
      ))}
    </Select>
  )
}

const ReinvestmentFrom = ({
  onConfirm = () => {},
}: {
  onConfirm?: (visible: boolean) => void
}) => {
  const [amount, setAmount] = useState('')
  return (
    <Row gutter={[12, 12]}>
      <Col flex="auto">
        <Typography.Text>Your Balance</Typography.Text>
      </Col>
      <Col>
        <Space size={4} className="caption">
          <Typography.Text type="secondary">Available:</Typography.Text>
          <Typography.Text type="secondary">37.8 LPT</Typography.Text>
        </Space>
      </Col>
      <Col span={24}>
        <NumericInput
          value={amount}
          onValue={setAmount}
          prefix={<SelectMint />}
        />
      </Col>
      <Col span={24}>
        <Button
          type="primary"
          icon={<IonIcon name="diamond" />}
          onClick={() => onConfirm(true)}
          block
        >
          Buy SEN
        </Button>
      </Col>
    </Row>
  )
}

export default ReinvestmentFrom
