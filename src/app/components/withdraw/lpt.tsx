import { Row, Col, Card, Typography, Space, Button, Divider } from 'antd'
import NumericInput from 'shared/antd/numericInput'
import { MintAvatar, MintName } from 'app/shared/components/mint'
import { numeric } from 'shared/util'

/**
 * Single amount input
 */
const LPT = ({
  lptAddress,
  onChange,
}: {
  lptAddress: string
  onChange: (value: bigint) => void
}) => {
  return (
    <Row gutter={[4, 4]} justify="end">
      <Col span={24}>
        <Card bodyStyle={{ padding: 8 }} bordered={false}>
          <NumericInput
            placeholder="Amount of LPT"
            value={0}
            onChange={() => {}}
            size="small"
            bordered={false}
            prefix={
              <Space
                style={{
                  marginLeft: -7,
                  marginRight: 7,
                  fontSize: 12,
                  lineHeight: 1,
                }}
              >
                <MintAvatar mintAddress={''} size={24} />
                <Typography.Text>
                  <MintName mintAddress={''} />
                </Typography.Text>
                <Divider type="vertical" style={{ margin: 0 }} />
              </Space>
            }
            suffix={
              <Button
                type="text"
                style={{ marginRight: -7 }}
                size="small"
                onClick={() => {}}
              >
                MAX
              </Button>
            }
            max={0}
          />
        </Card>
      </Col>
      <Col>
        <Typography.Text style={{ fontSize: 12 }} type="secondary">
          Available: {numeric(0).format('0,0.[0000]')} LPT
        </Typography.Text>
      </Col>
    </Row>
  )
}

export default LPT
