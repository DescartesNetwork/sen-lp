import { ReactNode, useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { account, utils } from '@senswap/sen-js'

import { Card, Col, Row, Space, Typography } from 'antd'
import LiquidityAction from './liquidityAction'
import { AppState } from 'app/model'
import { numeric } from 'shared/util'
import { useMint, usePool } from 'senhub/providers'
import InservePrice from './inversePrice'

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
}: {
  value?: string | number
  sub?: string
}) => {
  return (
    <Space size={4} align="baseline">
      <Typography.Title level={4}>{value}</Typography.Title>
      {sub && (
        <Typography.Text className="caption" type="secondary">
          {sub}
        </Typography.Text>
      )}
    </Space>
  )
}

const LiquidityPosition = ({ poolAddress }: { poolAddress: string }) => {
  const roi = useSelector(
    (state: AppState) => state.stat?.[poolAddress]?.details?.roi,
  )
  const [supply, setSupply] = useState<number>(0)
  const lpts = useSelector((state: AppState) => state.lpts)
  const { getMint } = useMint()
  const { pools } = usePool()
  const { mint_lpt } = pools?.[poolAddress] || {}

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

  const formatNumber = (value: number | string, format: string) => {
    return numeric(value).format(format)
  }

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
                  <Title
                    value={formatNumber(calculateRoi(APY_DATE), '0,0.[00]%')}
                  />
                }
              />
            </Col>
            <Col span={12}>
              <Content
                label="Your LPT"
                title={
                  <Title value={formatNumber(lpt, '0,0.[0000]a')} sub="LPT" />
                }
              />
            </Col>
            <Col span={12}>
              <Content
                label="Pool Share Composition"
                title={
                  <Space size={4} align="baseline">
                    <Title value={8.192} sub="SEN" />
                    <Typography.Title level={5}>+</Typography.Title>
                    <Title value={8.192} sub="BTC" />
                  </Space>
                }
              />
            </Col>
            <Col span={12}>
              <Content
                label="My Portion"
                title={
                  <Title value={formatNumber(lpt / supply, '0,0.[00]%')} />
                }
                subTitle={formatNumber(supply, '0,0.[0000]a')}
              />
            </Col>
            <Col span={12}>
              <Content
                label="In - Pool Price"
                title={<InservePrice poolAddress={poolAddress} />}
              />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <LiquidityAction poolAddress={poolAddress} />
        </Col>
      </Row>
    </Card>
  )
}

export default LiquidityPosition
