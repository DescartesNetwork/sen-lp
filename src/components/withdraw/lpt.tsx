import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { utils } from '@senswap/sen-js'
import { util } from '@sentre/senhub'

import { Row, Col, Typography, Space, Button, Divider } from 'antd'
import NumericInput from 'shared/antd/numericInput'
import { MintAvatar, MintName } from 'shared/antd/mint'

import { AppState } from 'model'
import { usePool } from 'hooks/pools/usePool'

/**
 * Single amount input
 */
const LPT = ({
  lpt,
  lptAddress,
  onChange,
  poolAddress,
}: {
  lpt: bigint
  lptAddress: string
  poolAddress: string
  onChange: (value: bigint) => void
}) => {
  const { lpts } = useSelector((state: AppState) => state)
  const { pools } = usePool()
  const { amount } = lpts?.[lptAddress] || {}
  const { mint_lpt } = pools?.[poolAddress] || {}

  const balance = useMemo(() => {
    if (!amount) return '0'
    return utils.undecimalize(amount, 9) || '0'
  }, [amount])

  const onLPT = useCallback(
    async (val: string) => {
      // Return amount
      if (!parseFloat(val)) return onChange(BigInt(0))
      return onChange(utils.decimalize(val, 9))
    },
    [onChange],
  )

  const lptAmount = useMemo(() => utils.undecimalize(lpt, 9), [lpt])

  return (
    <Row gutter={[4, 4]} justify="end">
      <Col span={24}>
        <NumericInput
          placeholder="Amount of LP"
          value={lptAmount}
          onValue={onLPT}
          size="large"
          prefix={
            <Space
              style={{
                marginLeft: -7,
                marginRight: 7,
                fontSize: 12,
                lineHeight: 1,
              }}
            >
              <MintAvatar mintAddress={mint_lpt} size={24} />
              <Typography.Text>
                <MintName mintAddress={mint_lpt} />
              </Typography.Text>
              <Divider type="vertical" style={{ margin: 0 }} />
            </Space>
          }
          suffix={
            <Button
              type="text"
              style={{ marginRight: -7 }}
              size="small"
              onClick={() => onLPT(balance)}
            >
              MAX
            </Button>
          }
          max={balance}
        />
      </Col>
      <Col>
        <Typography.Text style={{ fontSize: 12 }} type="secondary">
          Available: {util.numeric(balance).format('0,0.[0000]')} LPT
        </Typography.Text>
      </Col>
    </Row>
  )
}

export default LPT
