import { useDispatch } from 'react-redux'
import { account } from '@senswap/sen-js'
import { useWalletAddress } from '@sentre/senhub'

import { Button, Row, Col } from 'antd'

import configs from 'configs'
import { notifyError, notifySuccess } from 'helper'
import { AppDispatch } from 'model'
import { getRetailer } from 'model/retailers.controller'
import { usePool } from 'hooks/pools/usePool'

const NewRetailer = ({ poolAddress }: { poolAddress: string }) => {
  const dispatch = useDispatch<AppDispatch>()
  const walletAddress = useWalletAddress()
  const { pools } = usePool()
  const poolData = pools[poolAddress]

  const onNew = async () => {
    const { solana } = window.sentre
    const {
      sol: { purchasing, sntrAddress },
    } = configs
    try {
      if (!solana) throw new Error('Wallet is not connected')
      if (!account.isAddress(poolData?.mint_lpt))
        throw new Error('Invalid bid mint address')
      if (!account.isAddress(sntrAddress))
        throw new Error('Invalid ask mint address')
      const { txId, retailerAddress } = await purchasing.initializeRetailer(
        walletAddress,
        poolData.mint_lpt,
        sntrAddress,
        solana,
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
