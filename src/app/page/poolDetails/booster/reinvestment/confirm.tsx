import { Fragment, ReactNode, useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { utils } from '@senswap/sen-js'

import { Button, Col, Card, Modal, Row, Space, Typography } from 'antd'
import { MintAvatar, MintSymbol } from 'shared/antd/mint'
import IonIcon from 'shared/antd/ionicon'

import { AppState } from 'app/model'
import { numeric } from 'shared/util'
import { notifyError, notifySuccess } from 'app/helper'
import configs from 'app/configs'
import useMintDecimals from 'shared/hooks/useMintDecimals'
import useNextOrderIndex from 'app/hooks/useNextOrderIndex'
import { useMintPrice } from 'app/hooks/useMintPrice'
import { VESTING } from 'app/constant'
import './index.less'

const Content = ({
  label = '',
  avatar = <Fragment />,
  value = '',
  subValue = '',
  floatRight = false,
}: {
  label?: string
  avatar?: ReactNode
  value?: string | number
  subValue?: string | number | undefined
  floatRight?: boolean
}) => {
  const textAlign = floatRight ? 'right' : 'left'
  return (
    <Space size={12} direction="vertical" style={{ textAlign }}>
      <Typography.Text>{label}</Typography.Text>
      {avatar}
      <Typography.Title level={3}>{value}</Typography.Title>
      {subValue && (
        <Typography.Title
          level={5}
          style={{ textDecoration: 'line-through' }}
          type="secondary"
        >
          {subValue}
        </Typography.Title>
      )}
    </Space>
  )
}

const TimeInfo = ({
  label = '',
  value = '',
}: {
  label?: string
  value?: string | number
}) => {
  return (
    <Row gutter={[16, 16]}>
      <Col flex="auto">
        <Typography.Text>{label}</Typography.Text>
      </Col>
      <Col>
        <Typography.Title level={5}>{value}</Typography.Title>
      </Col>
    </Row>
  )
}

const Confirm = ({
  retailerAddress,
  amount,
  locktime,
  visible = false,
  onClose = () => {},
}: {
  retailerAddress: string
  amount: string
  locktime: number
  visible?: boolean
  onClose?: () => void
}) => {
  const [loading, setLoading] = useState(false)
  const {
    retailers: { [retailerAddress]: retailerData },
  } = useSelector((state: AppState) => state)
  const index = useNextOrderIndex(retailerAddress)
  const bidDecimals = useMintDecimals(retailerData.mint_bid) || 0
  const askDecimals = useMintDecimals(retailerData.mint_ask) || 0
  const bidPrice = useMintPrice(retailerData.mint_bid, true)
  const askPrice = useMintPrice(retailerData.mint_ask, true)

  const lockedTime = BigInt(Math.floor(locktime * 24 * 60 * 60))
  const discount =
    VESTING.find(({ locktime: l }) => l === locktime)?.discount || 0
  // Compute amounts
  const valuation = parseFloat(amount) * bidPrice
  const bidAmount = utils.decimalize(amount, bidDecimals)
  const askAmount = !askPrice
    ? BigInt(0)
    : utils.decimalize((valuation * (1 + discount)) / askPrice, askDecimals)

  const onPlaceOrder = async () => {
    try {
      const {
        sol: { purchasing },
      } = configs
      const { wallet } = window.sentre
      if (!wallet) throw new Error('Wallet is not connected')
      await setLoading(true)
      // Execute
      const { txId } = await purchasing.placeOrder(
        index,
        bidAmount,
        askAmount,
        lockedTime,
        retailerAddress,
        wallet,
      )
      notifySuccess('Place a new order', txId)
      return onClose()
    } catch (er: any) {
      return notifyError(er)
    } finally {
      return setLoading(false)
    }
  }

  return (
    <Modal
      visible={visible}
      footer={false}
      closeIcon={<IonIcon name="close-outline" />}
      onCancel={onClose}
    >
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Typography.Title level={5}>Confirm</Typography.Title>
        </Col>
        <Col span={24}>
          <Row gutter={[16, 16]}>
            <Col flex="auto">
              <Content
                label="Payment"
                avatar={
                  <Space>
                    <MintAvatar mintAddress={retailerData.mint_bid} />
                    <Typography.Title level={5}>
                      <MintSymbol mintAddress={retailerData.mint_bid} />
                    </Typography.Title>
                  </Space>
                }
                value={`${numeric(amount).format('0,0.[0000]')} LP`}
              />
            </Col>
            <Col>
              <Content
                label="Receiving"
                avatar={
                  <Space>
                    <MintAvatar mintAddress={retailerData.mint_ask} />
                    <Typography.Title level={5}>
                      <MintSymbol mintAddress={retailerData.mint_ask} />
                    </Typography.Title>
                  </Space>
                }
                value={numeric(
                  utils.undecimalize(askAmount, askDecimals),
                ).format('0,0.[0000]')}
                subValue={numeric(valuation / askPrice).format('0,0.[0000]')}
                floatRight
              />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Card
            className="confirm-sub-card"
            bodyStyle={{ padding: 16 }}
            bordered={false}
          >
            <Row gutter={[12, 12]}>
              <Col span={24}>
                <TimeInfo
                  label="Created At"
                  value={moment().format('HH:mm DD/MM/YYYY')}
                />
              </Col>
              <Col span={24}>
                <TimeInfo label="Locked Time" value={`${locktime} Days`} />
              </Col>
              <Col span={24}>
                <TimeInfo
                  label="Multiplier"
                  value={`${(1 + discount) * 100}%`}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={24}>
          <Button type="primary" onClick={onPlaceOrder} loading={loading} block>
            Confirm
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}
export default Confirm
