import { useCallback, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'
import { usePool, useUI } from '@senhub/providers'

import { Row, Col, Modal, Typography, Card } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import SideBar from './sideBar'
import PoolDetails from './poolDetails'
import ViewPoolButton from 'app/components/viewPoolButton'
import LptWatcher from 'app/components/watcher/lptWatcher'
import RetailerWatcher from 'app/components/watcher/retailerWatcher'
import OrderWatcher from 'app/components/watcher/orderWatcher'

import { AppState } from 'app/model'
import { handleOpenDrawer, selectPool } from 'app/model/main.controller'
import configs from 'app/configs'
import { QueryParams } from 'app/constant'

const Page = () => {
  const dispatch = useDispatch()
  const {
    main: { visible },
  } = useSelector((state: AppState) => state)
  const {
    ui: { width },
  } = useUI()
  const { pools } = usePool()
  const { selectedPoolAddress } = useSelector((state: AppState) => state.main)
  const query = new URLSearchParams(useLocation().search)
  const poolAddress = query.get(QueryParams.address) || ''
  const senOwner = configs.sol.senOwners

  const listSentrePools = Object.keys(pools).filter((poolAddr) => {
    const poolData = pools?.[poolAddr]
    const { owner } = poolData
    return senOwner.includes(owner)
  })

  const sortedPools = useMemo(() => {
    if (!Object.keys(pools).length) return
    return Object.keys(pools)
      .map((address) => ({ address, ...pools[address] }))
      .sort(
        (
          { reserve_a: firstRa, reserve_b: firstRb },
          { reserve_a: secondRa, reserve_b: secondRb },
        ) => {
          const firstK = firstRa * firstRb
          const secondK = secondRa * secondRb
          if (firstK > secondK) return -1
          if (firstK < secondK) return 1
          return 0
        },
      )
  }, [pools])

  const onInit = useCallback(() => {
    if (account.isAddress(selectedPoolAddress)) return
    if (account.isAddress(poolAddress)) return dispatch(selectPool(poolAddress))
    const poolAddressDefault = sortedPools?.[0]?.address
    const sentrePoolAddrDefault = listSentrePools?.[0]
    if (account.isAddress(sentrePoolAddrDefault))
      return dispatch(selectPool(sentrePoolAddrDefault))
    if (account.isAddress(poolAddressDefault))
      dispatch(selectPool(poolAddressDefault))
  }, [dispatch, listSentrePools, poolAddress, selectedPoolAddress, sortedPools])

  useEffect(() => {
    onInit()
  }, [onInit])

  return (
    <Row gutter={[24, 24]} style={{ paddingBottom: 12 }}>
      {width >= 1200 ? (
        <Col lg={8} xl={6}>
          <Card bodyStyle={{ padding: 0 }} bordered={false}>
            <SideBar />
          </Card>
        </Col>
      ) : (
        <Modal
          visible={visible}
          onCancel={() => dispatch(handleOpenDrawer(false))}
          closeIcon={<IonIcon name="close-outline" />}
          footer={null}
          title={<Typography.Title level={4}>Pool Selection</Typography.Title>}
          bodyStyle={{ padding: 0 }}
          centered
        >
          <SideBar />
        </Modal>
      )}
      <Col xs={24} lg={24} xl={18}>
        <PoolDetails />
      </Col>
      <ViewPoolButton />
      <LptWatcher />
      <RetailerWatcher />
      <OrderWatcher />
    </Row>
  )
}

export default Page
