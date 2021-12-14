import { Fragment, ReactElement, CSSProperties } from 'react'
import { utils } from '@senswap/sen-js'

import { Row, Col, Card, Space, Typography, Divider, Tooltip } from 'antd'
import PoolAvatar from '../../../components/poolAvatar'
import PoolName from '../../../components/poolName'
import PoolCardStatus from 'app/components/PoolCardStatus'
import PoolTVL from '../../../components/poolTVL'

import { LPTData } from 'app/model/lpts.controller'
import { PoolStatus } from 'app/constant'
import { numeric } from 'shared/util'

const CARD_ACTIVE_STYLE: CSSProperties = {
  borderColor: 'rgba(249,87,94,0.5)',
  boxShadow:
    '0 1px 2px -2px rgb(0 0 0 / 64%), 0 3px 6px 0 rgb(0 0 0 / 48%), 0 5px 12px 4px rgb(0 0 0 / 36%)',
}

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
  const cardStyle = selected ? CARD_ACTIVE_STYLE : {}
  const isFrozen = data.state === PoolStatus.Frozen

  return (
    <Card
      bodyStyle={{ padding: 12 }}
      onClick={onClick}
      bordered={selected}
      hoverable
      style={{ cursor: 'pointer', ...cardStyle }}
    >
      <Row gutter={[12, 12]} align="middle" wrap={false}>
        <Col flex="auto">
          <Space direction="vertical" size={4}>
            <Space style={{ whiteSpace: 'nowrap' }} size="middle">
              <PoolAvatar poolAddress={poolAddress} size={24} />
              <Typography.Text type={isFrozen ? 'secondary' : undefined}>
                <PoolName poolAddress={poolAddress} />
              </Typography.Text>
              <PoolCardStatus poolAddress={poolAddress} />
            </Space>
            <Space style={{ whiteSpace: 'nowrap' }}>
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
