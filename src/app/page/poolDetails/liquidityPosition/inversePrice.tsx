import { useCallback, useEffect, useMemo, useState } from 'react'
import { PoolData, utils } from '@senswap/sen-js'
import { TokenInfo } from '@solana/spl-token-registry'

import { Button, Space, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { MintAvatar, MintSymbol } from 'app/shared/components/mint'
import { useMint, usePool } from 'senhub/providers'
import { numeric } from 'shared/util'

export type MarketInfo = {
  icon: any
  symbol: any
  name: any
  address: any
  rank: any
  price: any
  priceChange: any
  totalVolume: any
}
export type Decimals = {
  decimals: number
}

export type MintDetail = Decimals & MarketInfo

const DEFAULT_TOKEN_INFO: TokenInfo = {
  address: '',
  chainId: 0,
  decimals: 0,
  name: '',
  symbol: 'TOKEN',
  extensions: undefined,
  logoURI: '',
  tags: [],
}

const InservePrice = ({ poolAddress }: { poolAddress: string }) => {
  const { pools } = usePool()
  const { tokenProvider } = useMint()
  const [isReverse, setIsReverse] = useState(false)
  const [tokenInfos, setTokenInfos] = useState<TokenInfo[]>()

  const poolData = useMemo(() => {
    return pools?.[poolAddress] || {}
  }, [poolAddress, pools])

  const extractReserve = (mintAddress: string, poolData: PoolData): bigint => {
    const { mint_a, mint_b, reserve_a, reserve_b } = poolData
    if (mintAddress === mint_a) return reserve_a
    if (mintAddress === mint_b) return reserve_b
    return BigInt(0)
  }

  const fetchTokenInfos = useCallback(async () => {
    if (!poolData) return
    const { mint_a, mint_b } = poolData
    const listMint = [mint_a, mint_b]

    const promises = listMint.map(async (mint): Promise<TokenInfo> => {
      let tokenInfo = await tokenProvider.findByAddress(mint)
      if (!tokenInfo) tokenInfo = DEFAULT_TOKEN_INFO
      return tokenInfo
    })
    const tokenInfos = await Promise.all(promises)
    setTokenInfos(tokenInfos)
  }, [poolData, tokenProvider])

  useEffect(() => {
    fetchTokenInfos()
  }, [fetchTokenInfos])

  function calcMintAmount(mintDetail: MintDetail | TokenInfo) {
    if (!mintDetail || !poolData) return 0
    const { address, decimals } = mintDetail
    const reserve = extractReserve(address, poolData)
    const amount = Number(utils.undecimalize(reserve, decimals))
    return amount
  }

  function calcInPoolPrice() {
    if (!tokenInfos) return 0
    const mintADetail = tokenInfos[0]
    const mintBDetail = tokenInfos[1]

    const mintAAmount = calcMintAmount(mintADetail)
    const mintBAmount = calcMintAmount(mintBDetail)
    if (!mintAAmount || !mintBAmount) return 0

    const inPoolPrice = mintAAmount / mintBAmount
    if (isReverse) return 1 / inPoolPrice
    return inPoolPrice
  }

  return (
    <Space>
      <MintAvatar mintAddress={poolData?.mint_lpt} isReserve={isReverse} />
      <Space>
        <Typography.Text>
          {numeric(calcInPoolPrice()).format('0,0.[0000]')}
        </Typography.Text>
        <MintSymbol
          mintAddress={poolData?.mint_lpt}
          isReverse={isReverse}
          separator="/"
        />
      </Space>
      <Button
        type="text"
        onClick={() => setIsReverse(!isReverse)}
        icon={<IonIcon name="swap-horizontal-outline" />}
      />
    </Space>
  )
}

export default InservePrice
