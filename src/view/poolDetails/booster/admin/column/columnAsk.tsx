import { useSelector } from 'react-redux'
import { utils } from '@senswap/sen-js'
import { util } from '@sentre/senhub'

import { Typography } from 'antd'

import { AppState } from 'model'
import useMintDecimals from 'shared/hooks/useMintDecimals'
import { MintSymbol } from 'shared/antd/mint'

const ColumnAsk = ({ orderAddress }: { orderAddress: string }) => {
  const { retailers, orders } = useSelector((state: AppState) => state)
  const ordersDetail = orders[orderAddress]
  const { mint_ask } = retailers[ordersDetail.retailer] || {}
  const askDecimals = useMintDecimals(mint_ask) || 0
  const askAmount = utils.undecimalize(ordersDetail.ask_amount, askDecimals)

  return (
    <Typography.Text style={{ fontWeight: 700 }}>
      {util.numeric(askAmount).format('0,0.[0000]')}{' '}
      <MintSymbol mintAddress={mint_ask} />
    </Typography.Text>
  )
}

export default ColumnAsk
