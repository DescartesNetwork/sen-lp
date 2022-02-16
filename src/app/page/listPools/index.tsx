import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { account } from '@senswap/sen-js'

import { Card, Col, Row, Select, Typography } from 'antd'
import CommunityPools from 'app/page/listPools/communityPools'
import DepositedPools from 'app/page/listPools/depositedPools'
import NewPool from 'app/page/listPools/newPool'
import SentrePools from 'app/page/listPools/sentrePools'
import YourPools from 'app/page/listPools/yourPools'
import Search from './components/search'
import SettingsButton from 'app/components/settingsButton'

import { PoolTabs, QueryParams } from 'app/constant'
import { AppDispatch, AppState } from 'app/model'
import { selectPool } from 'app/model/main.controller'
import { numeric } from 'shared/util'

const ListPools = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    main: { tvl },
  } = useSelector((state: AppState) => state)
  const [selectedTab, setSelectedTab] = useState<PoolTabs>(PoolTabs.Sentre)
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
    if (selectedTab === PoolTabs.Deposited) return <DepositedPools />
    return <YourPools />
  }, [selectedTab])

  useEffect(() => {
    checkPoolAddrOnURL()
  }, [checkPoolAddrOnURL])

  return (
    <Row gutter={[24, 24]} justify="center">
      <Col xs={24} md={12} lg={8}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Card bordered={false}>
              <Row gutter={[16, 16]} align="middle">
                <Col flex="auto">
                  <Typography.Title level={4}>
                    Total value locked
                  </Typography.Title>
                </Col>
                <Col>
                  <Typography.Title level={2}>
                    ${numeric(tvl).format('0,0.[00]a')}
                  </Typography.Title>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={24}>
            <Card
              bordered={false}
              style={{ height: 578 }}
              bodyStyle={{ padding: 0 }}
            >
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
                <Col
                  span={24}
                  className="body-sidebar scrollbar"
                  id="scroll-container"
                >
                  {poolsSelected}
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default ListPools
