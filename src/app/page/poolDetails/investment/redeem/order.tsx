import { useState } from 'react'
import { useSelector } from 'react-redux'
import { utils } from '@senswap/sen-js'
import moment from 'moment'

import {
  Card,
  Row,
  Col,
  Space,
  Typography,
  Button,
  Tag,
  TagProps,
  Collapse,
} from 'antd'
import { MintSymbol } from 'app/components/mint'
import IonIcon from 'shared/antd/ionicon'
import Action from './action'

import { AppState } from 'app/model'
import { numeric, shortenAddress } from 'shared/util'
import useMintDecimals from 'app/hooks/useMintDecimals'
import { OrderStatus } from 'app/constant'
import './index.less'

const Caption = ({ title }: { title: string }) => {
  return (
    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
      {title}
    </Typography.Text>
  )
}

const BorderlessTag = (props: TagProps) => {
  return <Tag style={{ border: 'none' }} {...props} />
}
const Status = ({ state }: { state: number }) => {
  if (state === OrderStatus.Open)
    return <BorderlessTag color="gold">Pending</BorderlessTag>
  if (state === OrderStatus.Approved)
    return <BorderlessTag color="cyan">Approved</BorderlessTag>
  if (state === OrderStatus.Done)
    return <BorderlessTag color="green">Done</BorderlessTag>
  if (state === OrderStatus.Rejected)
    return <BorderlessTag color="red">Rejected</BorderlessTag>
  if (state === OrderStatus.Canceled)
    return <BorderlessTag color="volcano">Canceled</BorderlessTag>
  return <BorderlessTag>Unknown</BorderlessTag>
}

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
  const bidDecimals = useMintDecimals(mint_bid)
  const askDecimals = useMintDecimals(mint_ask)
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
                      {shortenAddress(orderAddress)}
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
                      {numeric(bidAmount).format('0,0.[0000]')} LP
                    </Typography.Text>
                  </Space>
                </Col>
                <Col>
                  <Space direction="vertical">
                    <Caption title="Receiving" />
                    <Typography.Text style={{ fontWeight: 700 }} ellipsis>
                      {numeric(askAmount).format('0,0.[0000]')}{' '}
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
                    <Status state={state} />
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
