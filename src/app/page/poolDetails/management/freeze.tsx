import { useMemo, useState } from 'react'

import { Button, Row, Col, Typography, Card, Badge, Space } from 'antd'
import { usePool } from 'senhub/providers'
import { explorer } from 'shared/util'
import IonIcon from 'shared/antd/ionicon'

enum PoolStatus {
  Frozen = 2,
  Active = 1,
}

const CardDescription = ({
  poolStatus,
  description,
}: {
  poolStatus: PoolStatus
  description: string
}) => {
  const status = poolStatus === PoolStatus.Active
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Space size={0}>
          <Badge status={status ? 'success' : 'error'} />
          <Typography.Text>
            Current status: {status ? 'Active' : 'Frozen'}
          </Typography.Text>
        </Space>
      </Col>
      <Col span={24}>
        <Card bordered={false} bodyStyle={{ padding: 16 }} className="lp-card">
          <Space size={4} align="start">
            <IonIcon name="information-circle-outline" />
            <Space direction="vertical" size={0}>
              <Typography.Text>{description}</Typography.Text>
            </Space>
          </Space>
        </Card>
      </Col>
    </Row>
  )
}

const Freeze = ({ address }: { address: string }) => {
  const { pools } = usePool()
  const [loading, setLoading] = useState(false)
  const poolData = pools[address]

  const onFreezePool = async () => {
    setLoading(true)
    const { swap, wallet } = window.sentre
    if (!wallet) return
    const { txId } = await swap.freezePool(address, wallet)
    setLoading(false)
    if (!txId)
      return window.notify({
        type: 'error',
        description: 'Freeze the pool make failure.',
      })
    return window.notify({
      type: 'success',
      description: 'Freeze the pool successfully. Click to view details',
      onClick: () => window.open(explorer(txId), '_blank'),
    })
  }

  const onThawPool = async () => {
    setLoading(true)
    const { swap, wallet } = window.sentre
    if (!wallet) return
    const { txId } = await swap.thawPool(address, wallet)
    setLoading(false)
    if (!txId)
      return window.notify({
        type: 'error',
        description: 'Thaw the pool make failure.',
      })
    return window.notify({
      type: 'success',
      description: 'Thaw the pool successfully. Click to view details',
      onClick: () => window.open(explorer(txId), '_blank'),
    })
  }

  const description = useMemo(() => {
    const state = poolData?.state
    if (state === PoolStatus.Active)
      return (
        <CardDescription
          poolStatus={state}
          description="Freezing a pool will prevent all actions until the pool has been thawed."
        />
      )

    if (state === PoolStatus.Frozen)
      return (
        <CardDescription
          poolStatus={state}
          description="Thaw a pool will active all actions"
        />
      )
    return 'Pool is closed'
  }, [poolData?.state])

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>{description}</Col>
      <Col span={24}>
        {poolData?.state === PoolStatus.Active ? (
          <Button
            style={{ background: '#40A9FF', color: '#fff' }}
            onClick={onFreezePool}
            icon={<IonIcon name="snow-outline" />}
            block
            loading={loading}
          >
            Freeze Pool
          </Button>
        ) : (
          <Button
            type="primary"
            onClick={onThawPool}
            icon={<IonIcon name="sunny-outline" />}
            block
            loading={loading}
          >
            Thaw Pool
          </Button>
        )}
      </Col>
    </Row>
  )
}
export default Freeze
