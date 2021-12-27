import { Fragment, ReactNode, useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { account, PoolData, utils } from '@senswap/sen-js'
import { TokenInfo } from '@solana/spl-token-registry'

import { Card, Col, Row, Space, Typography } from 'antd'
import InservePrice, { MintDetail } from './inversePrice'
import LiquidityAction from './liquidityAction'

import { AppState } from 'app/model'
import { numeric } from 'shared/util'
import { useMint, usePool } from 'senhub/providers'
import { fetchCGK } from 'shared/helper'
import useTokenProvider from 'app/shared/hooks/useTokenProvider'

const APY_DATE = 365
const MARKET_DEFAULT = {
  icon: '',
  symbol: '',
  name: '',
  address: '',
  rank: '',
  price: 0,
  priceChange: 0,
  totalVolume: 0,
  decimals: 0,
}

const Content = ({
  label = 'label',
  title = '',
  subTitle = null,
}: {
  label?: string
  title?: string | ReactNode
  subTitle?: string | null
}) => {
  return (
    <Space direction="vertical" size={4}>
      <Typography.Text className="caption" type="secondary">
        {label}
      </Typography.Text>
      <span>{title}</span>
      {subTitle && (
        <Typography.Text type="secondary">{subTitle}</Typography.Text>
      )}
    </Space>
  )
}

const Title = ({
  value = 0,
  sub = '',
  format = '',
}: {
  value?: string | number
  sub?: string
  format?: string
}) => {
  return (
    <Space size={4} align="baseline">
      <Typography.Title level={4}>
        {numeric(value).format(format)}
      </Typography.Title>
      {sub && (
        <Typography.Text className="caption" type="secondary">
          {sub}
        </Typography.Text>
      )}
    </Space>
  )
}

const LiquidityPosition = ({ poolAddress }: { poolAddress: string }) => {
  const [listMintDetail, setListMintDetail] = useState<MintDetail[]>([])
  const roi = useSelector(
    (state: AppState) => state.stat?.[poolAddress]?.details?.roi,
  )
  const [supply, setSupply] = useState<number>(0)
  const lpts = useSelector((state: AppState) => state.lpts)
  const { getMint } = useMint()
  const { pools } = usePool()
  const poolData = pools?.[poolAddress] || {}
  const { mint_lpt } = poolData
  const tokenInfos = useTokenProvider(mint_lpt)

  const lptAddress =
    Object.keys(lpts).find((key) => lpts[key].pool === poolAddress) || ''
  const { amount } = lpts[lptAddress] || {}
  const lpt = Number(utils.undecimalize(amount || BigInt(0), 9))

  const calculateRoi = useCallback(
    (date: number) => {
      if (!roi || !date) return 0
      return Math.pow(roi / 100 + 1, date) - 1
    },
    [roi],
  )

  const getSupply = useCallback(async () => {
    if (!account.isAddress(mint_lpt)) return 0
    const {
      [mint_lpt]: { decimals, supply },
    } = await getMint({ address: mint_lpt })
    setSupply(Number(utils.undecimalize(supply, decimals)))
  }, [getMint, mint_lpt])
  useEffect(() => {
    getSupply()
  }, [getSupply])

  const extractReserve = (mintAddress: string, poolData: PoolData) => {
    const { mint_a, mint_b, reserve_a, reserve_b } = poolData
    if (mintAddress === mint_a) return reserve_a
    if (mintAddress === mint_b) return reserve_b
    return BigInt(0)
  }
  const calcMintAmount = (mintDetail: MintDetail | TokenInfo) => {
    if (!mintDetail || !poolData) return 0
    const { address, decimals } = mintDetail
    const reserve = extractReserve(address, poolData)
    const amount = Number(utils.undecimalize(reserve, decimals))
    return amount
  }

  const fetchMintDetails = useCallback(async () => {
    if (!tokenInfos) return
    const promises = tokenInfos.map(async (tokenInfo): Promise<MintDetail> => {
      const ticket = tokenInfo?.extensions?.coingeckoId
      if (!ticket) return MARKET_DEFAULT
      const marketInfo = await fetchCGK(ticket)
      return {
        ...marketInfo,
        decimals: tokenInfo.decimals,
        address: tokenInfo.address,
      }
    })
    const listMintDetail = await Promise.all(promises)
    setListMintDetail(listMintDetail)
  }, [tokenInfos])
  useEffect(() => {
    fetchMintDetails()
  }, [fetchMintDetails])

  return (
    <Card bordered={false}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Typography.Title level={4}>Liquidity Position</Typography.Title>
        </Col>
        <Col span={24}>
          <Row gutter={[20, 20]}>
            <Col span={24}>
              <Content
                label="APY"
                title={
                  <Title value={calculateRoi(APY_DATE)} format="0,0.[00]%" />
                }
              />
            </Col>
            <Col xs={8} sm={12}>
              <Content
                label="Your LPT"
                title={<Title value={lpt} sub="LPT" format="0,0.[0000]a" />}
              />
            </Col>
            <Col xs={16} sm={12}>
              <Content
                label="Pool Share Composition"
                title={
                  <Space size={4} align="baseline">
                    {listMintDetail.map((mintDetail, idx) => {
                      const mintAmount = calcMintAmount(mintDetail)
                      return (
                        <Fragment key={mintAmount + idx}>
                          <Title
                            value={mintAmount}
                            sub={mintDetail.symbol}
                            format="0,0.[00]a"
                          />
                          {listMintDetail.length > idx + 1 && (
                            <Typography.Title level={5}>+</Typography.Title>
                          )}
                        </Fragment>
                      )
                    })}
                  </Space>
                }
              />
            </Col>
            <Col xs={8} sm={12}>
              <Content
                label="My Portion"
                title={<Title value={lpt / supply} format="0,0.[00]%" />}
                subTitle={numeric(supply).format('0,0.[0000]a')}
              />
            </Col>
            <Col xs={16} sm={12}>
              <Content
                label="In - Pool Price"
                title={<InservePrice poolAddress={poolAddress} />}
              />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <LiquidityAction lpt={lpt} poolAddress={poolAddress} />
        </Col>
      </Row>
    </Card>
  )
}

export default LiquidityPosition
