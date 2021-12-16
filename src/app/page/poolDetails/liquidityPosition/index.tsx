import { ReactNode } from 'react'

import { Button, Card, Col, Row, Space, Typography } from 'antd'
import { MintAvatar } from 'app/shared/components/mint'
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
      <Typography.Title level={4}>{value}</Typography.Title>
      {sub && (
        <Typography.Text className="caption" type="secondary">
          {sub}
        </Typography.Text>
      )}
    </Space>
  )
}

const InservePrice = ({ mintAddress }: { mintAddress: string }) => {
  return (
    <Space>
      <MintAvatar mintAddress={mintAddress} />
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
        <Col span={24}>
          <Row gutter={[20, 20]}>
            <Col span={24}>
              <Content label="APY" title={<Title value="15%" />} />
            </Col>
            <Col span={12}>
              <Content
                label="My LPT"
                title={<Title value={8.192} sub="LPT" />}
              />
            </Col>
            <Col span={12}>
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
            <Col span={12}>
              <Content
                label="My Portion"
                title={<Title value="0.13%" />}
                subTitle="Over 6.26k LPT"
              />
            </Col>
            <Col span={12}>
              <Content
                label="In - Pool Price"
                title={
                  <InservePrice
                    mintAddress={'h73Yd9mAzNsvfGDSYk1kPVmkKhSWcuscte44Knn4iJQ'}
                  />
                }
              />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <LiquidityAction />
        </Col>
      </Row>
    </Card>
  )
}

export default LiquidityPosition
