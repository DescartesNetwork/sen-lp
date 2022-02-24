import { Row, Col, Card, Select } from 'antd'

import { PoolTabs } from 'app/constant'
import SettingsButton from 'app/components/settingsButton'
import NewPool from '../newPool'
import Search from './search'

type PoolCardWrapperProps = {
  selectedTab: PoolTabs
  handleChange: (value: PoolTabs) => void
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
                <Select.Option value={PoolTabs.Sentre}>
                  Sentre pools
                </Select.Option>
                <Select.Option value={PoolTabs.YourPools}>
                  Your pools
                </Select.Option>
                <Select.Option value={PoolTabs.Community}>
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
