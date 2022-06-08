import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { account, utils } from '@senswap/sen-js'
import { useMint, usePool } from '@senhub/providers'

import { Row, Col, Card, Typography, Space, Button } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import PoolPrice from 'app/components/poolPrice'
import { MintSymbol } from 'shared/antd/mint'

import { AppState } from 'app/model'
import { numeric } from 'shared/util'
import useMintDecimals from 'shared/hooks/useMintDecimals'

const Summary = ({
  value = '0',
  poolAddress,
}: {
  value?: string
  poolAddress: string
}) => {
  const [isReverse, setIsReverse] = useState(false)
  const [totalLPT, setTotalLPT] = useState('0')
  const { lpts } = useSelector((state: AppState) => state)
  const { getMint } = useMint()
  const { pools } = usePool()

  const { mint_a, mint_b, reserve_a, reserve_b, mint_lpt } =
    pools[poolAddress] || {}
  const decimalsA = useMintDecimals(mint_a) || 0
  const decimalsB = useMintDecimals(mint_b) || 0
  const reserveA = utils.undecimalize(reserve_a, decimalsA)
  const reserveB = utils.undecimalize(reserve_b, decimalsB)

  const lptAddress =
    Object.keys(lpts)?.find((key) => lpts[key].pool === poolAddress) || ''
  const { amount } = lpts[lptAddress] || {}
  const lpt = Number(utils.undecimalize(amount || BigInt(0), 9))

  useEffect(() => {
    if (!account.isAddress(mint_lpt)) return
    ;(async () => {
      const {
        [mint_lpt]: { supply, decimals },
      } = await getMint({ address: mint_lpt })
      return setTotalLPT(utils.undecimalize(supply, decimals))
    })()
  }, [mint_lpt, getMint])

  return (
    <Card bordered={false} className="deposit-card">
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
                <PoolPrice poolAddress={poolAddress} reversed={isReverse} />
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
                <Typography.Text>
                  {numeric(reserveA).format('0,0.[00]a')}{' '}
                  <MintSymbol mintAddress={mint_a} />
                </Typography.Text>
                <Typography.Title level={5}> + </Typography.Title>
                <Typography.Text>
                  {numeric(reserveB).format('0,0.[00]a')}{' '}
                  <MintSymbol mintAddress={mint_b} />
                </Typography.Text>
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
