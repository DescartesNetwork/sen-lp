import { useCallback, useMemo, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { Col, Row } from 'antd'
import Header from './header'
import LptWatcher from 'app/components/watcher/lptWatcher'
import RetailerWatcher from 'app/components/watcher/retailerWatcher'
import OrderWatcher from 'app/components/watcher/orderWatcher'
import LptsPools from './components/lptsPools'
import ListPools from './components/pools'

import configs from 'app/configs'
import { AppDispatch } from 'app/model'
import { handleOpenDrawer } from 'app/model/main.controller'
import { PoolTabs, QueryParams } from 'app/constant'

const Widget = () => {
  const [selectedTab, setSelectedTab] = useState(PoolTabs.Sentre)
  const dispatch = useDispatch<AppDispatch>()
  const history = useHistory()
  const {
    manifest: { appId },
  } = configs
  const location = useLocation()

  const query = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  )

  const setActiveAddress = useCallback(
    (address: string) => {
      query.set(QueryParams.address, address)
      dispatch(handleOpenDrawer(false))
      history.push(`app/${appId}/${QueryParams.details}?${query.toString()}`)
    },
    [query, dispatch, history, appId],
  )

  return (
    <Row className="widget">
      <Col span={24}>
        <Header
          selectedTab={selectedTab}
          onSelectedTab={(val) => setSelectedTab(val as PoolTabs)}
        />
      </Col>
      <Col span={24} className="body-widget">
        {selectedTab === PoolTabs.Sentre ||
        selectedTab === PoolTabs.Community ? (
          <ListPools selectedTab={selectedTab} onClick={setActiveAddress} />
        ) : (
          <LptsPools selectedTab={selectedTab} onClick={setActiveAddress} />
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
