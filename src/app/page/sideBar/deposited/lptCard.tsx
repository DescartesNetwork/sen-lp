import { Fragment, ReactElement } from 'react'
import { utils } from '@senswap/sen-js'

import { Row, Col, Card, Space, Typography, Divider, Tooltip } from 'antd'
import PoolAvatar from '../../../components/poolAvatar'
import PoolName from '../../../components/poolName'
import PoolTVL from '../../../components/poolTVL'

import { LPTData } from 'app/model/lpts.controller'
import { PoolStatus } from 'app/constant'
import { numeric } from 'shared/util'

const LPTCard = ({
  data,
  onClick = () => {},
  action = <Fragment />,
  selected = false,
}: {
  data: LPTData
  onClick?: () => void
  action: ReactElement
  selected?: boolean
}) => {
  const { pool: poolAddress, amount } = data
  const lp = utils.undecimalize(amount, 9)
  const cardStyle = selected ? 'card-active' : ''
  const isFrozen = data.state === PoolStatus.Frozen

  return (
    <Card
      className={cardStyle}
      bodyStyle={{ padding: 12, height: 78 }}
      onClick={onClick}
      bordered={selected}
      hoverable
    >
      <Row gutter={[12, 12]} align="middle" wrap={false}>
        <Col flex="auto">
          <Space direction="vertical" size={4}>
            <Space size="middle">
              <PoolAvatar poolAddress={poolAddress} size={24} />
              <Typography.Text type={isFrozen ? 'secondary' : undefined}>
                <PoolName poolAddress={poolAddress} />
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
                My LPT:
              </Typography.Text>
              <Typography.Text>
                {numeric(lp).format('0,0.[00]')}
              </Typography.Text>
            </Space>
          </Space>
        </Col>
        <Col>{action}</Col>
      </Row>
    </Card>
  )
}

export default LPTCard
