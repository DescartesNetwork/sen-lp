import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'
import { useWalletAddress } from '@sentre/senhub'

import { Row, Col, Space, Typography, Switch, Table, Button } from 'antd'
import NewRetailer from './newRetailer'
import RetailerState from './retailerState'
import { ADMIN_COLUMNS } from './column'

import { AppDispatch, AppState } from 'model'
import { getOrders } from 'model/orders.controller'
import { OrderState } from 'constant'
import { usePool } from 'hooks/pools/usePool'
import './index.less'

const AMOUNT_ROW = 6

const Admin = ({ poolAddress }: { poolAddress: string }) => {
  const [lite, setLite] = useState(true)
  const [amountRow, setAmountRow] = useState(AMOUNT_ROW)
  const dispatch = useDispatch<AppDispatch>()
  const { retailers, orders } = useSelector((state: AppState) => state)
  const { pools } = usePool()
  const walletAddress = useWalletAddress()

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

  const listOrder = useMemo(() => {
    const orderAddresses = Object.keys(orders).filter((orderAddress) => {
      const { retailer, state } = orders[orderAddress]
      let cond = retailer === retailerAddress
      if (lite) cond = cond && state === OrderState.Open
      return cond
    })
    return orderAddresses.map((address) => ({ ...orders[address], address }))
  }, [orders, retailerAddress, lite])

  const fetchOrders = useCallback(async () => {
    await dispatch(getOrders({ retailer: retailerAddress }))
  }, [dispatch, retailerAddress])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  return (
    <Row gutter={[24, 12]} justify="center">
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
          dataSource={listOrder.slice(0, amountRow)}
          rowClassName={(record, index) => (index % 2 ? 'odd-row' : 'even-row')}
          pagination={false}
          scroll={{ y: 155 }}
          rowKey={(record) => Number(record.created_at)}
        />
      </Col>
      <Col>
        <Button
          onClick={() => setAmountRow(amountRow + AMOUNT_ROW)}
          disabled={amountRow >= listOrder.length}
          type="text"
        >
          View more
        </Button>
      </Col>
    </Row>
  )
}

export default Admin
