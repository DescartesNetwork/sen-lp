import { Fragment, ReactElement, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PoolData } from '@senswap/sen-js'

import { Row, Col, Card, Space, Typography, Divider, Tooltip } from 'antd'
import PoolTVL from '../../../components/poolTVL'
import PoolCardStatus from 'app/components/PoolCardStatus'

import { numeric } from 'shared/util'
import { AppState } from 'app/model'
import { fetchStatPoolData } from 'app/model/stat.controller'
import { PoolStatus } from 'app/constant'
import { MintAvatar, MintSymbol } from 'app/shared/components/mint'
import { usePool } from 'senhub/providers'

const ItemPool = ({
  data,
  onClick = () => {},
  action = <Fragment />,
  selected = false,
}: {
  data: PoolData & { address: string }
  onClick?: () => void
  action?: ReactElement
  selected?: boolean
}) => {
  const { address: poolAddress, state: poolState } = data
  const dispatch = useDispatch()
  const { pools } = usePool()
  const details = useSelector(
    (state: AppState) => state.stat[data.address]?.details,
  )

  const mintLptAddress = pools?.[poolAddress]?.mint_lpt

  const apy = useMemo(() => {
    if (!details) return 0

    const roi = details.roi
    return Math.pow(1 + Number(roi || 0) / 100, 365) - 1
  }, [details])

  useEffect(() => {
    if (!poolAddress) return
    dispatch(fetchStatPoolData({ address: poolAddress }))
  }, [dispatch, poolAddress])

  const isFrozen = poolState === PoolStatus.Frozen
  const cardStyle = selected ? 'card-active' : ''

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
              <Typography.Text type={isFrozen ? 'secondary' : undefined}>
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

export default ItemPool
