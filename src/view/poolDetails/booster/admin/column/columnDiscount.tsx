import { useSelector } from 'react-redux'
import { utils } from '@senswap/sen-js'
import { util } from '@sentre/senhub'

import { Typography } from 'antd'

import { AppState } from 'model'
import useMintDecimals from 'shared/hooks/useMintDecimals'
import { useMintPrice } from 'hooks/useMintPrice'
import { VESTING } from 'constant'

const SECOND_PER_DAY = 86400

const ColumnDiscount = ({ orderAddress }: { orderAddress: string }) => {
  const { retailers, orders } = useSelector((state: AppState) => state)
  const { retailer, bid_amount, ask_amount, locked_time } = orders[orderAddress]
  const { mint_bid, mint_ask } = retailers[retailer] || {}

  // Get total bid
  const bidDecimals = useMintDecimals(mint_bid) || 0
  const bidAmount = Number(utils.undecimalize(bid_amount, bidDecimals))
  const bidPrice = useMintPrice(mint_bid)
  const totalBid = bidAmount * bidPrice

  // Get total ask
  const askDecimals = useMintDecimals(mint_ask) || 0
  const askAmount = Number(utils.undecimalize(ask_amount, askDecimals))
  const askPrice = useMintPrice(mint_ask)
  const totalAsk = askAmount * askPrice

  // Calculate current discount
  const currentDiscount = (totalAsk - totalBid) / totalBid
  const vestingDiscount =
    VESTING.find((v) => v.locktime === Number(locked_time) / SECOND_PER_DAY)
      ?.discount || 0

  return (
    <Typography.Text
      style={{
        color: currentDiscount <= vestingDiscount ? '#14E041' : '#D72311',
      }}
    >
      {util.numeric(currentDiscount).format('0,0.[00]%')}
    </Typography.Text>
  )
}

export default ColumnDiscount
