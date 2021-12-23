import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import { Col, Row } from 'antd'
import Header from './header'
import LptWatcher from 'app/components/lptWatcher'
import LptsPools from './components/lptsPools'
import HotPools from './components/hotPools'
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
      <Col className="body-widget">
        {selectedCategoryPool === 'hot' ? (
          <HotPools onClick={setActiveAddress} />
        ) : (
          <LptsPools onClick={setActiveAddress} />
        )}
      </Col>
      <LptWatcher />
    </Row>
  )
}

export default Widget
