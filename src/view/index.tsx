import { Route, Switch } from 'react-router-dom'

import { Col, Row } from 'antd'
import ListPools from './listPools'
import PoolDetails from './poolDetails'
import LptWatcher from 'components/watcher/lptWatcher'
import RetailerWatcher from 'components/watcher/retailerWatcher'
import OrderWatcher from 'components/watcher/orderWatcher'

const Container = () => {
  return (
    <Row gutter={[24, 24]} style={{ paddingBottom: 12 }}>
      <Col xs={24}>
        <Switch>
          <Route exact path="/app/sen_lp" component={ListPools} />
          <Route path="/app/sen_lp/details" component={PoolDetails} />
        </Switch>
      </Col>
      <LptWatcher />
      <RetailerWatcher />
      <OrderWatcher />
    </Row>
  )
}

export default Container
