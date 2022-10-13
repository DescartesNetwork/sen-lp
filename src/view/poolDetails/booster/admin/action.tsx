import { useState } from 'react'
import { useSelector } from 'react-redux'
import { util } from '@sentre/senhub'

import { Button, Space } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { AppState } from 'model'
import { OrderState } from 'constant'
import { notifyError, notifySuccess } from 'helper'
import configs from 'configs'

const Action = ({ orderAddress }: { orderAddress: string }) => {
  const [loading, setLoading] = useState(false)
  const { orders } = useSelector((state: AppState) => state)
  const { state } = orders[orderAddress] || {}

  const onReject = async () => {
    try {
      const { solana } = window.sentre
      const {
        sol: { purchasing },
      } = configs
      if (!solana) throw new Error('Wallet is not connected')
      await setLoading(true)
      const { txId } = await purchasing.rejectOrder(orderAddress, solana)
      return notifySuccess('Reject the order', txId)
    } catch (er: any) {
      return notifyError(er)
    } finally {
      return setLoading(false)
    }
  }

  const onApprove = async () => {
    try {
      const { solana } = window.sentre
      const {
        sol: { purchasing },
      } = configs
      if (!solana) throw new Error('Wallet is not connected')
      await setLoading(true)
      const { txId } = await purchasing.approveOrder(orderAddress, solana)
      return notifySuccess('Approve the order', txId)
    } catch (er: any) {
      return notifyError(er)
    } finally {
      return setLoading(false)
    }
  }

  const onDetail = async () => {
    return window.open(util.explorer(orderAddress), '_blank')
  }

  if (state === OrderState.Open)
    return (
      <Space direction="vertical" align="center">
        <Button
          type="primary"
          size="small"
          loading={loading}
          onClick={onApprove}
        >
          Approve
        </Button>
        <Button type="text" size="small" loading={loading} onClick={onReject}>
          Reject
        </Button>
      </Space>
    )
  return (
    <Button
      type="text"
      size="small"
      icon={<IonIcon name="open-outline" />}
      onClick={onDetail}
    >
      Detail
    </Button>
  )
}

export default Action
