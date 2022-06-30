import { ReactNode, useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { account, utils } from '@senswap/sen-js'
import { useMint, usePool, util } from '@sentre/senhub'

import { Col, Row, Space, Typography } from 'antd'
import Price from './price'

import { AppState } from 'model'

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
        {util.numeric(value).format(format)}
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

  const { mint_lpt } = pools[poolAddress] || {}

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
    <Row gutter={[20, 20]}>
      <Col span={24}>
        <Content
          label="APY"
          title={<Title value={calculateRoi(APY_DATE)} format="0,0.[00]%" />}
        />
      </Col>
      <Col xs={12}>
        <Content
          label="My Portion"
          title={<Title value={lpt / supply} format="0,0.[00]%" />}
          subTitle={`Over ${util.numeric(supply).format('0,0.[0000]a')} LP`}
        />
      </Col>
      <Col xs={12}>
        <Content
          label="My Contribution"
          title={<Title value={lpt} sub="LP" format="0,0.[0000]a" />}
        />
      </Col>
      <Col xs={24}>
        <Content
          label="In-Pool Price"
          title={<Price poolAddress={poolAddress} />}
        />
      </Col>
    </Row>
  )
}

export default LiquidityPosition
