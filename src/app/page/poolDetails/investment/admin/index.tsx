import { Row, Col } from 'antd'
import IonIcon from 'shared/antd/ionicon'

const Admin = ({ poolAddress }: { poolAddress: string }) => {
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>Admin</Col>
    </Row>
  )
}

export default Admin
