import { useState } from 'react'
import { useSelector } from 'react-redux'

import { Space, Button, Typography } from 'antd'

import { AppState } from 'model'
import { notifyError, notifySuccess } from 'helper'
import configs from 'configs'
import { account } from '@senswap/sen-js'
import IonIcon from '@sentre/antd-ionicon'

const RetailerState = ({ retailerAddress }: { retailerAddress: string }) => {
  const [loading, setLoading] = useState(false)
  const {
    retailers: { [retailerAddress]: retailerData },
  } = useSelector((state: AppState) => state)

  const state = retailerData?.state

  const onFreeze = async () => {
    try {
      const {
        sol: { purchasing },
      } = configs
      const { solana } = window.sentre
      if (!solana) throw new Error('Wallet is not connected')
      if (!account.isAddress(retailerAddress))
        throw new Error('Invalid retailer address')
      await setLoading(true)
      const { txId } = await purchasing.freezeRetailer(retailerAddress, solana)
      return notifySuccess(`Freeze the retailer ${retailerAddress}`, txId)
    } catch (er) {
      return notifyError(er)
    } finally {
      return setLoading(false)
    }
  }

  const onThaw = async () => {
    try {
      const {
        sol: { purchasing },
      } = configs
      const { solana } = window.sentre
      if (!solana) throw new Error('Wallet is not connected')
      if (!account.isAddress(retailerAddress))
        throw new Error('Invalid retailer address')
      await setLoading(true)
      const { txId } = await purchasing.thawRetailer(retailerAddress, solana)
      return notifySuccess(`Thaw the retailer ${retailerAddress}`, txId)
    } catch (er) {
      return notifyError(er)
    } finally {
      return setLoading(false)
    }
  }

  return (
    <Space>
      <Typography.Text>Current State:</Typography.Text>
      <IonIcon name={state === 1 ? 'checkmark-circle-sharp' : 'snow-outline'} />
      <Typography.Text style={{ fontWeight: 700 }}>
        {state === 1 ? 'Active' : 'Frozen'}
      </Typography.Text>
      <Button
        size="small"
        onClick={state === 1 ? onFreeze : onThaw}
        loading={loading}
      >
        {state === 1 ? 'Freeze' : 'Thaw'}
      </Button>
    </Space>
  )
}

export default RetailerState
