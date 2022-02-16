import { useState } from 'react'
import { useSelector } from 'react-redux'

import { Button, Space } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { AppState } from 'app/model'
import { OrderState } from 'app/constant'
import { notifyError, notifySuccess } from 'app/helper'
import configs from 'app/configs'
import { explorer } from 'shared/util'

const Action = ({ orderAddress }: { orderAddress: string }) => {
  const [loading, setLoading] = useState(false)
  const { orders } = useSelector((state: AppState) => state)
  const { state } = orders[orderAddress] || {}

  const onReject = async () => {
    try {
      const { wallet } = window.sentre
      const {
        sol: { purchasing },
      } = configs
      if (!wallet) throw new Error('Wallet is not connected')
      await setLoading(true)
      const { txId } = await purchasing.rejectOrder(orderAddress, wallet)
      return notifySuccess('Reject the order', txId)
    } catch (er: any) {
      return notifyError(er)
    } finally {
      return setLoading(false)
    }
  }

  const onApprove = async () => {
    try {
      const { wallet } = window.sentre
      const {
        sol: { purchasing },
      } = configs
      if (!wallet) throw new Error('Wallet is not connected')
      await setLoading(true)
      const { txId } = await purchasing.approveOrder(orderAddress, wallet)
      return notifySuccess('Approve the order', txId)
    } catch (er: any) {
      return notifyError(er)
    } finally {
      return setLoading(false)
    }
  }

  const onDetail = async () => {
    return window.open(explorer(orderAddress), '_blank')
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
