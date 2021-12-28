import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { PoolData, utils } from '@senswap/sen-js'

import { Row, Col, Card, Typography, Space, Button } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { AppState } from 'app/model'
import { useMint, usePool } from 'senhub/providers'
import { numeric, fetchCGK } from 'shared/util'
import useTokenProvider from 'app/shared/hooks/useTokenProvider'
import { MintDetail } from 'app/page/poolDetails/liquidityPosition/inversePrice'
import { TokenInfo } from '@solana/spl-token-registry'

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

const LPT = ({
  value = '0',
  poolAddress,
}: {
  value?: string
  poolAddress: string
}) => {
  const [isReverse, setIsReverse] = useState(false)
  const [totalLPT, setTotalLPT] = useState('0')
  const [listMintDetail, setListMintDetail] = useState<MintDetail[]>([])
  const [ratio, setRatio] = useState(0)
  const lpts = useSelector((state: AppState) => state.lpts)
  const { getMint } = useMint()
  const { pools } = usePool()

  const poolData = pools?.[poolAddress]
  const { reserve_a, mint_a, reserve_b, mint_b, mint_lpt } = poolData
  const tokenInfos = useTokenProvider(mint_lpt)

  const lptAddress =
    Object.keys(lpts).find((key) => lpts[key].pool === poolAddress) || ''
  const { amount } = lpts[lptAddress] || {}
  const lpt = Number(utils.undecimalize(amount || BigInt(0), 9))
  const reserveA = useMemo(async () => {
    const {
      [mint_a]: { decimals: decimals_a },
    } = await getMint({ address: mint_a })
    return Number(utils.undecimalize(reserve_a, decimals_a))
  }, [getMint, mint_a, reserve_a])
  const reserveB = useMemo(async () => {
    const {
      [mint_b]: { decimals: decimals_b },
    } = await getMint({ address: mint_b })
    return Number(utils.undecimalize(reserve_b, decimals_b))
  }, [getMint, mint_b, reserve_b])
  const symbols = useMemo(() => {
    const symbol = tokenInfos.map((token) => {
      if (!token) return 'UNKN'
      return token.symbol
    })
    if (isReverse) symbol.reverse()
    return symbol.join('/')
  }, [isReverse, tokenInfos])

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

  useEffect(() => {
    ;(async () => {
      const ratio = isReverse
        ? (await reserveB) / (await reserveA)
        : (await reserveA) / (await reserveB)
      setRatio(ratio)
    })()
  }, [isReverse, reserveA, reserveB])
  useEffect(() => {
    ;(async () => {
      const {
        [mint_lpt]: { supply, decimals },
      } = await getMint({ address: mint_lpt })
      setTotalLPT(utils.undecimalize(supply, decimals))
    })()
  }, [mint_lpt, getMint])

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
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Row gutter={[12, 12]}>
            <Col flex="auto">
              <Typography.Text type="secondary">
                In - Pool Price
              </Typography.Text>
            </Col>
            <Col>
              <Space>
                <Button
                  type="text"
                  style={{ width: 'auto', height: 'auto' }}
                  icon={<IonIcon name="swap-horizontal-outline" />}
                  onClick={() => setIsReverse(!isReverse)}
                />
                <Typography.Text>
                  {numeric(ratio).format('0,0.[0000]')}
                </Typography.Text>
                <Typography.Text>{symbols}</Typography.Text>
              </Space>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[12, 12]}>
            <Col flex="auto">
              <Typography.Text type="secondary">
                Pool Share Composition
              </Typography.Text>
            </Col>
            <Col>
              <Space size={4}>
                {listMintDetail.map((mintDetail, idx) => {
                  const mintAmount = calcMintAmount(mintDetail)
                  return (
                    <Fragment key={mintAmount + idx}>
                      <Typography.Text>
                        {numeric(mintAmount).format('0,0.[00]a')}
                        {mintDetail.symbol}
                      </Typography.Text>
                      {listMintDetail.length > idx + 1 && (
                        <Typography.Text>+</Typography.Text>
                      )}
                    </Fragment>
                  )
                })}
              </Space>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[12, 12]}>
            <Col flex="auto">
              <Typography.Text type="secondary">Your LP Tokens</Typography.Text>
            </Col>
            <Col>
              <Typography.Text>
                {numeric(lpt).format('0,0.[0000]')} LP
              </Typography.Text>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[8, 8]}>
            <Col flex="auto">
              <Typography.Text type="secondary">Total LP</Typography.Text>
            </Col>
            <Col>
              <Typography.Text>
                {numeric(totalLPT).format('0,0.[0000]')}
              </Typography.Text>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[12, 12]}>
            <Col flex="auto">
              <Typography.Text type="secondary">
                You will reveice
              </Typography.Text>
            </Col>
            <Col>
              <Space size={4}>
                <Typography.Title level={5}>
                  {numeric(value).format('0,0.[0000]')}
                </Typography.Title>
                <Typography.Title level={5}>LP</Typography.Title>
              </Space>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

export default LPT
