import {
  Fragment,
  ReactElement,
  useEffect,
  useMemo,
  CSSProperties,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { PoolData } from '@senswap/sen-js'

import { Row, Col, Card, Space, Typography, Divider, Tooltip } from 'antd'
import PoolAvatar from '../../../components/poolAvatar'
import PoolName from '../../../components/poolName'
import PoolTVL from '../../../components/poolTVL'
import PoolCardStatus from 'app/components/PoolCardStatus'

import { numeric } from 'shared/util'
import { AppState } from 'app/model'
import { fetchStatPoolData } from 'app/model/stat.controller'
import { PoolStatus } from 'app/constant'

const CARD_ACTIVE_STYLE: CSSProperties = {
  borderColor: 'rgba(249,87,94,0.5)',
  boxShadow:
    '0 1px 2px -2px rgb(0 0 0 / 64%), 0 3px 6px 0 rgb(0 0 0 / 48%), 0 5px 12px 4px rgb(0 0 0 / 36%)',
}

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
  const details = useSelector(
    (state: AppState) => state.stat[data.address]?.details,
  )

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
  const cardStyle = selected ? CARD_ACTIVE_STYLE : {}

  return (
    <Card
      bodyStyle={{ padding: 12 }}
      onClick={onClick}
      bordered={selected}
      hoverable
      style={{ cursor: 'pointer', ...cardStyle }}
    >
      <Row gutter={[12, 12]} wrap={false} align="middle">
        <Col span={24} flex="auto">
          <Space direction="vertical" size={4}>
            <Space style={{ whiteSpace: 'nowrap' }}>
              <PoolAvatar poolAddress={poolAddress} size={24} />
              <Typography.Text type={isFrozen ? 'secondary' : undefined}>
                <PoolName poolAddress={poolAddress} />
              </Typography.Text>
              <PoolCardStatus poolAddress={poolAddress} />
            </Space>
            <Space>
              <Tooltip title="The Total Value Locked is roughly estimated and perhaps inaccurate because unknown tokens ain't involved in the computation.">
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  TVL:
                </Typography.Text>
              </Tooltip>
              <Typography.Text>
                <PoolTVL poolAddress={poolAddress} />
              </Typography.Text>
              <Divider type="vertical" style={{ margin: 0 }} />
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                APY:
              </Typography.Text>
              <Typography.Text>
                {numeric(apy).format('0,0.[00]%')}
              </Typography.Text>
            </Space>
          </Space>
        </Col>
        <Col>{action}</Col>
      </Row>
    </Card>
  )
}

export default ItemPool
