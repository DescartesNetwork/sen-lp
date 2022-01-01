import { utils } from '@senswap/sen-js'

import { Space, Typography } from 'antd'
import { MintSymbol } from 'shared/antd/mint'

import { usePool } from 'senhub/providers'
import { numeric } from 'shared/util'
import useMintDecimals from 'app/hooks/useMintDecimals'

const PoolPrice = ({
  poolAddress,
  reversed = false,
}: {
  poolAddress: string
  reversed?: boolean
}) => {
  const { pools } = usePool()

  const { mint_a, mint_b, reserve_a, reserve_b, mint_lpt } =
    pools[poolAddress] || {}
  const decimalsA = useMintDecimals(mint_a)
  const decimalsB = useMintDecimals(mint_b)
  const amountA = Number(utils.undecimalize(reserve_a, decimalsA))
  const amountB = Number(utils.undecimalize(reserve_b, decimalsB))

  const price = amountB ? amountA / amountB : 0
  const reversedPrice = amountA ? amountB / amountA : 0

  return (
    <Space>
      <Typography.Text>
        {numeric(reversed ? reversedPrice : price).format('0,0.[0000]')}
      </Typography.Text>
      <MintSymbol mintAddress={mint_lpt} reversed={reversed} separator=" / " />
    </Space>
  )
}

export default PoolPrice
