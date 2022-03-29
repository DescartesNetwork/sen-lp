import { useCallback, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import { Col, Row, Tabs, Radio } from 'antd'
import CommunityPools from 'app/view/listPools/communityPools'
import SentrePools from 'app/view/listPools/sentrePools'
import YourPools from 'app/view/listPools/yourPools'
import PoolCardWrapper from './components/poolCardWrapper'
import DepositedPools from './depositedPools'

import { PoolCategory, QueryParams, PageTabs } from 'app/constant'
import { useDepositedPools } from 'app/hooks/pools/useDepositedPools'
import { useListPoolAddress } from 'app/hooks/pools/useListPoolAddress'

import './index.less'
import configs from 'app/configs'

const {
  route: { myRoute },
} = configs

const ListPools = () => {
  const history = useHistory()
  const location = useLocation()
  const { depositedPools } = useDepositedPools()
  const { listPoolAddress } = useListPoolAddress(depositedPools)

  const query = useMemo(() => {
    return new URLSearchParams(location.search)
  }, [location.search])

  const poolCategory =
    query.get(QueryParams.poolCategory) || PoolCategory.Sentre
  const pageTabSelected = query.get(QueryParams.wrapTab) || PageTabs.Pools

  const onChangeWrapTab = useCallback(
    (tab: PageTabs) => {
      query.set(QueryParams.wrapTab, tab)
      history.push(`${myRoute}?${query.toString()}`)
    },
    [history, query],
  )

  const onChangePoolCategory = useCallback(
    (poolCategory: PoolCategory) => {
      query.set(QueryParams.poolCategory, poolCategory)
      history.push(`${myRoute}?${query.toString()}`)
    },
    [history, query],
  )

  const poolsSelected = useMemo(() => {
    switch (poolCategory) {
      case PoolCategory.Community:
        return <CommunityPools />
      case PoolCategory.YourPools:
        return <YourPools />
      default:
        return <SentrePools />
    }
  }, [poolCategory])

  return (
    <Row gutter={[24, 24]} justify="center" className="list-pool">
      <Col xs={24} md={12} lg={8}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Radio.Group
              onChange={(e) => onChangeWrapTab(e.target.value)}
              className="pool-option"
              disabled={!listPoolAddress.length}
              value={pageTabSelected}
            >
              <Radio.Button value={PageTabs.YourLiquidity}>
                Your liquidity
              </Radio.Button>
              <Radio.Button value={PageTabs.Pools}>Pools</Radio.Button>
            </Radio.Group>
          </Col>
          <Col span={24}>
            <Tabs activeKey={pageTabSelected} centered>
              <Tabs.TabPane key={PageTabs.YourLiquidity}>
                <PoolCardWrapper
                  selectedTab={poolCategory as PoolCategory}
                  handleChange={onChangePoolCategory}
                  poolsSelected={<DepositedPools />}
                  hideHeaderOption={true}
                />
              </Tabs.TabPane>
              <Tabs.TabPane key={PageTabs.Pools}>
                <PoolCardWrapper
                  selectedTab={poolCategory as PoolCategory}
                  handleChange={onChangePoolCategory}
                  poolsSelected={poolsSelected}
                />
              </Tabs.TabPane>
            </Tabs>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default ListPools
