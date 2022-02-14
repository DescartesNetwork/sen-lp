import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useUI } from '@senhub/providers'

import { Card, Col, Row, Typography, Space, Button } from 'antd'
import PoolTVL from 'app/components/poolTVL'

import { AppState } from 'app/model'
import IonIcon from 'shared/antd/ionicon'
import LiquidityPosition from './liquidityPosition'

const TotalValueLocked = () => {
  const {
    main: { selectedPoolAddress },
  } = useSelector((state: AppState) => state)
  const [visible, setVisible] = useState(true)
  const {
    ui: { width },
  } = useUI()

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
              <PoolTVL poolAddress={selectedPoolAddress} />
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
            <LiquidityPosition poolAddress={selectedPoolAddress} />
          </Col>
        )}
      </Row>
    </Card>
  )
}

export default TotalValueLocked
