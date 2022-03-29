import { Row, Col, Card, Select } from 'antd'

import { PoolCategory } from 'app/constant'
import SettingsButton from 'app/components/settingsButton'
import NewPool from '../newPool'
import Search from './search'

type PoolCardWrapperProps = {
  selectedTab: PoolCategory
  handleChange: (value: PoolCategory) => void
  poolsSelected: JSX.Element
  hideHeaderOption?: boolean
}

const PoolCardWrapper = ({
  selectedTab,
  handleChange,
  poolsSelected,
  hideHeaderOption = false,
}: PoolCardWrapperProps) => {
  return (
    <Card bordered={false} bodyStyle={{ padding: 0 }}>
      <Row gutter={[12, 24]} className="side-bar">
        <Col span={24} style={{ display: hideHeaderOption ? 'none' : 'block' }}>
          <Row gutter={[8, 8]} wrap={false}>
            <Col>
              <SettingsButton />
            </Col>
            <Col flex="auto">
              <Select
                value={selectedTab}
                onChange={handleChange}
                className="header-sidebar"
              >
                <Select.Option value={PoolCategory.Sentre}>
                  Sentre pools
                </Select.Option>
                <Select.Option value={PoolCategory.YourPools}>
                  Your pools
                </Select.Option>
                <Select.Option value={PoolCategory.Community}>
                  Community pools
                </Select.Option>
              </Select>
            </Col>
            <Col>
              <NewPool />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Search />
        </Col>
        <Col span={24} className="body-sidebar scrollbar" id="scroll-container">
          {poolsSelected}
        </Col>
      </Row>
    </Card>
  )
}

export default PoolCardWrapper
