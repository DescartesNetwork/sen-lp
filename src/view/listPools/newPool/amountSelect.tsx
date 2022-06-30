import { useCallback, useEffect, useState } from 'react'
import { account, utils } from '@senswap/sen-js'
import { useAccount, useWallet, util } from '@sentre/senhub'

import { Row, Col, Button, Typography, Space } from 'antd'
import NumericInput from 'shared/antd/numericInput'
import SelectPools from './selectPools'
import { MintSymbol } from 'shared/antd/mint'

import useMintDecimals from 'shared/hooks/useMintDecimals'

export type AmountSelectOnChnage = {
  amount: bigint
  mintAddress: string
}

const AmountSelect = ({
  mintAddresses,
  onChange,
  suggestion,
}: {
  mintAddresses: string[]
  onChange: ({ amount, mintAddress }: AmountSelectOnChnage) => void
  suggestion?: number
}) => {
  const [amount, setAmount] = useState('')
  const [activeMintAddress, setActiveMintAddress] = useState<string>('Select')
  const [accountAddress, setAccountAddress] = useState('')
  const { accounts } = useAccount()
  const decimals = useMintDecimals(activeMintAddress) || 0
  const {
    wallet: { address: walletAddress },
  } = useWallet()

  const { amount: a } = accounts[accountAddress] || { amount: '0' }
  const balance = utils.undecimalize(a, decimals) || '0'

  const getAccountAddress = useCallback(async () => {
    const { splt } = window.sentre
    if (!account.isAddress(activeMintAddress)) return
    const address = await splt.deriveAssociatedAddress(
      walletAddress,
      activeMintAddress,
    )
    return setAccountAddress(address)
  }, [activeMintAddress, walletAddress])

  const onAmount = useCallback(
    async (val: string) => {
      await setAmount(val)
      if (!account.isAddress(activeMintAddress)) return
      if (!decimals)
        return onChange({ amount: BigInt(0), mintAddress: activeMintAddress })
      return onChange({
        amount: utils.decimalize(val, decimals),
        mintAddress: activeMintAddress,
      })
    },
    [onChange, decimals, activeMintAddress],
  )

  const onSelect = useCallback(
    async (mintAddress) => {
      await setActiveMintAddress(mintAddress)
      // Return amount
      if (!decimals || !parseFloat(amount))
        return onChange({ amount: BigInt(0), mintAddress })
      return onChange({
        amount: utils.decimalize(amount, decimals),
        mintAddress,
      })
    },
    [onChange, decimals, amount],
  )

  useEffect(() => {
    getAccountAddress()
  }, [getAccountAddress])

  return (
    <Row gutter={[4, 4]}>
      <NumericInput
        placeholder="0"
        value={amount}
        onValue={onAmount}
        prefix={
          <SelectPools
            mintAddresses={mintAddresses}
            activeMintAddress={activeMintAddress}
            onSelect={onSelect}
          />
        }
        size="large"
        suffix={
          <Button
            type="text"
            style={{ marginRight: -7 }}
            onClick={() => onAmount(balance)}
          >
            MAX
          </Button>
        }
        max={balance}
      />
      <Col span={24}>
        <Row gutter={[4, 4]}>
          <Col span={24} flex="auto">
            {suggestion ? (
              <Space size={4}>
                <Typography.Text type="secondary" className="caption">
                  Recommend:
                </Typography.Text>
                <Typography.Text
                  type="danger"
                  className="caption"
                  onClick={() => onAmount((suggestion || 0).toString())}
                >
                  {util.numeric(suggestion).format('0,0.[0000]a')}
                </Typography.Text>
                <Typography.Text type="secondary" className="caption">
                  <MintSymbol mintAddress={activeMintAddress} />
                </Typography.Text>
              </Space>
            ) : null}
          </Col>
          <Col>
            <Typography.Text type="secondary" className="caption">
              Available: {util.numeric(balance).format('0,0.[0000]')}{' '}
              <MintSymbol mintAddress={activeMintAddress} />
            </Typography.Text>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default AmountSelect
