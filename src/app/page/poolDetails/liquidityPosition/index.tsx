import { ReactNode, useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { account, utils } from '@senswap/sen-js'
import { useMint, usePool } from '@senhub/providers'

import { Card, Col, Row, Space, Typography } from 'antd'
import Price from './price'
import LiquidityAction from './liquidityAction'
import History from './history'
import { MintSymbol } from 'shared/antd/mint'

import { AppState } from 'app/model'
import { numeric } from 'shared/util'
import useMintDecimals from 'shared/hooks/useMintDecimals'
import IonIcon from 'shared/antd/ionicon'

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
  sub?: string | ReactNode
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
  const [visisble, setVisible] = useState(false)

  const lpts = useSelector((state: AppState) => state.lpts)
  const roi = useSelector(
    (state: AppState) => state.stat?.[poolAddress]?.details?.roi,
  )
  const { getMint } = useMint()
  const { pools } = usePool()

  const { mint_a, mint_b, reserve_a, reserve_b, mint_lpt } =
    pools[poolAddress] || {}
  const decimalsA = useMintDecimals(mint_a) || 0
  const decimalsB = useMintDecimals(mint_b) || 0
  const reserveA = utils.undecimalize(reserve_a, decimalsA)
  const reserveB = utils.undecimalize(reserve_b, decimalsB)

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

  return (
    <Card bordered={false}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Row>
            <Col flex="auto">
              <Typography.Title level={4}>Liquidity Position</Typography.Title>
            </Col>
            <Col>
              <IonIcon
                style={{ cursor: 'pointer', fontSize: 16 }}
                name="document-text-outline"
                onClick={() => setVisible(true)}
              />
            </Col>
          </Row>
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
                    <Title
                      value={reserveA}
                      sub={<MintSymbol mintAddress={mint_a} />}
                      format="0,0.[00]a"
                    />
                    <Typography.Title level={5}>+</Typography.Title>
                    <Title
                      value={reserveB}
                      sub={<MintSymbol mintAddress={mint_b} />}
                      format="0,0.[00]a"
                    />
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
                title={<Price poolAddress={poolAddress} />}
              />
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <LiquidityAction lpt={lpt} poolAddress={poolAddress} />
        </Col>
      </Row>
      <History visible={visisble} setVisible={setVisible} />
    </Card>
  )
}

export default LiquidityPosition
