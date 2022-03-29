import { Col, Select, Row, Typography } from 'antd'

import { PoolTabs } from 'app/constant'

const Header = ({
  selectedTab,
  onSelectedTab,
}: {
  selectedTab?: string
  onSelectedTab: (selected: string) => void
}) => {
  return (
    <Row gutter={24} align="middle" className="header-widget">
      <Col flex="auto">
        <Typography.Text style={{ color: '#e9e9eb ' }}>
          Pools list by
        </Typography.Text>
      </Col>
      <Col>
        <Select
          value={selectedTab}
          onChange={onSelectedTab}
          className="header-select"
        >
          <Select.Option value={PoolTabs.Sentre}>Sentre</Select.Option>
          <Select.Option value={PoolTabs.Community}>Community</Select.Option>
          <Select.Option value={PoolTabs.Deposited}>Deposited</Select.Option>
          <Select.Option value={PoolTabs.YourPools}>Your pools</Select.Option>
        </Select>
      </Col>
    </Row>
  )
}

export default Header
