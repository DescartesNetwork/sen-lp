import { useCallback, useEffect, useMemo, useState } from 'react'
import { account, Swap, utils } from '@senswap/sen-js'
import { useAccount, useMint, usePool, useWallet } from '@senhub/providers'

import { Row, Col, Button, Radio, Space, Tag, RadioChangeEvent } from 'antd'
import Summary from './summary'
import Amount from 'app/components/amount'
import { MintSymbol } from 'shared/antd/mint'

import { explorer } from 'shared/util'
import useMintDecimals from 'shared/hooks/useMintDecimals'

const FullSide = ({
  poolAddress,
  onClose = () => {},
  onChange = () => {},
}: {
  poolAddress: string
  onClose?: () => void
  onChange?: (mint: string) => void
}) => {
  const [loading, setLoading] = useState(false)
  const [lpt, setLPT] = useState('')
  const [amounts, setAmounts] = useState<bigint[]>([BigInt(0), BigInt(0)])
  const [selectMint, setSelectMint] = useState<string>('all')
  const [disabled, setDisabled] = useState(true)
  const { pools } = usePool()
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const { getMint } = useMint()
  const { accounts } = useAccount()
  const {
    mint_a,
    mint_b,
    reserve_a,
    reserve_b,
    mint_lpt,
    fee_ratio,
    tax_ratio,
  } = pools[poolAddress] || {}
  const mintAddresses = [mint_a, mint_b]
  const decimalA = useMintDecimals(mint_a) || 0
  const decimalB = useMintDecimals(mint_b) || 0
  const decimals = useMemo(() => {
    return [decimalA, decimalB]
  }, [decimalA, decimalB])
  const ratio = useMemo(() => {
    return (
      Number(utils.undecimalize(reserve_a, decimalA)) /
      Number(utils.undecimalize(reserve_b, decimalB))
    )
  }, [decimalA, decimalB, reserve_a, reserve_b])

  const getSuggestMintAmount = useCallback(
    (amount: bigint, index: number) => {
      if (!decimals) return BigInt(0)
      const suggestDecimal = index === 0 ? decimals[1] : decimals[0]
      const parseAmount = Number(utils.undecimalize(amount, decimals[index]))
      let suggestAmount = parseAmount * ratio
      if (index === 0) suggestAmount = parseAmount / ratio
      return utils.decimalize(suggestAmount, suggestDecimal)
    },
    [decimals, ratio],
  )

  const onAmounts = (mintAddress: string, amount: bigint) => {
    if (!account.isAddress(mintAddress) || !amount)
      return setAmounts([BigInt(0), BigInt(0)])
    const index = mintAddresses.findIndex((mint) => mint === mintAddress)
    if (index === -1) return
    let newAmounts = [...amounts]
    if (selectMint === 'all')
      newAmounts[0] = newAmounts[1] = getSuggestMintAmount(amount, index)
    newAmounts[index] = amount
    setAmounts(newAmounts)
  }

  const estimateLPT = useCallback(async () => {
    if (!account.isAddress(walletAddress) || !account.isAddress(mint_lpt))
      return setLPT('')
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

  useEffect(() => {
    setAmounts([BigInt(0), BigInt(0)])
  }, [selectMint])

  const validateInput = useCallback(async () => {
    const { splt } = window.sentre
    if (!mint_a || !mint_b) return false
    // get wallet account mint A
    const accAddrMintA = await splt.deriveAssociatedAddress(
      walletAddress,
      mint_a,
    )
    const accMintA = accounts[accAddrMintA]
    // get wallet account mint B
    const accAddrMintB = await splt.deriveAssociatedAddress(
      walletAddress,
      mint_b,
    )
    const accMintB = accounts[accAddrMintB]
    const amountMintA = accMintA?.amount || 0
    const amountMintB = accMintB?.amount || 0
    const disabled = amounts[0] > amountMintA || amounts[1] > amountMintB
    setDisabled(disabled)
  }, [accounts, amounts, mint_a, mint_b, walletAddress])

  useEffect(() => {
    validateInput()
  }, [validateInput])

  const onSelectMint = (event: RadioChangeEvent) => {
    setSelectMint(event.target.value)
    onChange(event.target.value)
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Radio.Group
          onChange={(e) => {
            onSelectMint(e)
          }}
          value={selectMint}
        >
          <Radio value={'all'}>
            <Space size={4}>
              <MintSymbol mintAddress={mint_lpt} separator="+" />
              <Tag className="deposit-tag">0 Fee</Tag>
            </Space>
          </Radio>

          {mintAddresses?.map((mintAddress, idx) => (
            <Radio value={mintAddress} key={`${mintAddress}${idx}`}>
              <MintSymbol mintAddress={mintAddress} />
            </Radio>
          ))}
        </Radio.Group>
      </Col>
      {mintAddresses?.map(
        (mintAddress, i) =>
          (mintAddress === selectMint || selectMint === 'all') && (
            <Col key={`${mintAddress}_${i}`} span={24}>
              <Amount
                mintAddress={mintAddress}
                value={amounts[i]}
                onChange={(amount) => onAmounts(mintAddress, amount)}
              />
            </Col>
          ),
      )}
      <Col span={24}>
        <Summary value={lpt} poolAddress={poolAddress} />
      </Col>
      <Col span={24}>
        <Button
          type="primary"
          onClick={onDeposit}
          disabled={!Number(lpt) || disabled}
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
