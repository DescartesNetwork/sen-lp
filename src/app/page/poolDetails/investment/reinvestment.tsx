import { ReactNode, useState } from 'react'

import { Card, Col, Popover, Row, Space, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import ReinvestmentConfirm from './reinvestmentConfirm'
import ReinvestmentFrom from './reinvestmentForm'

const NumBox = ({ value = '' }: { value?: string | number }) => {
  return (
    <Card
      style={{ borderRadius: 8, background: 'tranparent' }}
      bodyStyle={{
        padding: 0,
        width: 40,
        height: 40,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography.Text style={{ fontSize: 16 }}>{value}</Typography.Text>
    </Card>
  )
}

const PriceInfo = ({
  label = '',
  value = '',
  discount = false,
  description = null,
}: {
  label?: string
  value?: ReactNode | string | number
  discount?: boolean
  description?: ReactNode
}) => {
  const styles = discount
    ? { fontWeight: 700, color: '#F9575E' }
    : { fontWeight: 700 }
  return (
    <Row gutter={[8, 8]}>
      <Col flex="auto">
        <Space size={4}>
          <Typography.Text style={styles}>{label}</Typography.Text>
          {description && (
            <Popover
              content={description}
              placement="leftTop"
              arrowPointAtCenter
            >
              <IonIcon name="help-circle" />
            </Popover>
          )}
        </Space>
      </Col>
      <Col>
        <Typography.Text
          style={{
            ...styles,
            textDecoration: !discount ? 'line-through' : 'unset',
          }}
          type={!discount ? 'secondary' : undefined}
        >
          {value}
          <small>%</small>
        </Typography.Text>
      </Col>
    </Row>
  )
}

const ReInvestment = () => {
  const [visible, setVisible] = useState(false)
  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} lg={12}>
        <Space direction="vertical" size={10}>
          <Space size={4}>
            <Typography.Text>Duration unlock (days)</Typography.Text>
            <IonIcon name="alert-circle-outline" />
          </Space>
          <Space size={24}>
            {[7, 30, 60, 90].map((item, idx) => (
              <NumBox value={item} key={idx} />
            ))}
          </Space>
        </Space>
      </Col>
      <Col xs={24} lg={12}>
        <Row gutter={[5, 5]}>
          <Col span={24}>
            <PriceInfo label="SEN Buyback" value="199" discount />
          </Col>
          <Col span={24}>
            <PriceInfo
              label="Farming"
              value="118"
              description={<Typography.Text>Farming title</Typography.Text>}
            />
          </Col>
          <Col span={24}>
            <PriceInfo
              label="Market Buyback"
              value="100"
              description={
                <Typography.Text>Market buyback title</Typography.Text>
              }
            />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Typography.Text>
          <span style={{ fontWeight: 700, color: 'inherit' }}>
            Sen Buying Offering:
          </span>{' '}
          Sell your LPTs with juicy profit. No gas, no slippage. X% tokens
          unlocked per day. Rewards dropped 8am UTC next day.
        </Typography.Text>
      </Col>
      <Col span={24}>
        <ReinvestmentFrom onConfirm={setVisible} />
      </Col>
      <ReinvestmentConfirm visible={visible} onClose={setVisible} />
    </Row>
  )
}
export default ReInvestment
