import { useDispatch } from 'react-redux'
import { account } from '@senswap/sen-js'
import { usePool, useWallet } from '@senhub/providers'

import { Button, Row, Col } from 'antd'

import configs from 'app/configs'
import { notifyError, notifySuccess } from 'app/helper'
import { AppDispatch } from 'app/model'
import { getRetailer } from 'app/model/retailers.controller'

const NewRetailer = ({ poolAddress }: { poolAddress: string }) => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const { pools } = usePool()
  const poolData = pools[poolAddress]

  const onNew = async () => {
    const { wallet } = window.sentre
    const {
      sol: { purchasing, sntrAddress },
    } = configs
    try {
      if (!wallet) throw new Error('Wallet is not connected')
      if (!account.isAddress(poolData?.mint_lpt))
        throw new Error('Invalid bid mint address')
      if (!account.isAddress(sntrAddress))
        throw new Error('Invalid ask mint address')
      const { txId, retailerAddress } = await purchasing.initializeRetailer(
        walletAddress,
        poolData.mint_lpt,
        sntrAddress,
        wallet,
      )
      await dispatch(getRetailer({ address: retailerAddress })).unwrap()
      return notifySuccess('Initialize a new retailer', txId)
    } catch (er: any) {
      return notifyError(er)
    }
  }

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Button type="primary" onClick={onNew}>
          New Retailer
        </Button>
      </Col>
    </Row>
  )
}

export default NewRetailer
