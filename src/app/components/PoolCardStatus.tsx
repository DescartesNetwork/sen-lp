import { Space, Divider } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { usePool, useWallet } from 'senhub/providers'
import { PoolStatus } from 'app/constant'

const PoolCardStatus = ({ poolAddress }: { poolAddress: string }) => {
  const { pools } = usePool()
  const poolData = pools[poolAddress] || {}
  const {
    wallet: { address: walletAddress },
  } = useWallet()

  const isFrozen = poolData.state === PoolStatus.Frozen
  const isOwner = walletAddress === poolData.owner

  return (
    <Space>
      {(isFrozen || isOwner) && (
        <Divider type="vertical" style={{ margin: 0 }} />
      )}
      {isFrozen && <IonIcon name="snow-outline" />}
      {isOwner && <IonIcon name="person-outline" />}
    </Space>
  )
}

export default PoolCardStatus
