import { Fragment, ReactElement, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

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
import PoolTVL from 'app/components/poolTVL'
import IonIcon from 'shared/antd/ionicon'
import PoolCardStatus from 'app/components/PoolCardStatus'
import SwapAction from '../swapAction'

import { numeric } from 'shared/util'
import { AppState } from 'app/model'
import { fetchStatPoolData } from 'app/model/stat.controller'
import { PoolStatus } from 'app/constant'
import { MintAvatar, MintSymbol } from 'app/components/mint'
import { usePool } from 'senhub/providers'

const ItemPool = ({
  poolAddress,
  onClick = () => {},
  action = <Fragment />,
  keyExpand,
}: {
  poolAddress: string
  onClick?: () => void
  action?: ReactElement
  keyExpand: number
}) => {
  const dispatch = useDispatch()
  const [isActive, setIsActive] = useState(false)
  const { pools } = usePool()
  const details = useSelector(
    (state: AppState) => state.stat[poolAddress]?.details,
  )
  const poolData = pools?.[poolAddress] || {}
  const { mint_lpt: mintLptAddress, state: poolState } = poolData

  const apy = useMemo(() => {
    if (!details || !details.roi) return 0
    const roi = details.roi
    return Math.pow(1 + Number(roi) / 100, 365) - 1
  }, [details])

  useEffect(() => {
    if (!poolAddress) return
    dispatch(fetchStatPoolData({ address: poolAddress }))
  }, [dispatch, poolAddress])

  const isFrozen = poolState === PoolStatus.Frozen
  const expandClass = isActive ? '' : 'expandHidden'
  const defaultKey = keyExpand.toString()

  return (
    <Card bodyStyle={{ padding: 12, minHeight: 78 }} hoverable>
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

export default ItemPool
