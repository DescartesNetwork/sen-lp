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
  Popover,
} from 'antd'
import PoolTVL from '../../../components/poolTVL'
import IonIcon from 'shared/antd/ionicon'
import PoolCardStatus from 'app/components/PoolCardStatus'
import SwapAction from 'app/widget/components/swapAction'

import { LPTData } from 'app/model/lpts.controller'
import { PoolStatus } from 'app/constant'
import { numeric } from 'shared/util'
import { MintAvatar, MintName } from 'app/shared/components/mint'
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
    <Card bodyStyle={{ padding: 12, minHeight: 78 }} hoverable>
      <Row gutter={[12, 12]} align="top">
        <Col flex="auto">
          <Space direction="vertical">
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
              <Popover
                trigger="click"
                placement="bottomLeft"
                content={
                  <SwapAction isDisabled={isFrozen} poolAddress={poolAddress} />
                }
              >
                <Button block>Swap</Button>
              </Popover>
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
