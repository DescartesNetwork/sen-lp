import { Fragment, ReactNode, useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { account, utils } from '@senswap/sen-js'
import { TokenInfo } from '@solana/spl-token-registry'

import { Card, Col, Row, Space, Typography } from 'antd'
import InservePrice from './inversePrice'
import LiquidityAction from './liquidityAction'

import { AppState } from 'app/model'
import { numeric } from 'shared/util'
import { useMint, usePool } from 'senhub/providers'
import useTokenProvider from 'app/hooks/useTokenProvider'
import { extractReserve } from 'app/helper'

const APY_DATE = 365

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
  const [supply, setSupply] = useState<number>(0)
  const lpts = useSelector((state: AppState) => state.lpts)
  const roi = useSelector(
    (state: AppState) => state.stat?.[poolAddress]?.details?.roi,
  )
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

  useEffect(() => {
    ;(async () => {
      if (!account.isAddress(mint_lpt)) return 0
      const {
        [mint_lpt]: { decimals, supply },
      } = await getMint({ address: mint_lpt })
      setSupply(Number(utils.undecimalize(supply, decimals)))
    })()
  }, [getMint, mint_lpt])

  const getReserve = (tokenInfo: TokenInfo | undefined) => {
    if (!tokenInfo || !poolData) return 0
    const { address, decimals } = tokenInfo
    if (!account.isAddress(address) || !decimals) return 0
    const reserve = extractReserve(address, poolData)
    return Number(utils.undecimalize(reserve, decimals))
  }

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
            <Col xs={8}>
              <Content
                label="My Contribution"
                title={<Title value={lpt} sub="LP" format="0,0.[0000]a" />}
              />
            </Col>
            <Col xs={16}>
              <Content
                label="Pool Composition"
                title={
                  <Space size={4} align="baseline">
                    {tokenInfos.map((tokenInfo, i) => (
                      <Fragment key={i}>
                        <Title
                          value={getReserve(tokenInfo)}
                          sub={tokenInfo?.symbol || 'TOKN'}
                          format="0,0.[00]a"
                        />
                        {tokenInfos.length > i + 1 && (
                          <Typography.Title level={5}>+</Typography.Title>
                        )}
                      </Fragment>
                    ))}
                  </Space>
                }
              />
            </Col>
            <Col xs={8}>
              <Content
                label="My Portion"
                title={<Title value={lpt / supply} format="0,0.[00]%" />}
                subTitle={`Over ${numeric(supply).format('0,0.[0000]a')} LP`}
              />
            </Col>
            <Col xs={16}>
              <Content
                label="In-Pool Price"
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
