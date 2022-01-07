import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { Col, Row, Select } from 'antd'
import CommunityPools from './communityPools'
import YourPools from './yourPools'
import NewPool from './newPool'
import SentrePools from './sentrePools'
import DepositedPools from './depositedPools'

import SettingsButton from 'app/components/settingsButton'
import { PoolTabs, QueryParams } from 'app/constant'

const SideBar = () => {
  const [selectedTab, setSelectedTab] = useState<string>(PoolTabs.Sentre)
  const query = new URLSearchParams(useLocation().search)
  const poolCategory = query.get(QueryParams.category) || ''

  const handleChange = (value: PoolTabs) => {
    setSelectedTab(value)
  }

  const PoolsSelected = useMemo(() => {
    if (selectedTab === PoolTabs.Sentre) return <SentrePools />
    if (selectedTab === PoolTabs.Community) return <CommunityPools />
    if (selectedTab === PoolTabs.Deposited) return <DepositedPools />
    return <YourPools />
  }, [selectedTab])

  useEffect(() => {
    if (!poolCategory) return
    return setSelectedTab(poolCategory)
  }, [poolCategory])

  return (
    <Row gutter={[12, 24]} className="side-bar">
      <Col span={24}>
        <Row gutter={[8, 8]} wrap={false}>
          <Col>
            <SettingsButton />
          </Col>
          <Col flex="auto">
            <Select
              defaultValue={PoolTabs.Sentre}
              onChange={handleChange}
              className="header-sidebar"
            >
              <Select.Option value={PoolTabs.Sentre}>
                Sentre pools
              </Select.Option>
              <Select.Option value={PoolTabs.Deposited}>
                Deposited pools
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
      <Col span={24} className="body-sidebar scrollbar">
        {PoolsSelected}
      </Col>
    </Row>
  )
}

export default SideBar
