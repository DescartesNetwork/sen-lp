import { useHistory } from 'react-router-dom'

import { Button, Col, Row, Space, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import configs from 'app/configs'

const {
  route: { swapRoute },
} = configs

const SwapAction = ({
  poolAddress,
  isDisabled,
}: {
  poolAddress: string
  isDisabled: boolean
}) => {
  const history = useHistory()
  const onSwap = (originalRoute: boolean) => {
    return history.push({
      pathname: swapRoute,
      state: { poolAddress, originalRoute },
    })
  }
  return (
    <Row gutter={[24, 12]} style={{ width: 260 }}>
      <Col span={24}>
        <Space direction="vertical" size={0}>
          <Space>
            <IonIcon style={{ color: '#FA8C16' }} name="alert-circle-outline" />
            <Typography.Title level={5}>Choose the route?</Typography.Title>
          </Space>
          <Typography.Text type="secondary">
            We recommend choosing the best route to optimize the price.
          </Typography.Text>
        </Space>
      </Col>
      <Col style={{ textAlign: 'right' }} span={24}>
        <Space>
          <Button
            size="small"
            disabled={isDisabled}
            onClick={() => onSwap(true)}
          >
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
export default SwapAction