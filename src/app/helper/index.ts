import { account, PoolData, utils } from '@senswap/sen-js'
import { TokenInfo } from '@solana/spl-token-registry'

import { explorer, fetchCGK } from 'shared/util'

export const notifySuccess = (content: string, txId: string) => {
  return window.notify({
    type: 'success',
    description: `${content} successfully. Click to view details.`,
    onClick: () => window.open(explorer(txId), '_blank'),
  })
}

export const notifyError = (er: any) => {
  return window.notify({
    type: 'error',
    description: er.message,
  })
}

export const extractReserve = (mintAddress: string, poolData: PoolData) => {
  const { mint_a, mint_b, reserve_a, reserve_b } = poolData
  if (mintAddress === mint_a) return reserve_a
  if (mintAddress === mint_b) return reserve_b
  return BigInt(0)
}

export const getTVL = async (
  poolAddress: string,
  tokenProvider: any,
  pools: any,
): Promise<number> => {
  try {
    const { reserve_a, reserve_b, mint_a, mint_b } = pools[poolAddress]
    const mintAddresses = [mint_a, mint_b]
    const tokenInfos: Array<TokenInfo | any> = await Promise.all(
      mintAddresses.map((mintAddress) => {
        if (!account.isAddress(mintAddress)) return {}
        return tokenProvider.findByAddress(mintAddress)
      }),
    )
    const reserves = [reserve_a, reserve_b]
    const decimals = tokenInfos.map(({ decimals }) => decimals)
    const data = await Promise.all(
      tokenInfos.map(({ extensions }) => {
        if (!extensions?.coingeckoId) return {} as any
        return fetchCGK(extensions?.coingeckoId)
      }),
    )
    const prices = data.map(({ price }) => price)
    let tvl = 0
    reserves.forEach((_, i) => {
      if (reserves[i] && decimals[i] && prices[i])
        tvl +=
          Number(utils.undecimalize(reserves[i] as bigint, decimals[i])) *
          prices[i]
    })
    return tvl
  } catch (er) {
    return 0
  }
}
