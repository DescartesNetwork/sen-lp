import { ReactNode } from 'react'

import { Col, Popover, Row, Space, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'

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
  const styles = { fontWeight: 700, color: discount ? '#F9575E' : 'inherit' }
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

const Discount = ({ locktime }: { locktime: number }) => {
  return (
    <Row gutter={[5, 5]}>
      <Col span={24}>
        <PriceInfo label="SNTR Buyback" value="199" discount />
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
          description={<Typography.Text>Market buyback title</Typography.Text>}
        />
      </Col>
    </Row>
  )
}

export default Discount
