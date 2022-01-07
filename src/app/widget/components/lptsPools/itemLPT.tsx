import { Fragment, ReactElement, useState } from 'react'
import { utils } from '@senswap/sen-js'

import {
  Row,
  Col,
  Card,
  Space,
  Typography,
  Divider,
  Tooltip,
  Collapse,
  Button,
} from 'antd'
import PoolTVL from 'app/components/poolTVL'
import IonIcon from 'shared/antd/ionicon'
import PoolCardStatus from 'app/components/poolCardStatus'
import SwapButton from 'app/components/swapButton'
import { MintAvatar, MintSymbol } from 'shared/antd/mint'

import { LPTData } from 'app/model/lpts.controller'
import { PoolStatus } from 'app/constant'
import { numeric } from 'shared/util'
import { usePool } from 'senhub/providers'

const DECIMAL = 9

const ItemLPT = ({
  data,
  onClick = () => {},
  action = <Fragment />,
  keyExpand,
}: {
  data: LPTData
  onClick?: () => void
  action: ReactElement
  keyExpand: number
}) => {
  const { pool: poolAddress, amount } = data
  const [isActive, setIsActive] = useState(false)
  const lp = utils.undecimalize(amount, DECIMAL)
  const { pools } = usePool()

  const isFrozen = pools?.[poolAddress].state === PoolStatus.Frozen
  const mintLptAddress = pools?.[poolAddress]?.mint_lpt || ''
  const expandClass = isActive ? '' : 'expandHidden'
  const defaultKey = keyExpand.toString()
  return (
    <Card
      bodyStyle={{ padding: 12, minHeight: 78 }}
      bordered={false}
      className="lp-card"
    >
      <Row gutter={[12, 12]} align="top">
        <Col flex="auto">
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
                My LP:
              </Typography.Text>
              <Typography.Text>
                {numeric(lp).format('0,0.[00]')}
              </Typography.Text>
            </Space>
          </Space>
        </Col>
        <Col>
          <Space size={2}>
            <PoolCardStatus poolAddress={poolAddress} />
            {action}
            <Button
              size="small"
              type="text"
              icon={
                <IonIcon
                  name={
                    isActive
                      ? 'chevron-down-outline'
                      : 'chevron-forward-outline'
                  }
                />
              }
              onClick={() => setIsActive(!isActive)}
            />
          </Space>
        </Col>
      </Row>
      <Collapse
        className={expandClass}
        style={{ marginTop: 16 }}
        ghost={true}
        activeKey={defaultKey}
        bordered={false}
      >
        <Collapse.Panel header="" key={defaultKey}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <SwapButton poolAddress={poolAddress} />
            </Col>
            <Col span={12}>
              <Button onClick={onClick} block type="primary">
                Detail
              </Button>
            </Col>
          </Row>
        </Collapse.Panel>
      </Collapse>
    </Card>
  )
}

export default ItemLPT
