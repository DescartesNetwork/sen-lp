import { useState } from 'react'
import { useSelector } from 'react-redux'

import { Button } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { AppState } from 'app/model'
import { OrderState } from 'app/constant'
import { notifyError, notifySuccess } from 'app/helper'
import configs from 'app/configs'
import { explorer } from 'shared/util'

const Action = ({ orderAddress }: { orderAddress: string }) => {
  const [loading, setLoading] = useState(false)
  const { orders } = useSelector((state: AppState) => state)
  const { state, locked_time, updated_at } = orders[orderAddress] || {}

  const onCancel = async () => {
    try {
      const { wallet } = window.sentre
      const {
        sol: { purchasing },
      } = configs
      if (!wallet) throw new Error('Wallet is not connected')
      await setLoading(true)
      const { txId } = await purchasing.cancelOrder(orderAddress, wallet)
      return notifySuccess('Cancel the order', txId)
    } catch (er: any) {
      return notifyError(er)
    } finally {
      return setLoading(false)
    }
  }

  const onRedeem = async () => {
    try {
      const { wallet } = window.sentre
      const {
        sol: { purchasing },
      } = configs
      if (!wallet) throw new Error('Wallet is not connected')
      await setLoading(true)
      const { txId } = await purchasing.redeemOrder(orderAddress, wallet)
      return notifySuccess('Redeem the order', txId)
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
      <Button type="text" size="small" loading={loading} onClick={onCancel}>
        Cancel
      </Button>
    )
  if (state === OrderState.Approved) {
    const locked = Number(locked_time) > Date.now() / 1000 - Number(updated_at)
    return (
      <Button
        type="primary"
        size="small"
        disabled={locked}
        loading={loading}
        onClick={onRedeem}
      >
        Redeem
      </Button>
    )
  }
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
