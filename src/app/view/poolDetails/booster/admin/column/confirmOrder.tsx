import { useState } from 'react'
import { useSelector } from 'react-redux'
import { utils } from '@senswap/sen-js'
import moment from 'moment'

import { Button, Card, Col, Row, Space, Typography } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import { MintAvatar, MintSymbol } from 'shared/antd/mint'

import useMintDecimals from 'shared/hooks/useMintDecimals'
import { shortenAddress } from 'shared/util'
import { notifyError, notifySuccess } from 'app/helper'
import { VESTING } from 'app/constant'
import { AppState } from 'app/model'
import { OrderType } from '.'
import configs from 'app/configs'

const FORMAT_DATE = 'DD/MM/YYYY'

const ConfirmOrder = ({
  orderData,
  onClose,
}: {
  orderData: OrderType
  onClose: (visible: boolean) => void
}) => {
  const [loadingApprove, setLoadingApprove] = useState(false)
  const [loadingReject, setLoadingReject] = useState(false)

  const { retailers } = useSelector((state: AppState) => state)

  const { mint_bid, mint_ask } = retailers[orderData.retailer] || {}
  const bidDecimals = useMintDecimals(mint_bid) || 0
  const askDecimals = useMintDecimals(mint_ask) || 0
  const bidAmount = utils.undecimalize(orderData.bid_amount, bidDecimals)
  const askAmount = utils.undecimalize(orderData.ask_amount, askDecimals)

  const lockTime = Number(orderData.locked_time) / (24 * 60 * 60)

  const discount =
    VESTING.find(({ locktime: l }) => l === lockTime)?.discount || 0

  const onReject = async () => {
    try {
      const { wallet } = window.sentre
      const {
        sol: { purchasing },
      } = configs
      if (!wallet) throw new Error('Wallet is not connected')
      await setLoadingReject(true)
      const { txId } = await purchasing.rejectOrder(orderData.address, wallet)
      return notifySuccess('Reject the order', txId)
    } catch (er: any) {
      return notifyError(er)
    } finally {
      return setLoadingReject(false)
    }
  }

  const onApprove = async () => {
    try {
      const { wallet } = window.sentre
      const {
        sol: { purchasing },
      } = configs
      if (!wallet) throw new Error('Wallet is not connected')
      await setLoadingApprove(true)
      const { txId } = await purchasing.approveOrder(orderData.address, wallet)
      return notifySuccess('Approve the order', txId)
    } catch (er: any) {
      return notifyError(er)
    } finally {
      onClose(false)
      return setLoadingApprove(false)
    }
  }

  return (
    <Row gutter={[16, 24]}>
      <Col span={24}>
        <Row align="middle" justify="space-between">
          <Col>
            <Space direction="vertical">
              <Typography.Text>Pay</Typography.Text>
              <Space>
                <MintAvatar mintAddress={mint_ask} />
                <Typography.Text>
                  <MintSymbol mintAddress={mint_ask} />
                </Typography.Text>
              </Space>
              <Typography.Title level={4}>{askAmount}</Typography.Title>
            </Space>
          </Col>
          <Col>
            <IonIcon name="arrow-forward-outline" style={{ fontSize: 24 }} />
          </Col>
          <Col>
            <Space direction="vertical">
              <Typography.Text>Receive</Typography.Text>
              <Space>
                <MintAvatar mintAddress={mint_bid} />
                <Typography.Text>
                  <MintSymbol separator=" + " mintAddress={mint_bid} />
                </Typography.Text>
              </Space>
              <Typography.Title level={4}>{bidAmount}</Typography.Title>
            </Space>
          </Col>
        </Row>
      </Col>
      <Col>
        <Card
          bordered={false}
          className="confirm-info"
          style={{ boxShadow: 'none', borderRadius: 8 }}
          bodyStyle={{ padding: 16 }}
        >
          <Row gutter={[12, 12]}>
            <Col span={24}>
              <Row>
                <Col flex="auto">
                  <Typography.Text type="secondary">Order ID</Typography.Text>
                </Col>
                <Typography.Text>
                  {shortenAddress(orderData.address)}
                </Typography.Text>
              </Row>
            </Col>
            <Col span={24}>
              <Row>
                <Col flex="auto">
                  <Typography.Text type="secondary">Start day</Typography.Text>
                </Col>
                <Col>
                  {moment(Number(orderData.created_at) * 1000).format(
                    FORMAT_DATE,
                  )}
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row>
                <Col flex="auto">
                  <Typography.Text type="secondary">
                    Locked duration
                  </Typography.Text>
                </Col>
                <Col>
                  <Typography.Text>{lockTime} days</Typography.Text>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row>
                <Col flex="auto">
                  <Typography.Text type="secondary">
                    Purchase rate
                  </Typography.Text>
                </Col>
                <Col>{Math.round((discount + 1) * 100)}%</Col>
              </Row>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span={24} style={{ textAlign: 'right' }}>
        <Space size={4}>
          <Button loading={loadingReject} onClick={onReject}>
            Reject
          </Button>
          <Button loading={loadingApprove} onClick={onApprove} type="primary">
            Approve
          </Button>
        </Space>
      </Col>
    </Row>
  )
}

export default ConfirmOrder
