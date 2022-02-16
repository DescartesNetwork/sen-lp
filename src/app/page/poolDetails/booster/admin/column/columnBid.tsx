import { useSelector } from 'react-redux'
import { utils } from '@senswap/sen-js'

import { Typography } from 'antd'

import { AppState } from 'app/model'
import useMintDecimals from 'shared/hooks/useMintDecimals'
import { numeric } from 'shared/util'

const ColumnBid = ({ orderAddress }: { orderAddress: string }) => {
  const { retailers, orders } = useSelector((state: AppState) => state)
  const ordersDetail = orders[orderAddress]
  const { mint_bid } = retailers[ordersDetail.retailer] || {}
  const bidDecimals = useMintDecimals(mint_bid) || 0
  const bidAmount = utils.undecimalize(ordersDetail.bid_amount, bidDecimals)

  return (
    <Typography.Text>
      {numeric(bidAmount).format('0,0.[0000]')} LP
    </Typography.Text>
  )
}

export default ColumnBid
