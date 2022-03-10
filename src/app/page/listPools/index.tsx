import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { account } from '@senswap/sen-js'

import { Col, Row, Tabs, Radio } from 'antd'
import CommunityPools from 'app/page/listPools/communityPools'
import SentrePools from 'app/page/listPools/sentrePools'
import YourPools from 'app/page/listPools/yourPools'

import { PoolTabs, QueryParams, LiquidityPoolTabs } from 'app/constant'
import { AppDispatch } from 'app/model'
import { selectPool } from 'app/model/main.controller'
import { useDepositedPools } from 'app/hooks/pools/useDepositedPools'
import { useListPoolAddress } from 'app/hooks/pools/useListPoolAddress'
import PoolCardWrapper from './components/poolCardWrapper'
import DepositedPools from './depositedPools'
import './index.less'
import { enumKeys } from 'app/helper'

const ListPools = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [selectedTab, setSelectedTab] = useState<PoolTabs>(PoolTabs.Sentre)
  const { depositedPools } = useDepositedPools()
  const { listPoolAddress: depositedFilterPools } =
    useListPoolAddress(depositedPools)
  const [liquidityTab, setLiquidityTab] = useState(
    LiquidityPoolTabs.YourLiquidity,
  )
  const location = useLocation()
  const query = useMemo(() => {
    return new URLSearchParams(location.search)
  }, [location.search])
  const poolAddress = useMemo(
    () => query.get(QueryParams.address) || '',
    [query],
  )

  const tabHero = useMemo(() => query.get(QueryParams.wrapTab) || '', [query])
  const tabInPool = useMemo(
    () => query.get(QueryParams.tabInPools) || '',
    [query],
  )

  const checkPoolAddrOnURL = useCallback(async () => {
    if (account.isAddress(poolAddress))
      return await dispatch(selectPool(poolAddress))
  }, [dispatch, poolAddress])

  const handleChange = (value: PoolTabs) => {
    setSelectedTab(value)
  }

  const poolsSelected = useMemo(() => {
    if (!!tabInPool) {
      for (const value of enumKeys(PoolTabs)) {
        if (PoolTabs[value] === tabInPool) {
          return <YourPools />
        }
      }
    }
    if (selectedTab === PoolTabs.Sentre) return <SentrePools />
    if (selectedTab === PoolTabs.Community) return <CommunityPools />
    return <YourPools />
  }, [selectedTab, tabInPool])

  useEffect(() => {
    checkPoolAddrOnURL()
  }, [checkPoolAddrOnURL])

  useEffect(() => {
    if (!!tabHero) {
      for (const value of enumKeys(LiquidityPoolTabs)) {
        if (LiquidityPoolTabs[value] === tabHero) {
          return setLiquidityTab(LiquidityPoolTabs[value])
        }
      }
    }

    if (depositedFilterPools.length) {
      setLiquidityTab(LiquidityPoolTabs.YourLiquidity)
    }
    if (!depositedFilterPools.length) {
      setLiquidityTab(LiquidityPoolTabs.Pools)
    }
  }, [depositedFilterPools.length, tabHero])

  useEffect(() => {
    if (!!tabInPool) {
      for (const value of enumKeys(PoolTabs)) {
        if (PoolTabs[value] === tabInPool) {
          return setSelectedTab(PoolTabs[value])
        }
      }
    }
  }, [tabInPool])

  return (
    <Row gutter={[24, 24]} justify="center" className="list-pool">
      <Col xs={24} md={12} lg={8}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Radio.Group
              onChange={(val) => setLiquidityTab(val.target.value)}
              className="pool-option"
              disabled={!depositedFilterPools.length}
              value={liquidityTab}
            >
              <Radio.Button value={LiquidityPoolTabs.YourLiquidity}>
                Your liquidity
              </Radio.Button>
              <Radio.Button value={LiquidityPoolTabs.Pools}>Pools</Radio.Button>
            </Radio.Group>
          </Col>
          <Col span={24}>
            <Tabs activeKey={liquidityTab} centered>
              <Tabs.TabPane key={LiquidityPoolTabs.YourLiquidity}>
                <PoolCardWrapper
                  selectedTab={selectedTab}
                  handleChange={handleChange}
                  poolsSelected={<DepositedPools />}
                  hideHeaderOption={true}
                />
              </Tabs.TabPane>
              <Tabs.TabPane key={LiquidityPoolTabs.Pools}>
                <PoolCardWrapper
                  selectedTab={selectedTab}
                  handleChange={handleChange}
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
