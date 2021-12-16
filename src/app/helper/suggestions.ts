import { utils } from '@senswap/sen-js'
import { MintInfo } from './cgk'

export interface MintPrice {
  price: number
}

const suggestions = {
  calculateAmount: (
    srcReserve: bigint,
    srcMintInfo: MintInfo,
    suggestMintInfo: MintInfo,
  ) => {
    if (!srcReserve || !srcMintInfo || !suggestMintInfo) return
    const { price: suggestPrice } = suggestMintInfo
    const { decimals, price: srcPrice } = srcMintInfo
    const totalPriceSrcMint =
      Number(utils.undecimalize(srcReserve, decimals)) * srcPrice
    const suggestAmount = totalPriceSrcMint / suggestPrice
    return suggestAmount
  },
}

export default suggestions
