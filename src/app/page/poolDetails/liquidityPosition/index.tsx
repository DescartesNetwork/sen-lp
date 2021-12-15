import { Button, Card, Col, Row, Space, Typography } from 'antd'
import { MintAvatar } from 'app/shared/components/mint'
import { ReactNode } from 'react'
import IonIcon from 'shared/antd/ionicon'
import LiquidityAction from './liquidityAction'

const Content = ({
  label = 'label',
  title = '',
  subTitle = null,
}: {
  label?: string
  title?: string | ReactNode
  subTitle?: string | null
}) => {
  return (
    <Space direction="vertical" size={4}>
      <Typography.Text className="caption" type="secondary">
        {label}
      </Typography.Text>
      <span>{title}</span>
      {subTitle && (
        <Typography.Text type="secondary">{subTitle}</Typography.Text>
      )}
    </Space>
  )
}

const Title = ({
  value = 0,
  sub = '',
}: {
  value?: string | number
  sub?: string
}) => {
  return (
    <Space size={4} align="baseline">
      <Typography.Title level={3}>{value}</Typography.Title>
      {sub && (
        <Typography.Text className="caption" type="secondary">
          {sub}
        </Typography.Text>
      )}
    </Space>
  )
}

const InservePrice = () => {
  return (
    <Space>
      <MintAvatar mintAddress="mint" />
      <Typography.Text>0.5 BTC/SEN</Typography.Text>
      <Button type="text" icon={<IonIcon name="swap-horizontal-outline" />} />
    </Space>
  )
}

const LiquidityPosition = () => {
  return (
    <Card bordered={false}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Typography.Title level={4}>Liquidity Position</Typography.Title>
        </Col>
        <Col span={21}>
          <Row gutter={[20, 20]}>
            <Col span={8}>
              <Content
                label="My LPT"
                title={<Title value={8.192} sub="LPT" />}
              />
            </Col>
            <Col span={16}>
              <Content
                label="Pool Share Composition"
                title={
                  <Space size={4} align="baseline">
                    <Title value={8.192} sub="SEN" />
                    <Typography.Title level={5}>+</Typography.Title>
                    <Title value={8.192} sub="BTC" />
                  </Space>
                }
              />
            </Col>
            <Col span={8}>
              <Content
                label="My Portion"
                title={<Title value="0.13%" />}
                subTitle="Over 6.26k LPT"
              />
            </Col>
            <Col span={16}>
              <Content label="In - Pool Price" title={<InservePrice />} />
            </Col>
          </Row>
        </Col>
        <Col span={3}>
          <Content label="APY" title={<Title value="15%" />} />
        </Col>
        <Col span={24}>
          <LiquidityAction />
        </Col>
      </Row>
    </Card>
  )
}

export default LiquidityPosition
