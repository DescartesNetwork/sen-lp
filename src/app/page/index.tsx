import { useDispatch, useSelector } from 'react-redux'

import { Row, Col, Modal, Typography, Card } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import SideBar from './sideBar'
import PoolDetails from './poolDetails'
import ViewPoolButton from 'app/components/viewPoolButton'
import LptWatcher from 'app/components/lptWatcher'

import { useUI } from 'senhub/providers'
import { AppState } from 'app/model'
import { handleOpenDrawer } from 'app/model/main.controller'

const Page = () => {
  const dispatch = useDispatch()
  const {
    main: { visible },
  } = useSelector((state: AppState) => state)
  const {
    ui: { width },
  } = useUI()

  return (
    <Row gutter={[24, 24]} style={{ paddingBottom: 12 }}>
      {width >= 1200 ? (
        <Col lg={8} xl={6}>
          <Card bodyStyle={{ padding: 0 }} bordered={false}>
            <SideBar />
          </Card>
        </Col>
      ) : (
        <Modal
          visible={visible}
          onCancel={() => dispatch(handleOpenDrawer(false))}
          closeIcon={<IonIcon name="close-outline" />}
          footer={null}
          title={<Typography.Title level={4}>Pool Selection</Typography.Title>}
          bodyStyle={{ padding: 0 }}
          centered
          forceRender
        >
          <SideBar />
        </Modal>
      )}
      <Col xs={24} lg={24} xl={18}>
        <PoolDetails />
      </Col>
      <ViewPoolButton />
      <LptWatcher />
    </Row>
  )
}

export default Page
