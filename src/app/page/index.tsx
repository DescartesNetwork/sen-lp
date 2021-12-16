import { Row, Col } from 'antd'
import SideBar from './sideBar'
import PoolDetails from './poolDetails'

import { useUI } from 'senhub/providers'

import 'app/static/styles/index.less'

const Page = () => {
  const {
    ui: { width },
  } = useUI()
  const hideSidebar = width < 1200

  return (
    <Row gutter={[24, 24]}>
      {!hideSidebar && (
        <Col lg={8} xl={6}>
          <SideBar />
        </Col>
      )}
      <Col xs={24} lg={24} xl={18}>
        <PoolDetails />
      </Col>
    </Row>
  )
}

export default Page
