import { Fragment, ReactElement } from 'react'
import { utils } from '@senswap/sen-js'

import { Row, Col, Card, Space, Typography, Divider, Tooltip } from 'antd'
import PoolTVL from '../../../components/poolTVL'

import { LPTData } from 'app/model/lpts.controller'
import { PoolStatus } from 'app/constant'
import { numeric } from 'shared/util'
import { MintAvatar, MintName } from 'app/shared/components/mint'
import { usePool } from 'senhub/providers'

const DECIMAL = 9

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
  const lp = utils.undecimalize(amount, DECIMAL)
  const cardStyle = selected ? 'card-active' : ''
  const isFrozen = data.state === PoolStatus.Frozen
  const { pools } = usePool()

  const mintLptAddress = pools?.[poolAddress]?.mint_lpt || ''

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
              <MintAvatar mintAddress={mintLptAddress} size={24} />
              <Typography.Text type={isFrozen ? 'secondary' : undefined}>
                <MintName mintAddress={mintLptAddress} />
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