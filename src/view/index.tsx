import { Route, Switch } from 'react-router-dom'

import { Alert, Col, Row, Typography } from 'antd'
import ListPools from './listPools'
import PoolDetails from './poolDetails'
import LptWatcher from 'components/watcher/lptWatcher'
import RetailerWatcher from 'components/watcher/retailerWatcher'
import OrderWatcher from 'components/watcher/orderWatcher'
import PoolWatcher from 'components/watcher/pool.watcher'
import { useAppRoute } from '@sentre/senhub/dist'

const Container = () => {
  const { to } = useAppRoute()
  return (
    <Row gutter={[24, 24]} style={{ paddingBottom: 12 }} justify="center">
      <Col xs={24} lg={18}>
        <Alert
          type="info"
          message={
            <Typography.Title level={5}>
              Balansol is launched ✅ Explorer Now ✨
            </Typography.Title>
          }
          description={
            <Typography.Text type="secondary">
              Liquidity Providing and Swapping are now live on{' '}
              <strong>Balansol</strong> with index funds and custom pool
              weights.{' '}
              <strong>
                Get your LPs for juicy APR farming - Click here to use Balansol
                now!
              </strong>
            </Typography.Text>
          }
          onClick={() =>
            to('/app/balansol?autoInstall=true', {
              absolutePath: true,
              newWindow: true,
            })
          }
          style={{ cursor: 'pointer' }}
          showIcon
        />
      </Col>
      <Col xs={24}>
        <Switch>
          <Route exact path="/app/sen_lp" component={ListPools} />
          <Route path="/app/sen_lp/details" component={PoolDetails} />
        </Switch>
      </Col>
      <LptWatcher />
      <RetailerWatcher />
      <OrderWatcher />
      <PoolWatcher />
    </Row>
  )
}

export default Container
