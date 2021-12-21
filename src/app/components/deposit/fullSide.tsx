import { useCallback, useEffect, useState } from 'react'
import { account, Swap, utils } from '@senswap/sen-js'

import { Row, Col, Button, Radio, Tooltip, Space, Tag } from 'antd'
import { useMint, usePool, useWallet } from 'senhub/providers'
import Amount from '../amount'
import LPT from './lpt'
import { explorer } from 'shared/util'
import { MintSymbol } from 'app/shared/components/mint'
/**
 * Main
 */
const FullSide = ({
  poolAddress,
  onClose = () => {},
}: {
  poolAddress: string
  onClose?: () => void
}) => {
  const [loading, setLoading] = useState(false)
  const [lpt, setLPT] = useState('')
  const [selectMint, setSelectMint] = useState('all')
  const [amounts, setAmounts] = useState<bigint[]>([BigInt(0), BigInt(0)])
  const { pools } = usePool()
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const { getMint } = useMint()

  const {
    mint_a,
    mint_b,
    reserve_a,
    reserve_b,
    mint_lpt,
    fee_ratio,
    tax_ratio,
  } = pools[poolAddress]
  const mintAddresses = [mint_a, mint_b]

  const onAmounts = (i: number, amount: bigint) => {
    let newAmounts = [...amounts]
    newAmounts[i] = amount
    setAmounts(newAmounts)
  }
  const estimateLPT = useCallback(async () => {
    if (!account.isAddress(walletAddress)) return setLPT('')
    try {
      const {
        [mint_lpt]: { supply },
      } = await getMint({ address: mint_lpt })
      const { lpt } = Swap.oracle.sided_deposit(
        amounts[0],
        amounts[1],
        reserve_a,
        reserve_b,
        supply,
        fee_ratio,
        tax_ratio,
      )
      return setLPT(utils.undecimalize(lpt, 9))
    } catch (er: any) {
      window.notify({ type: 'error', description: er.message })
    }
  }, [
    amounts,
    fee_ratio,
    getMint,
    mint_lpt,
    reserve_a,
    reserve_b,
    tax_ratio,
    walletAddress,
  ])

  const onDeposit = async () => {
    setLoading(true)
    const { splt, swap, wallet } = window.sentre
    const [srcAAddress, srcBAddress] = await Promise.all(
      mintAddresses.map((mintAddress) =>
        splt.deriveAssociatedAddress(walletAddress, mintAddress),
      ),
    )
    if (!wallet) return
    try {
      const { txId } = await swap.addSidedLiquidity(
        amounts[0],
        amounts[1],
        poolAddress,
        srcAAddress,
        srcBAddress,
        wallet,
      )
      onClose()
      return window.notify({
        type: 'success',
        description: 'Deposit liquidity successfully. Click to view details.',
        onClick: () => window.open(explorer(txId), '_blank'),
      })
    } catch (er: any) {
      return window.notify({ type: 'error', description: er.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    estimateLPT()
  }, [estimateLPT])

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Radio.Group
          onChange={(e) => setSelectMint(e.target.value)}
          value={selectMint}
        >
          <Radio value={'all'}>
            <Space size={4}>
              Add <MintSymbol mintAddress={mint_lpt} separator="+" />
              <Tag className="deposit-tag">0 Fee</Tag>
            </Space>
          </Radio>

          {mintAddresses.map((mintAddress, idx) => (
            <Radio value={mintAddress} key={mintAddress + idx}>
              Add <MintSymbol mintAddress={mintAddress} />
            </Radio>
          ))}
        </Radio.Group>
      </Col>
      {mintAddresses.map(
        (mintAddress, i) =>
          (mintAddress === selectMint || selectMint === 'all') && (
            <Col key={mintAddress + i} span={24}>
              <Amount
                mintAddress={mintAddress}
                value={amounts[i]}
                onChange={(amount) => onAmounts(i, amount)}
              />
            </Col>
          ),
      )}
      <Col span={24}>
        <LPT value={lpt} poolAddress={poolAddress} />
      </Col>
      <Col span={24}>
        <Button
          type="primary"
          onClick={onDeposit}
          disabled={!Number(lpt)}
          block
          loading={loading}
        >
          Deposit
        </Button>
      </Col>
    </Row>
  )
}

export default FullSide
