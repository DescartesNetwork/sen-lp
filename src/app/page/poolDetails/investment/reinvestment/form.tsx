import { Col, Divider, Row, Space, Typography } from 'antd'
import NumericInput from 'shared/antd/numericInput'
import { MintSymbol } from 'app/components/mint'

import { usePool } from 'senhub/providers'

const Form = ({
  poolAddress,
  value,
  onChange,
}: {
  poolAddress: string
  value: string
  onChange: (value: string) => void
}) => {
  const { pools } = usePool()
  const poolData = pools[poolAddress]

  return (
    <Row gutter={[12, 12]}>
      <Col flex="auto">
        <Typography.Text>Your Balance</Typography.Text>
      </Col>
      <Col>
        <Space size={4} className="caption">
          <Typography.Text type="secondary">Available:</Typography.Text>
          <Typography.Text type="secondary">37.8 LP</Typography.Text>
        </Space>
      </Col>
      <Col span={24}>
        <NumericInput
          value={value}
          onValue={onChange}
          prefix={
            <Space size={4}>
              <MintSymbol mintAddress={poolData?.mint_lpt} />
              <Divider type="vertical" />
            </Space>
          }
        />
      </Col>
    </Row>
  )
}

export default Form
