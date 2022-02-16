import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useUI } from '@senhub/providers'

import { Card, Col, Row, Typography, Space, Button } from 'antd'
import PoolTVL from 'app/components/poolTVL'

import { AppState } from 'app/model'
import IonIcon from 'shared/antd/ionicon'
import LiquidityPosition from './liquidityPosition'
import { QueryParams } from 'app/constant'

const TotalValueLocked = () => {
  const {
    main: { selectedPoolAddress },
  } = useSelector((state: AppState) => state)
  const [visible, setVisible] = useState(true)
  const {
    ui: { width },
  } = useUI()
  const location = useLocation()
  const query = useMemo(() => new URLSearchParams(location.search), [location])
  const queryPoolAddress = query.get(QueryParams.address) || ''

  const poolAddress = queryPoolAddress || selectedPoolAddress
  const iconName = visible ? 'chevron-down-outline' : 'chevron-forward-outline'
  const isMobile = width < 768

  useEffect(() => {
    if (!isMobile) return setVisible(true)
    return setVisible(false)
  }, [isMobile])

  return (
    <Card bordered={false} style={{ height: '100%' }}>
      <Row gutter={[24, 24]} align="middle">
        <Col flex="auto">
          <Typography.Title level={4}>Total Value Locked</Typography.Title>
        </Col>
        <Col>
          <Space size={0}>
            <Typography.Title level={2}>
              <PoolTVL poolAddress={poolAddress} />
            </Typography.Title>
            {isMobile && (
              <Button
                type="text"
                shape="circle"
                icon={<IonIcon name={iconName} />}
                onClick={() => setVisible(!visible)}
              />
            )}
          </Space>
        </Col>
        {visible && (
          <Col span={24}>
            <LiquidityPosition poolAddress={poolAddress} />
          </Col>
        )}
      </Row>
    </Card>
  )
}

export default TotalValueLocked
