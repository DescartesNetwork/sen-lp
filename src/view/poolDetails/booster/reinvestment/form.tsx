import { useSelector } from 'react-redux'
import { utils } from '@senswap/sen-js'
import { usePool, util } from '@sentre/senhub'

import { Col, Divider, Row, Space, Typography, Button } from 'antd'
import NumericInput from 'shared/antd/numericInput'
import { MintSymbol } from 'shared/antd/mint'

import { AppState } from 'model'

const Form = ({
  poolAddress,
  value,
  onChange,
}: {
  poolAddress: string
  value: string
  onChange: (value: string) => void
}) => {
  const lpts = useSelector((state: AppState) => state.lpts)
  const { pools } = usePool()

  const lptAddress =
    Object.keys(lpts).find((key) => lpts[key].pool === poolAddress) || ''
  const { amount } = lpts[lptAddress] || {}
  const lpt = Number(utils.undecimalize(amount || BigInt(0), 9))

  const poolData = pools[poolAddress]

  return (
    <Row gutter={[12, 12]}>
      <Col flex="auto">
        <Typography.Text>I want to pay</Typography.Text>
      </Col>
      <Col>
        <Space size={4} className="caption">
          <Typography.Text type="secondary">Available:</Typography.Text>
          <Typography.Text type="secondary">
            {util.numeric(lpt).format('0,0.[0000]')} LP
          </Typography.Text>
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
          suffix={
            <Button
              type="text"
              style={{ marginRight: -7 }}
              size="small"
              onClick={() => onChange(lpt.toString())}
            >
              MAX
            </Button>
          }
        />
      </Col>
    </Row>
  )
}

export default Form
