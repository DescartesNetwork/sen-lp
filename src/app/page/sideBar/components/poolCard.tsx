import { Fragment, ReactElement, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'

import { Row, Col, Card, Space, Typography, Divider, Tooltip } from 'antd'
import PoolTVL from 'app/components/poolTVL'
import PoolCardStatus from 'app/components/poolCardStatus'
import { MintAvatar, MintSymbol } from 'app/components/mint'

import { numeric } from 'shared/util'
import { AppState } from 'app/model'
import { fetchStatPoolData } from 'app/model/stat.controller'
import { PoolStatus } from 'app/constant'
import { usePool } from 'senhub/providers'

const PoolCard = ({
  poolAddress,
  onClick = () => {},
  action = <Fragment />,
  selected = false,
}: {
  poolAddress: string
  onClick?: () => void
  action?: ReactElement
  selected?: boolean
}) => {
  const dispatch = useDispatch()
  const { pools } = usePool()
  const details = useSelector(
    (state: AppState) => state.stat[poolAddress]?.details,
  )
  const { state: poolState, mint_lpt: mintLptAddress } =
    pools[poolAddress] || {}

  const apy = useMemo(() => {
    if (!details) return 0
    const roi = details.roi || 0
    return Math.pow(1 + roi / 100, 365) - 1
  }, [details])

  useEffect(() => {
    if (!account.isAddress(poolAddress)) return
    dispatch(fetchStatPoolData({ address: poolAddress }))
  }, [dispatch, poolAddress])

  const frozen = poolState === PoolStatus.Frozen
  const cardStyle = selected ? 'card-active lp-card' : 'lp-card'

  return (
    <Card
      className={cardStyle}
      bodyStyle={{ padding: 12, height: 78 }}
      onClick={onClick}
      bordered={selected}
      hoverable
    >
      <Row gutter={[12, 12]} wrap={false} align="middle">
        <Col span={24} flex="auto">
          <Space direction="vertical">
            <Space>
              <MintAvatar mintAddress={mintLptAddress} size={24} />
              <Typography.Text type={frozen ? 'secondary' : undefined}>
                <MintSymbol mintAddress={mintLptAddress} />
              </Typography.Text>
            </Space>
            <Space>
              <Tooltip title="The Total Value Locked is roughly estimated and perhaps inaccurate because unknown tokens ain't involved in the computation.">
                <Typography.Text type="secondary" className="caption">
                  TVL:
                </Typography.Text>
              </Tooltip>
              <Typography.Text>
                <PoolTVL poolAddress={poolAddress} />
              </Typography.Text>
              <Divider type="vertical" style={{ margin: 0 }} />
              <Typography.Text type="secondary" className="caption">
                APY:
              </Typography.Text>
              <Typography.Text>
                {numeric(apy).format('0,0.[00]%')}
              </Typography.Text>
            </Space>
          </Space>
        </Col>
        <Col>
          <Space size={2}>
            <PoolCardStatus poolAddress={poolAddress} />
            {action}
          </Space>
        </Col>
      </Row>
    </Card>
  )
}

export default PoolCard
