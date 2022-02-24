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

const ListPools = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [selectedTab, setSelectedTab] = useState<PoolTabs>(PoolTabs.Sentre)
  const { depositedPools } = useDepositedPools()
  const { listPoolAddress } = useListPoolAddress(depositedPools)
  const [liquidityTab, setLiquidityTab] = useState(LiquidityPoolTabs.Liquidity)
  const location = useLocation()
  const query = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  )
  const poolAddress = useMemo(
    () => query.get(QueryParams.address) || '',
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
    if (selectedTab === PoolTabs.Sentre) return <SentrePools />
    if (selectedTab === PoolTabs.Community) return <CommunityPools />
    return <YourPools />
  }, [selectedTab])

  useEffect(() => {
    checkPoolAddrOnURL()
  }, [checkPoolAddrOnURL])

  useEffect(() => {
    if (!listPoolAddress.length) {
      setLiquidityTab(LiquidityPoolTabs.NonLiquidity)
    }
  }, [listPoolAddress])

  return (
    <Row gutter={[24, 24]} justify="center" className="list-pool">
      <Col xs={24} md={12} lg={8}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Radio.Group
              defaultValue={
                !listPoolAddress.length
                  ? LiquidityPoolTabs.NonLiquidity
                  : LiquidityPoolTabs.Liquidity
              }
              onChange={(val) => setLiquidityTab(val.target.value)}
              className="pool-option"
              disabled={!listPoolAddress.length}
            >
              <Radio.Button value={LiquidityPoolTabs.Liquidity}>
                Your liquidity
              </Radio.Button>
              <Radio.Button value={LiquidityPoolTabs.NonLiquidity}>
                Pools
              </Radio.Button>
            </Radio.Group>
          </Col>
          <Col span={24}>
            <Tabs activeKey={liquidityTab} centered>
              <Tabs.TabPane key={LiquidityPoolTabs.Liquidity}>
                <PoolCardWrapper
                  selectedTab={selectedTab}
                  handleChange={handleChange}
                  poolsSelected={<DepositedPools />}
                  hideHeaderOption={true}
                />
              </Tabs.TabPane>
              <Tabs.TabPane key={LiquidityPoolTabs.NonLiquidity}>
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
