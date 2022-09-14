import { Fragment, ReactElement, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'
import { util } from '@sentre/senhub'

import { Row, Col, Card, Space, Typography, Divider, Tooltip } from 'antd'
import PoolTVL from 'components/poolTVL'
import PoolCardStatus from 'components/poolCardStatus'
import { MintAvatar, MintSymbol } from 'shared/antd/mint'

import { AppState } from 'model'
import { fetchStatPoolData } from 'model/stat.controller'
import { PoolStatus } from 'constant'
import { useMyLp } from 'hooks/useMyLp'
import { usePool } from 'hooks/pools/usePool'

const PoolCard = ({
  poolAddress,
  onClick = () => {},
  action = <Fragment />,
  selected = false,
  apy,
  myLp,
}: {
  poolAddress: string
  onClick?: (poolAddress: string) => void
  action?: ReactElement
  selected?: boolean
  apy?: boolean
  myLp?: boolean
}) => {
  const dispatch = useDispatch()
  const details = useSelector(
    (state: AppState) => state.stat[poolAddress]?.details,
  )
  const {
    pools: { [poolAddress]: poolData },
  } = usePool()
  const myLpValue = useMyLp(poolAddress)

  const apyValue = useMemo(() => {
    if (!details) return 0
    const roi = details.roi || 0
    return Math.pow(1 + roi / 100, 365) - 1
  }, [details])

  useEffect(() => {
    if (!account.isAddress(poolAddress)) return
    dispatch(fetchStatPoolData({ address: poolAddress }))
  }, [dispatch, poolAddress])

  const frozen = poolData?.state === PoolStatus.Frozen
  const cardStyle = selected ? 'card-active lp-card' : 'lp-card'

  return (
    <Card
      className={cardStyle}
      bodyStyle={{ padding: 12, height: 78 }}
      onClick={() => onClick(poolAddress)}
      bordered={selected}
      hoverable
    >
      <Row gutter={[12, 12]} wrap={false} align="middle">
        <Col span={24} flex="auto">
          <Space direction="vertical">
            <Space>
              <MintAvatar mintAddress={poolData?.mint_lpt} size={24} />
              <Typography.Text type={frozen ? 'secondary' : undefined}>
                <MintSymbol mintAddress={poolData?.mint_lpt} />
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
              {/* Apy */}
              {apy && (
                <Fragment>
                  <Divider type="vertical" style={{ margin: 0 }} />
                  <Typography.Text type="secondary" className="caption">
                    APY:
                  </Typography.Text>
                  <Typography.Text>
                    {util.numeric(apyValue).format('0,0.[00]%')}
                  </Typography.Text>
                </Fragment>
              )}
              {/* MyLp */}
              {myLp && (
                <Fragment>
                  <Divider type="vertical" style={{ margin: 0 }} />
                  <Typography.Text type="secondary" className="caption">
                    My LP:
                  </Typography.Text>
                  <Typography.Text>
                    {util.numeric(myLpValue.balance).format('0,0.[00]')}
                  </Typography.Text>
                </Fragment>
              )}
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
