import { ReactNode } from 'react'

import { Button, Col, Divider, Modal, Row, Space, Typography } from 'antd'
import { MintAvatar } from 'app/components/mint'
import IonIcon from 'shared/antd/ionicon'

const Content = ({
  label = '',
  avatar = undefined,
  value = '',
  color = undefined,
  subValue = undefined,
  floatRight = false,
}: {
  label?: string
  avatar?: ReactNode
  value?: string | number
  color?: string | undefined
  subValue?: string | number | undefined
  floatRight?: boolean
}) => {
  const textAlign = floatRight ? 'right' : 'left'
  return (
    <Space size={12} direction="vertical" style={{ textAlign: textAlign }}>
      <Typography.Text>{label}</Typography.Text>
      {avatar}
      <Typography.Title level={3} style={{ color: color ? color : 'inherit' }}>
        {value}
      </Typography.Title>
      {subValue && (
        <Typography.Title
          level={5}
          style={{ textDecoration: 'line-through' }}
          type="secondary"
        >
          {subValue}
        </Typography.Title>
      )}
    </Space>
  )
}

const TimeInfo = ({
  label = '',
  value = '',
}: {
  label?: string
  value?: string | number
}) => {
  return (
    <Row gutter={[16, 16]}>
      <Col flex="auto">
        <Typography.Text
          style={{
            display: 'list-item',
            listStyleType: 'square',
            marginLeft: 16,
          }}
        >
          {label}
        </Typography.Text>
      </Col>
      <Col>
        <Typography.Text>{value}</Typography.Text>
      </Col>
    </Row>
  )
}

const ReinvestmentConfirm = ({
  visible = false,
  onClose = () => {},
}: {
  visible?: boolean
  onClose?: (visible: boolean) => void
}) => {
  return (
    <Modal
      visible={visible}
      footer={false}
      closeIcon={<IonIcon name="close-outline" />}
      onCancel={() => onClose(false)}
    >
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Typography.Title level={5}>Confirm</Typography.Title>
        </Col>
        <Col span={24}>
          <Row gutter={[16, 16]}>
            <Col flex="auto">
              <Content
                label="Est.pay"
                avatar={
                  <Space>
                    <MintAvatar mintAddress={''} />
                    <Typography.Title level={5}>BTC/SEN</Typography.Title>
                  </Space>
                }
                value={1}
              />
            </Col>
            <Col>
              <Content
                label="Est.receive"
                avatar={
                  <Space>
                    <MintAvatar mintAddress={''} />
                    <Typography.Title level={5}>SEN</Typography.Title>
                  </Space>
                }
                value={1200}
                subValue={1000}
                color="#3E8C6A"
                floatRight
              />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Divider />
        </Col>
        <Col span={24}>
          <Row gutter={[12, 12]}>
            <Col span={24}>
              <TimeInfo label="Start Date" value="2021-12-15" />
            </Col>
            <Col span={24}>
              <TimeInfo label="Locked Periold" value="7 Days" />
            </Col>
            <Col span={24}>
              <TimeInfo label="End Date" value="2021-12-22" />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Button type="primary" block>
            Confirm
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}
export default ReinvestmentConfirm
