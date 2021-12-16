import { utils } from '@senswap/sen-js'
//import { MintInfo } from './cgk'

export interface MintPrice {
  price: number
}
export interface MintInfo {
  address: string
  symbol: string
  price: number
  decimals: number
}
const suggestions = {
  calculateAmount: (
    srcReserve: bigint,
    srcMintInfo: MintInfo,
    suggestMintInfo: MintInfo,
  ) => {
    if (!srcReserve || !srcMintInfo || !suggestMintInfo) return 0
    const { price: suggestPrice } = suggestMintInfo
    const { decimals, price: srcPrice } = srcMintInfo
    const totalPriceSrcMint =
      Number(utils.undecimalize(srcReserve, decimals)) * srcPrice
    const suggestAmount = totalPriceSrcMint / suggestPrice
    return suggestAmount
  },
}

export default suggestions
