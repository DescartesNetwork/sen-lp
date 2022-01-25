import { useState } from 'react'

import { Col, RadioChangeEvent, Row, Table } from 'antd'
import { DATA_DEMO, HISTORY_COLUMN } from './columnHistory'
import FilterHistory from './filterHistory'

const DepositHistory = () => {
  const [filterOption, setFilterOption] = useState(7)

  const onFilter = (e: RadioChangeEvent) => {
    setFilterOption(e.target.value)
  }
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <FilterHistory onChange={onFilter} />
      </Col>
      <Col span={24}>
        <Table
          pagination={false}
          rowClassName={(record, index) => (index % 2 ? 'odd-row' : 'even-row')}
          dataSource={DATA_DEMO}
          columns={HISTORY_COLUMN}
          rowKey={(record) => record.time}
        />
      </Col>
    </Row>
  )
}

export default DepositHistory
