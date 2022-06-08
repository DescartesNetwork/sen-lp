import { usePool, useWallet } from '@senhub/providers'

import { Space } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { PoolStatus } from 'app/constant'

const PoolCardStatus = ({ poolAddress }: { poolAddress: string }) => {
  const { pools } = usePool()
  const poolData = pools[poolAddress] || {}
  const {
    wallet: { address: walletAddress },
  } = useWallet()

  const isFrozen = poolData.state === PoolStatus.Frozen
  const isOwner = walletAddress === poolData?.owner

  return (
    <Space>
      {isFrozen && <IonIcon name="snow-outline" style={{ fontSize: 16 }} />}
      {isOwner && <IonIcon name="person-outline" style={{ fontSize: 16 }} />}
    </Space>
  )
}

export default PoolCardStatus
