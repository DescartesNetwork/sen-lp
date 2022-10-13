import { useMemo, useState } from 'react'
import { utils } from '@senswap/sen-js'
import { util } from '@sentre/senhub'

import { Button, Row, Col } from 'antd'
import IonIcon from '@sentre/antd-ionicon'
import FeeInput from './FeeInput'

import { usePool } from 'hooks/pools/usePool'
import configs from 'configs'

// Fee decimal = 9
// however feeUI = Fee * 100 (%)
// -> FEE_DECIMALS_PERCENT = 9 - 2 = 7
const FEE_DECIMALS_PERCENT = 7

const {
  sol: { swap },
} = configs

const Fee = ({ address: poolAddress }: { address: string }) => {
  const { pools } = usePool()
  const [feeRatio, setFeeRatio] = useState<string>('')
  const [taxRatio, setTaxRatio] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const poolData = pools?.[poolAddress] || {}
  const { fee_ratio, tax_ratio } = poolData

  const onUpdateFee = async () => {
    setLoading(true)
    const feeAmount = utils.decimalize(
      feeRatio || currentFee,
      FEE_DECIMALS_PERCENT,
    )
    const taxAmount = utils.decimalize(
      taxRatio || currentTax,
      FEE_DECIMALS_PERCENT,
    )
    // PRECISION
    const { solana } = window.sentre
    if (!solana) return
    const { txId } = await swap.updateFee(
      feeAmount,
      taxAmount,
      poolAddress,
      solana,
    )
    setLoading(false)
    if (!txId)
      return window.notify({
        type: 'error',
        description: 'Update fee make failure.',
      })
    setFeeRatio('')
    setTaxRatio('')
    return window.notify({
      type: 'success',
      description: 'Update fee successfully. Click to view details',
      onClick: () => window.open(util.explorer(txId), '_blank'),
    })
  }

  const currentFee = useMemo(() => {
    if (!fee_ratio) return '0'
    return utils.undecimalize(fee_ratio, FEE_DECIMALS_PERCENT)
  }, [fee_ratio])

  const currentTax = useMemo(() => {
    if (!tax_ratio) return '0'
    return utils.undecimalize(tax_ratio, FEE_DECIMALS_PERCENT)
  }, [tax_ratio])

  return (
    <Row gutter={[16, 24]}>
      <Col span={24}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <FeeInput
              title="Fee (%)"
              label="Current fee"
              ratio={feeRatio}
              currentRatio={currentFee}
              onChange={setFeeRatio}
            />
          </Col>
          <Col span={24}>
            <FeeInput
              title="Tax (%)"
              label="Current tax"
              ratio={taxRatio}
              currentRatio={currentTax}
              onChange={setTaxRatio}
            />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Button
          onClick={onUpdateFee}
          icon={<IonIcon name="cash-outline" />}
          block
          loading={loading}
          disabled={!taxRatio && !feeRatio}
        >
          Update Fee
        </Button>
      </Col>
    </Row>
  )
}
export default Fee
