import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'

import { Row, Col, Space, Typography, Switch, Table } from 'antd'
import NewRetailer from './newRetailer'
import RetailerState from './retailerState'
import { ADMIN_COLUMNS } from './column'

import { AppDispatch, AppState } from 'app/model'
import { usePool, useWallet } from 'senhub/providers'
import { getOrders } from 'app/model/orders.controller'

import './index.less'

const Admin = ({ poolAddress }: { poolAddress: string }) => {
  const [lite, setLite] = useState(true)
  const dispatch = useDispatch<AppDispatch>()
  const { retailers, orders } = useSelector((state: AppState) => state)
  const { pools } = usePool()
  const {
    wallet: { address: walletAddress },
  } = useWallet()

  const poolData = pools[poolAddress]
  const myRetailerAddresses = Object.keys(retailers).filter(
    (retailerAddress) => {
      const { owner } = retailers[retailerAddress]
      return owner === walletAddress
    },
  )
  const retailerAddress = myRetailerAddresses.find((retailerAddress) => {
    const { mint_bid } = retailers[retailerAddress]
    return mint_bid === poolData?.mint_lpt
  })

  const listOrder = useMemo(
    () =>
      Object.keys(orders).map((address) => {
        return { ...orders[address], address }
      }),
    [orders],
  )
  // const orderAddresses = Object.keys(orders).filter((orderAddress) => {
  //   const { retailer, state } = orders[orderAddress]
  //   let cond = retailer === retailerAddress
  //   if (lite) cond = cond && state === OrderState.Open
  //   return cond
  // })

  const fetchOrders = useCallback(async () => {
    await dispatch(getOrders({ retailer: walletAddress }))
  }, [dispatch, walletAddress])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        {!account.isAddress(retailerAddress) ? (
          <NewRetailer poolAddress={poolAddress} />
        ) : (
          <Row gutter={[24, 24]} wrap={false}>
            <Col flex="auto">
              <RetailerState retailerAddress={retailerAddress} />
            </Col>
            <Col>
              <Space>
                <Typography.Text type="secondary">Filtered?</Typography.Text>
                <Switch checked={lite} onChange={setLite} size="small" />
              </Space>
            </Col>
          </Row>
        )}
      </Col>
      <Col span={24}>
        <Table
          className="scrollbar"
          columns={ADMIN_COLUMNS}
          dataSource={listOrder}
          rowClassName={(record, index) => (index % 2 ? 'odd-row' : 'even-row')}
          pagination={false}
          scroll={{ y: 182, x: 420 }}
          rowKey={(record) => Number(record.created_at)}
        />
      </Col>
    </Row>
  )
}

export default Admin
