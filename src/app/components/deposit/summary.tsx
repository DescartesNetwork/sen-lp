import { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { account, utils } from '@senswap/sen-js'
import { TokenInfo } from '@solana/spl-token-registry'

import { Row, Col, Card, Typography, Space, Button } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { AppState } from 'app/model'
import { useMint, usePool } from 'senhub/providers'
import { numeric } from 'shared/util'
import useTokenProvider from 'app/hooks/useTokenProvider'
import { extractReserve } from 'app/helper'

const Summary = ({
  value = '0',
  poolAddress,
}: {
  value?: string
  poolAddress: string
}) => {
  const [isReverse, setIsReverse] = useState(false)
  const [totalLPT, setTotalLPT] = useState('0')
  const [ratio, setRatio] = useState(0)
  const lpts = useSelector((state: AppState) => state.lpts)
  const { getMint, getDecimals } = useMint()
  const { pools } = usePool()

  const poolData = pools?.[poolAddress]
  const { reserve_a, mint_a, reserve_b, mint_b, mint_lpt } = poolData
  const tokenInfos = useTokenProvider(mint_lpt)

  const lptAddress =
    Object.keys(lpts).find((key) => lpts[key].pool === poolAddress) || ''
  const { amount } = lpts[lptAddress] || {}
  const lpt = Number(utils.undecimalize(amount || BigInt(0), 9))
  // Symbols
  let symbols = tokenInfos.map((token) => (!token ? 'TOKN' : token.symbol))
  if (isReverse) symbols.reverse()
  symbols.join(' / ')

  const getReserve = (tokenInfo: TokenInfo | undefined) => {
    if (!tokenInfo || !poolData) return 0
    const { address: mintAddress, decimals } = tokenInfo
    if (!account.isAddress(mintAddress) || !decimals) return 0
    const reserve = extractReserve(mintAddress, poolData)
    return Number(utils.undecimalize(reserve, decimals))
  }

  useEffect(() => {
    ;(async () => {
      try {
        const reserveA = Number(
          utils.undecimalize(reserve_a, await getDecimals(mint_a)),
        )
        const reserveB = Number(
          utils.undecimalize(reserve_b, await getDecimals(mint_b)),
        )
        const ratio = isReverse
          ? (await reserveB) / (await reserveA)
          : (await reserveA) / (await reserveB)
        return setRatio(ratio)
      } catch (er: any) {
        return setRatio(0)
      }
    })()
  }, [isReverse, mint_a, reserve_a, mint_b, reserve_b, getDecimals])

  useEffect(() => {
    ;(async () => {
      const {
        [mint_lpt]: { supply, decimals },
      } = await getMint({ address: mint_lpt })
      return setTotalLPT(utils.undecimalize(supply, decimals))
    })()
  }, [mint_lpt, getMint])

  return (
    <Card bordered={false} className="lp-card">
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Row gutter={[12, 12]}>
            <Col flex="auto">
              <Typography.Text type="secondary">In-Pool Price</Typography.Text>
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
                Pool Composition
              </Typography.Text>
            </Col>
            <Col>
              <Space size={4}>
                {tokenInfos.map((tokenInfo, i) => (
                  <Fragment key={i}>
                    <Typography.Text>
                      {numeric(getReserve(tokenInfo)).format('0,0.[00]a')}{' '}
                      {tokenInfo?.symbol || 'TOKN'}
                    </Typography.Text>
                    {tokenInfos.length > i + 1 && (
                      <Typography.Title level={5}>+</Typography.Title>
                    )}
                  </Fragment>
                ))}
              </Space>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[12, 12]}>
            <Col flex="auto">
              <Typography.Text type="secondary">My Current LP</Typography.Text>
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
                {numeric(totalLPT).format('0,0.[0000]')} LP
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

export default Summary
