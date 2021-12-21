import { Button, Col, Row, Space, Typography } from 'antd'
import { useHistory } from 'react-router-dom'
import IonIcon from 'shared/antd/ionicon'

const SwapAction = ({
  mintAddress,
  poolAddress,
}: {
  mintAddress: string
  poolAddress: string
}) => {
  const history = useHistory()
  const onSwap = () => {
    history.push({
      pathname: '/app/senhub',
      state: { mintAddress, poolAddress },
    })
  }
  return (
    <Row gutter={[24, 24]} style={{ width: 260 }}>
      <Col span={24}>
        <Space>
          <IonIcon name="alert-circle-outline" />
          <Typography.Title level={5}>Choose the route?</Typography.Title>
        </Space>
      </Col>
      <Col span={24}>
        <Space>
          <Button onClick={onSwap} type="primary">
            Original Route
          </Button>
          <Button onClick={onSwap} type="primary">
            Best Route
          </Button>
        </Space>
      </Col>
    </Row>
  )
}
export default SwapAction
