import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { Col, Row } from 'antd'
import Header from './header'
import LptWatcher from 'app/components/lptWatcher'
import RetailerWatcher from 'app/components/retailerWatcher'
import LptsPools from './components/lptsPools'
import HotPools from './components/pools'

import configs from 'app/configs'
import { AppDispatch, AppState } from 'app/model'
import { handleOpenDrawer, selectPool } from 'app/model/main.controller'

const Widget = () => {
  const dispatch = useDispatch<AppDispatch>()
  const selectedCategoryPool = useSelector(
    (state: AppState) => state.main.selectedCategoryPool,
  )
  const history = useHistory()
  const {
    manifest: { appId },
  } = configs

  const setActiveAddress = useCallback(
    (address: string) => {
      dispatch(selectPool(address))
      dispatch(handleOpenDrawer(false))
      history.push(`app/${appId}`)
    },
    [dispatch, history, appId],
  )
  return (
    <Row>
      <Col span={24}>
        <Header />
      </Col>
      <Col span={24} className="body-widget">
        {selectedCategoryPool === 'sentre' ||
        selectedCategoryPool === 'community' ? (
          <HotPools onClick={setActiveAddress} />
        ) : (
          <LptsPools onClick={setActiveAddress} />
        )}
      </Col>
      <Col span={24} style={{ height: 16 }} />
      <LptWatcher />
      <RetailerWatcher />
    </Row>
  )
}

export default Widget
