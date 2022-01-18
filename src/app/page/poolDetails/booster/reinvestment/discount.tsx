import { ReactNode } from 'react'

import { Col, Popover, Row, Space, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { VESTING } from 'app/constant'
import { numeric } from 'shared/util'

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
  const styles = { color: discount ? '#F9575E' : 'inherit' }
  return (
    <Row gutter={[8, 8]} align="bottom">
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
        <Typography.Title
          style={{
            ...styles,
            textDecoration: !discount ? 'line-through' : 'unset',
          }}
          level={!discount ? 5 : 3}
        >
          {value}
          <small>%</small>
        </Typography.Title>
      </Col>
    </Row>
  )
}

const Discount = ({ locktime }: { locktime: number }) => {
  const discount =
    VESTING.find(({ locktime: l }) => l === locktime)?.discount || 0
  return (
    <Row gutter={[5, 5]}>
      <Col span={24}>
        <PriceInfo
          label="SNTR Buy-back"
          value={numeric((discount + 1) * 100).format('0.[00]')}
          discount
        />
      </Col>
      <Col span={24}>
        <PriceInfo label="Market Buy-back" value="100" />
      </Col>
    </Row>
  )
}

export default Discount
