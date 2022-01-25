import LazyLoad from '@senswap/react-lazyload'
import { Col, Row, Select } from 'antd'
import DepositCard from './depositCard'

const DepositHistory = () => {
  return (
    <Row gutter={[16, 16]} style={{ height: 529 }} className="scrollbar">
      <Col span={24}>
        <Select defaultValue={1} style={{ width: '100%' }}>
          {[1, 2, 3].map((item) => (
            <Select.Option key={item} value={item}>
              Select option {item}
            </Select.Option>
          ))}
        </Select>
      </Col>
      {[4, 5, 6, 8, 9, 10, 11, 12, 13].map((item) => (
        <Col span={24} key={item}>
          <LazyLoad height={62} overflow>
            <DepositCard />
          </LazyLoad>
        </Col>
      ))}
    </Row>
  )
}

export default DepositHistory
