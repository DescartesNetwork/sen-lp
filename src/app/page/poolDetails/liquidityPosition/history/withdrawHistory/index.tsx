import LazyLoad from '@senswap/react-lazyload'
import { Col, Radio, Row } from 'antd'
import WithdrawCard from './withdrawCard'

const RADIO_STYLE = {
  width: '33%',
}

const WithDrawHistory = () => {
  return (
    <Row gutter={[16, 16]} style={{ height: 529 }} className="scrollbar">
      <Col span={24}>
        <Radio.Group style={{ width: '100%' }} defaultValue="7-day">
          <Radio.Button style={RADIO_STYLE} value="7-day">
            Past 7 days
          </Radio.Button>
          <Radio.Button style={RADIO_STYLE} value="30-day">
            Past 30 days
          </Radio.Button>
          <Radio.Button style={RADIO_STYLE} value="90-day">
            Past 90 days
          </Radio.Button>
        </Radio.Group>
      </Col>
      {[4, 5, 6, 7, 8, 9, 10].map((item) => (
        <Col span={24} key={item}>
          <LazyLoad height={62} overflow>
            <WithdrawCard />
          </LazyLoad>
        </Col>
      ))}
    </Row>
  )
}

export default WithDrawHistory
