import { Row, Col, Card, Typography } from 'antd'
import { MintAvatar, MintSymbol } from 'shared/antd/mint'

import { numeric } from 'shared/util'

const Info = ({
  mintAddresses,
  amounts,
}: {
  mintAddresses: string[]
  amounts: string[]
}) => {
  return (
    <Card bordered={false}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Typography.Text>You will receive</Typography.Text>
        </Col>
        {mintAddresses.map((mintAddress, i) => (
          <Col span={24} key={i}>
            <Row gutter={[8, 8]} justify="space-between" align="middle">
              <Col>
                <MintAvatar mintAddress={mintAddress} size={32} />
              </Col>
              <Col>
                <Typography.Title level={5} style={{ margin: 0 }}>
                  {numeric(amounts[i] || 0).format('0,0.[0000]')}{' '}
                  <MintSymbol mintAddress={mintAddress} />
                </Typography.Title>
              </Col>
            </Row>
          </Col>
        ))}
      </Row>
    </Card>
  )
}

export default Info
