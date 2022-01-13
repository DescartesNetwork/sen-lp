import { useState } from 'react'
import { usePool } from '@senhub/providers'

import { Button, Space } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import { MintAvatar } from 'shared/antd/mint'

import PoolPrice from 'app/components/poolPrice'

const Price = ({ poolAddress }: { poolAddress: string }) => {
  const { pools } = usePool()
  const [isReverse, setIsReverse] = useState(true)

  const { mint_lpt } = pools[poolAddress] || {}

  return (
    <Space>
      <MintAvatar mintAddress={mint_lpt} reversed={isReverse} />
      <PoolPrice poolAddress={poolAddress} reversed={isReverse} />
      <Button
        type="text"
        onClick={() => setIsReverse(!isReverse)}
        icon={<IonIcon name="swap-horizontal-outline" />}
      />
    </Space>
  )
}

export default Price
