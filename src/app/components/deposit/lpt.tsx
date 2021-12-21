import { Row, Col, Card, Typography, Divider, Space, Button } from 'antd'
import { numeric } from 'shared/util'
import { MintName } from 'app/shared/components/mint'
import IonIcon from 'shared/antd/ionicon'

const LPT = ({
  value = '0',
  poolAddress,
}: {
  value?: string
  poolAddress: string
}) => {
  return (
    <Card bordered={false}>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <Typography.Text>Pool Info</Typography.Text>
        </Col>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col flex="auto">
              <Typography.Text type="secondary">Total LPT</Typography.Text>
            </Col>
            <Col>
              <Typography.Title level={5}>
                {numeric(1000).format('0,0.[0000]')}
                <MintName mintAddress={''} />
              </Typography.Title>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col flex="auto">
              <Typography.Text type="secondary">Price</Typography.Text>
            </Col>
            <Col>
              <Space>
                <Button
                  type="text"
                  style={{ width: 'auto', height: 'auto' }}
                  icon={<IonIcon name="swap-horizontal-outline" />}
                />
                <Typography.Title level={5}>
                  {numeric(1).format('0,0.[0000]')}USDT ={' '}
                  {numeric(1).format('0,0.[0000]')}ETH
                </Typography.Title>
              </Space>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col flex="auto">
              <Typography.Text type="secondary">Total yeild</Typography.Text>
            </Col>
            <Col>
              <Typography.Title level={5}>
                {numeric(20).format('0.[00]%')}
              </Typography.Title>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Divider style={{ margin: '16px 0px' }} />
        </Col>
        <Col span={24}>
          <Typography.Text>Your Info</Typography.Text>
        </Col>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col flex="auto">
              <Typography.Text type="secondary">
                Current pool price
              </Typography.Text>
            </Col>
            <Col>
              <Typography.Title level={5} style={{ margin: 0 }}>
                {numeric(value).format('0,0.[0000]')}SEN +{' '}
                {numeric(value).format('0,0.[0000]')}SEN
              </Typography.Title>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col flex="auto">
              <Typography.Text type="secondary">Your LPT</Typography.Text>
            </Col>
            <Col>
              <Typography.Title level={5} style={{ margin: 0 }}>
                {numeric(2000).format('0,0.[0000]')}LPT
              </Typography.Title>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

export default LPT
