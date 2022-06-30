import { useHistory } from 'react-router-dom'
import { usePool } from '@sentre/senhub'

import { Button, Col, Row, Space, Typography, Popover } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import configs from 'configs'
import { PoolStatus } from 'constant'

const {
  route: { swapRoute },
} = configs

export const SwapAction = ({ poolAddress }: { poolAddress: string }) => {
  const history = useHistory()
  const { pools } = usePool()
  const frozen = pools?.[poolAddress].state === PoolStatus.Frozen

  const onSwap = (originalRoute: boolean) => {
    return history.push({
      pathname: swapRoute,
      state: { poolAddress, originalRoute },
    })
  }

  return (
    <Row gutter={[24, 12]} style={{ width: 256 }}>
      <Col span={24}>
        <Space direction="vertical" size={0}>
          <Space>
            <IonIcon style={{ color: '#FA8C16' }} name="alert-circle-outline" />
            <Typography.Title level={5}>Choose the route</Typography.Title>
          </Space>
          <Typography.Text type="secondary">
            We recommend choosing the best route to optimize the price.
          </Typography.Text>
        </Space>
      </Col>
      <Col style={{ textAlign: 'right' }} span={24}>
        <Space>
          <Button size="small" disabled={frozen} onClick={() => onSwap(true)}>
            Original route
          </Button>
          <Button size="small" onClick={() => onSwap(false)} type="primary">
            Best route
          </Button>
        </Space>
      </Col>
    </Row>
  )
}

const SwapButton = ({ poolAddress }: { poolAddress: string }) => {
  return (
    <Popover
      trigger="click"
      placement="bottomLeft"
      content={<SwapAction poolAddress={poolAddress} />}
    >
      <Button block>Swap</Button>
    </Popover>
  )
}

export default SwapButton
