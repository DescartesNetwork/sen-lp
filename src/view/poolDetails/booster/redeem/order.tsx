import { useState } from 'react'
import { useSelector } from 'react-redux'
import { utils } from '@senswap/sen-js'
import moment from 'moment'
import { util } from '@sentre/senhub'

import { Card, Row, Col, Space, Typography, Button, Collapse } from 'antd'
import { MintSymbol } from 'shared/antd/mint'
import IonIcon from '@sentre/antd-ionicon'
import Action from './action'
import Caption from 'components/caption'
import OrderStatus from 'components/orderStatus'

import { AppState } from 'model'
import useMintDecimals from 'shared/hooks/useMintDecimals'

const Order = ({ orderAddress }: { orderAddress: string }) => {
  const [visible, setVisible] = useState(false)
  const { orders, retailers } = useSelector((state: AppState) => state)

  const {
    retailer,
    bid_amount,
    ask_amount,
    locked_time,
    state,
    created_at,
    updated_at,
  } = orders[orderAddress] || {}
  const { mint_bid, mint_ask } = retailers[retailer] || {}
  const bidDecimals = useMintDecimals(mint_bid) || 0
  const askDecimals = useMintDecimals(mint_ask) || 0
  const bidAmount = utils.undecimalize(bid_amount, bidDecimals)
  const askAmount = utils.undecimalize(ask_amount, askDecimals)

  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <Card
          bordered={false}
          bodyStyle={{ padding: 12 }}
          className="order-card order-card-bg"
        >
          <Row gutter={[12, 12]}>
            <Col span={24}>
              <Row gutter={[12, 12]}>
                <Col flex="auto">
                  <Space style={{ fontSize: 12 }}>
                    <Typography.Text type="secondary">Order ID</Typography.Text>
                    <Typography.Text>
                      {util.shortenAddress(orderAddress)}
                    </Typography.Text>
                  </Space>
                </Col>
                <Col>
                  <Button
                    type="text"
                    size="small"
                    icon={
                      <IonIcon
                        name={
                          visible
                            ? 'chevron-down-outline'
                            : 'chevron-forward-outline'
                        }
                      />
                    }
                    onClick={() => setVisible(!visible)}
                  />
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={[8, 8]} justify="space-between">
                <Col>
                  <Space direction="vertical">
                    <Caption title="Payment" />
                    <Typography.Text ellipsis>
                      {util.numeric(bidAmount).format('0,0.[0000]')} LP
                    </Typography.Text>
                  </Space>
                </Col>
                <Col>
                  <Space direction="vertical">
                    <Caption title="Receiving" />
                    <Typography.Text style={{ fontWeight: 700 }} ellipsis>
                      {util.numeric(askAmount).format('0,0.[0000]')}{' '}
                      <MintSymbol mintAddress={mint_ask} />
                    </Typography.Text>
                  </Space>
                </Col>
                <Col>
                  <Space direction="vertical">
                    <Caption title="Locktime" />
                    <Typography.Text>
                      {Number(locked_time) / (24 * 60 * 60)} days
                    </Typography.Text>
                  </Space>
                </Col>
                <Col>
                  <Space direction="vertical">
                    <Caption title="Status" />
                    <OrderStatus state={state} />
                  </Space>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span={24}>
        <Collapse
          activeKey={visible.toString()}
          className="expand-card expand-card-bg"
        >
          <Collapse.Panel header={null} key={'true'} showArrow={false}>
            <Row gutter={[8, 8]} justify="space-between" align="middle">
              <Col>
                <Space direction="vertical">
                  <Caption title="Created At" />
                  <Typography.Text ellipsis>
                    {moment(Number(created_at) * 1000).format(
                      'HH:mm DD/MM/YYYY',
                    )}
                  </Typography.Text>
                </Space>
              </Col>
              <Col>
                <Space direction="vertical">
                  <Caption title="Updated At" />
                  <Typography.Text ellipsis>
                    {moment(Number(updated_at) * 1000).format(
                      'HH:mm DD/MM/YYYY',
                    )}
                  </Typography.Text>
                </Space>
              </Col>
              <Col>
                <Action orderAddress={orderAddress} />
              </Col>
            </Row>
          </Collapse.Panel>
        </Collapse>
      </Col>
    </Row>
  )
}

export default Order
