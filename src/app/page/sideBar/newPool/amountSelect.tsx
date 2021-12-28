import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAccount, useWallet } from 'senhub/providers'
import { account, AccountData, utils } from '@senswap/sen-js'

import { Row, Col, Button, Typography, Space } from 'antd'

import NumericInput from 'shared/antd/numericInput'
import { numeric } from 'shared/util'
import useTokenProvider from 'app/hooks/useTokenProvider'
import useMintDecimals from 'app/hooks/useMintDecimals'
import SelectPools from './selectPools'

interface SuggestMintAmount {
  symbol?: string
  amount?: number
  address: string
}

const AmountSelect = ({
  mintAddresses,
  onChange,
  suggestInfo,
}: {
  mintAddresses: string[]
  onChange: ({
    amount,
    mintAddress,
  }: {
    amount: bigint
    mintAddress: string
  }) => void
  suggestInfo?: SuggestMintAmount
}) => {
  const [amount, setAmount] = useState('')
  const [activeMintAddress, setActiveMintAddress] = useState<string>('Select')
  const [associatedAddress, setAssociatedAddress] = useState('')
  const { accounts } = useAccount()
  const tokenInfo = useTokenProvider(activeMintAddress)
  const decimals = useMintDecimals(activeMintAddress)
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const accountData: AccountData = accounts?.[associatedAddress]

  const { symbol } = tokenInfo[0] || {}

  const balance = useMemo(() => {
    const { amount } = accountData || {}
    if (!amount || !decimals) return '0'
    return utils.undecimalize(amount, decimals) || '0'
  }, [accountData, decimals])

  const getAssociatedAddress = useCallback(async () => {
    const { splt } = window.sentre
    let associatedAdd = ''
    try {
      associatedAdd = await account?.deriveAssociatedAddress(
        walletAddress,
        activeMintAddress,
        splt.spltProgramId.toBase58(),
        splt.splataProgramId.toBase58(),
      )
    } catch (er) {}
    setAssociatedAddress(associatedAdd)
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
    getAssociatedAddress()
  }, [getAssociatedAddress])
  const {
    symbol: suggestSymbol,
    amount: suggestAmount,
    address: suggestAddr,
  } = suggestInfo || {}
  const isAddr = activeMintAddress === suggestAddr

  return (
    <Row gutter={[4, 4]}>
      <NumericInput
        placeholder={`Amount of ${symbol || 'TOKEN'}`}
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
            {isAddr && suggestAmount ? (
              <Space size={4}>
                <Typography.Text type="secondary" className="caption">
                  Recommend:
                </Typography.Text>
                <Typography.Text
                  type="danger"
                  style={{ fontSize: 12, cursor: 'pointer' }}
                  onClick={() => onAmount(suggestAmount?.toString() || '0')}
                >
                  {numeric(suggestAmount).format('0,0.[00000]a')}
                </Typography.Text>
                <Typography.Text type="secondary" className="caption">
                  {suggestSymbol || 'TOKEN'}
                </Typography.Text>
              </Space>
            ) : null}
          </Col>
          <Col>
            <Typography.Text type="secondary" className="caption">
              Available: {numeric(balance).format('0,0.[0000]')}{' '}
              {symbol || 'TOKEN'}
            </Typography.Text>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default AmountSelect
