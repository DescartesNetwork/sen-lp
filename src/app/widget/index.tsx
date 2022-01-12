import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { Col, Row } from 'antd'
import Header from './header'
import LptWatcher from 'app/components/watcher/lptWatcher'
import RetailerWatcher from 'app/components/watcher/retailerWatcher'
import OrderWatcher from 'app/components/watcher/orderWatcher'
import LptsPools from './components/lptsPools'
import ListPools from './components/pools'

import configs from 'app/configs'
import { AppDispatch, AppState } from 'app/model'
import { handleOpenDrawer, selectPool } from 'app/model/main.controller'
import { PoolTabs } from 'app/constant'

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
    <Row className="widget">
      <Col span={24}>
        <Header />
      </Col>
      <Col span={24} className="body-widget">
        {selectedCategoryPool === PoolTabs.Sentre ||
        selectedCategoryPool === PoolTabs.Community ? (
          <ListPools onClick={setActiveAddress} />
        ) : (
          <LptsPools onClick={setActiveAddress} />
        )}
      </Col>
      <Col span={24} style={{ height: 16 }} />
      <LptWatcher />
      <RetailerWatcher />
      <OrderWatcher />
    </Row>
  )
}

export default Widget
