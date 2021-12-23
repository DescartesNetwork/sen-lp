import { useDispatch, useSelector } from 'react-redux'

import { Row, Col, Modal, Typography, Card } from 'antd'
import SideBar from './sideBar'
import PoolDetails from './poolDetails'
import ViewPoolButton from 'app/components/viewPoolButton'
import LptWatcher from 'app/components/lptWatcher'

import { useUI } from 'senhub/providers'
import { AppState } from 'app/model'
import { handleOpenDrawer } from 'app/model/main.controller'

const Page = () => {
  const {
    ui: { width },
  } = useUI()
  const hideSidebar = width < 1200

  const dispatch = useDispatch()
  const visible = useSelector((state: AppState) => state.main?.visible)

  return (
    <Row gutter={[24, 24]} style={{ paddingBottom: 12 }}>
      {!hideSidebar ? (
        <Col lg={8} xl={6}>
          <Card
            className="side-bar"
            bodyStyle={{ padding: 0 }}
            bordered={false}
          >
            <SideBar />
          </Card>
        </Col>
      ) : (
        <Modal
          visible={visible}
          onCancel={() => dispatch(handleOpenDrawer(false))}
          footer={null}
          centered={true}
          forceRender={true}
          title={<Typography.Title level={4}>Pool Selection</Typography.Title>}
          bodyStyle={{ maxHeight: 400, overflow: 'auto', padding: 0 }}
        >
          <SideBar />
        </Modal>
      )}
      <Col xs={24} lg={24} xl={18}>
        <PoolDetails />
      </Col>
      <ViewPoolButton width={width} />
      <LptWatcher />
    </Row>
  )
}

export default Page
