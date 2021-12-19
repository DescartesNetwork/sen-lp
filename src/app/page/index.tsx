import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Row, Col, Modal, Typography } from 'antd'
import SideBar from './sideBar'
import PoolDetails from './poolDetails'
import ViewPoolButton from 'app/components/viewPoolButton'
import LptWatcher from 'app/components/lptWatcher'

import { useUI } from 'senhub/providers'
import { AppState } from 'app/model'
import { handleOpenDrawer } from 'app/model/main.controller'

import 'app/static/styles/index.less'

const Page = () => {
  const {
    ui: { width },
  } = useUI()
  const hideSidebar = width < 1200

  const dispatch = useDispatch()
  const visible = useSelector((state: AppState) => state.main?.visible)

  const onClose = useCallback(() => {
    dispatch(handleOpenDrawer(false))
  }, [dispatch])

  return (
    <Row gutter={[24, 24]}>
      {!hideSidebar ? (
        <Col lg={8} xl={6}>
          <SideBar />
        </Col>
      ) : (
        <Modal
          visible={visible}
          onCancel={onClose}
          footer={null}
          centered={true}
          forceRender={true}
          title={<Typography.Title level={4}>Pool Selection</Typography.Title>}
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <SideBar />
            </Col>
          </Row>
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
