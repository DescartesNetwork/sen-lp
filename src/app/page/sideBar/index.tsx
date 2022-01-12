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
import Search from './components/search'
import { account } from '@senswap/sen-js'
import { useSelector } from 'react-redux'
import { AppState } from 'app/model'

const SideBar = () => {
  const [selectedTab, setSelectedTab] = useState<PoolTabs>(PoolTabs.Sentre)
  const { selectedPoolAddress, prevSelectedPool } = useSelector(
    (state: AppState) => state.main,
  )
  const query = new URLSearchParams(useLocation().search)
  const poolCategory = query.get(QueryParams.category) || ''

  const handleChange = (value: PoolTabs) => {
    setSelectedTab(value)
  }

  const poolsSelected = useMemo(() => {
    if (selectedTab === PoolTabs.Sentre) return <SentrePools />
    if (selectedTab === PoolTabs.Community) return <CommunityPools />
    if (selectedTab === PoolTabs.Deposited) return <DepositedPools />
    return <YourPools />
  }, [selectedTab])

  const isInViewport = (element: HTMLElement | null) => {
    if (!element) return
    const rect = element.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }

  useEffect(() => {
    if (!prevSelectedPool || !account.isAddress(selectedPoolAddress)) return
    const element = document.getElementById(selectedPoolAddress)
    if (isInViewport(element) || !element) return // reject when pool card inviewport
    const container = document.getElementById('scroll-container')
    if (container && element?.offsetTop) container.scrollTop = element.offsetTop
  }, [prevSelectedPool, selectedPoolAddress])

  useEffect(() => {
    if (!poolCategory) return
    return setSelectedTab(poolCategory as PoolTabs)
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
              value={selectedTab}
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
      <Col span={24}>
        <Search />
      </Col>
      <Col span={24} className="body-sidebar scrollbar" id="scroll-container">
        {poolsSelected}
      </Col>
    </Row>
  )
}

export default SideBar
