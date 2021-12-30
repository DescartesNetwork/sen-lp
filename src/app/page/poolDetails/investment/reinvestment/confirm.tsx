import { ReactNode, useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { utils } from '@senswap/sen-js'

import { Button, Col, Divider, Modal, Row, Space, Typography } from 'antd'
import { MintAvatar, MintSymbol } from 'app/components/mint'
import IonIcon from 'shared/antd/ionicon'

import { AppState } from 'app/model'
import { numeric } from 'shared/util'
import { notifyError, notifySuccess } from 'app/helper'
import configs from 'app/configs'
import useMintDecimals from 'app/hooks/useMintDecimals'
import useNextOrderIndex from 'app/hooks/useNextOrderIndex'

import { VESTING } from 'app/constant'

const Content = ({
  label = '',
  avatar = undefined,
  value = '',
  color = undefined,
  subValue = undefined,
  floatRight = false,
}: {
  label?: string
  avatar?: ReactNode
  value?: string | number
  color?: string | undefined
  subValue?: string | number | undefined
  floatRight?: boolean
}) => {
  const textAlign = floatRight ? 'right' : 'left'
  return (
    <Space size={12} direction="vertical" style={{ textAlign: textAlign }}>
      <Typography.Text>{label}</Typography.Text>
      {avatar}
      <Typography.Title level={3} style={{ color: color ? color : 'inherit' }}>
        {value}
      </Typography.Title>
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
        <Typography.Text
          style={{
            display: 'list-item',
            listStyleType: 'square',
            marginLeft: 16,
          }}
        >
          {label}
        </Typography.Text>
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
  const bidDecimals = useMintDecimals(retailerData.mint_bid)
  const askDecimals = useMintDecimals(retailerData.mint_ask)

  const lockedTime = global.BigInt(Math.floor(locktime * 24 * 60 * 60))
  const discount =
    VESTING.find(({ locktime: l }) => l === locktime)?.discount || 0
  const bidAmount = utils.decimalize(amount, bidDecimals)
  const askAmount = utils.decimalize(amount, askDecimals)

  console.log(discount)

  const onPlaceOrder = async () => {
    try {
      const {
        sol: { purchasing },
      } = configs
      const { wallet } = window.sentre
      if (!wallet) throw new Error('Wallet is not connected')
      await setLoading(true)
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
                label="Est. Payment"
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
                label="Est. Receiving"
                avatar={
                  <Space>
                    <MintAvatar mintAddress={retailerData.mint_ask} />
                    <Typography.Title level={5}>
                      <MintSymbol mintAddress={retailerData.mint_ask} />
                    </Typography.Title>
                  </Space>
                }
                value={1200}
                subValue={1000}
                color="#3E8C6A"
                floatRight
              />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Divider style={{ margin: 0 }} />
        </Col>
        <Col span={24}>
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
          </Row>
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
