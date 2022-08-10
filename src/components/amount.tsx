import { useCallback, useEffect, useMemo, useState } from 'react'
import { account, utils } from '@senswap/sen-js'
import { useAccount, useWalletAddress, util } from '@sentre/senhub'

import { Row, Col, Typography, Space, Button, Divider } from 'antd'
import NumericInput from 'shared/antd/numericInput'
import { MintAvatar, MintSymbol } from 'shared/antd/mint'

import useMintDecimals from 'shared/hooks/useMintDecimals'

/**
 * Single amount input
 */
const Amount = ({
  mintAddress,
  onChange,
  value,
}: {
  mintAddress: string
  onChange: (value: bigint) => void
  value: bigint
}) => {
  const [amount, setAmount] = useState('')
  const [associatedAddress, setAssociatedAddress] = useState<string>('')
  const walletAddress = useWalletAddress()
  const { accounts } = useAccount()
  const decimals = useMintDecimals(mintAddress) || 0

  const accountData = accounts?.[associatedAddress]

  const balance = useMemo(() => {
    const { amount } = accountData || {}
    if (!amount || !decimals) return '0'
    return utils.undecimalize(amount, decimals) || '0'
  }, [accountData, decimals])

  const onAmount = useCallback(
    async (val: string) => {
      await setAmount(val)
      if (!decimals || !parseFloat(val)) return onChange(BigInt(0))
      return onChange(utils.decimalize(val, decimals))
    },
    [decimals, onChange],
  )

  const setAmountFromProps = useCallback(() => {
    const newAmount = utils.undecimalize(value, decimals || 0)
    if (Number(newAmount) === Number(amount)) return
    setAmount(newAmount)
    // ignore  'amount' because this function only  call after change 'value' from props
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decimals, value])

  const fetchAssociatedAddress = useCallback(async () => {
    const { splt } = window.sentre
    try {
      const associatedAddress = await account.deriveAssociatedAddress(
        walletAddress,
        mintAddress,
        splt.spltProgramId.toBase58(),
        splt.splataProgramId.toBase58(),
      )
      setAssociatedAddress(associatedAddress)
    } catch (er) {}
  }, [mintAddress, walletAddress])

  useEffect(() => {
    fetchAssociatedAddress()
  }, [fetchAssociatedAddress])

  useEffect(() => {
    setAmountFromProps()
  }, [setAmountFromProps])

  const notEnoughBalance = Number(amount) > Number(balance)

  return (
    <Row gutter={[4, 4]}>
      <Col span={24}>
        <NumericInput
          placeholder="0"
          value={amount}
          onValue={onAmount}
          size="large"
          prefix={
            <Space style={{ marginLeft: -4, marginRight: 7, lineHeight: 1 }}>
              <MintAvatar mintAddress={mintAddress} />
              <Divider type="vertical" style={{ margin: 0 }} />
            </Space>
          }
          suffix={
            <Button
              type="text"
              style={{ marginRight: -7 }}
              size="small"
              onClick={() => onAmount(balance)}
            >
              MAX
            </Button>
          }
          max={balance}
        />
      </Col>
      <Col flex="auto">
        {notEnoughBalance && (
          <Typography.Text style={{ fontSize: 12 }} type="danger">
            Not enough balance.
          </Typography.Text>
        )}
      </Col>
      <Col>
        <Typography.Text style={{ fontSize: 12 }} type="secondary">
          Available: {util.numeric(balance).format('0,0.[0000]')}{' '}
          <MintSymbol mintAddress={mintAddress} />
        </Typography.Text>
      </Col>
    </Row>
  )
}

export default Amount
