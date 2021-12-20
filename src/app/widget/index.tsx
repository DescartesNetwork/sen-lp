import { Col, Row } from 'antd'
import Header from './header'
import LptWatcher from 'app/components/lptWatcher'
import { useSelector } from 'react-redux'
import { AppState } from 'app/model'
import LptsPools from './components/lptsPools'
import HotPools from './components/hotPools'
const Widget = () => {
  const selectedCategoryPool = useSelector(
    (state: AppState) => state.main.selectedCategoryPool,
  )

  return (
    <Row>
      <Col span={24}>
        <Header />
      </Col>
      <Col>{selectedCategoryPool === 'hot' ? <HotPools /> : <LptsPools />}</Col>
      <LptWatcher />
    </Row>
  )
}

export default Widget
