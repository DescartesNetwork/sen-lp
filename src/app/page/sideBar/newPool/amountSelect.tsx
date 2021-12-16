import { useCallback, useEffect, useMemo, useState } from 'react'
import { useMint, useWallet } from 'senhub/providers'
import { TokenInfo } from '@solana/spl-token-registry'
import { account, AccountData, MintData, utils } from '@senswap/sen-js'

import { Row, Col, Select, Button, Typography, Divider, Space } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { MintAvatar, MintSymbol } from 'app/shared/components/mint'
import NumericInput from 'shared/antd/numericInput'
import { numeric } from 'shared/util'

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
  const [accountData, setAccountData] = useState<AccountData>()
  const [mintData, setMintData] = useState<MintData>()
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>()
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const { tokenProvider } = useMint()

  const { symbol } = tokenInfo || {}
  const { decimals } = mintData || {}

  const balance = useMemo(() => {
    const { amount } = accountData || {}
    if (!amount || !decimals) return '0'
    return utils.undecimalize(amount, decimals) || '0'
  }, [accountData, decimals])

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

  const fetchData = useCallback(async () => {
    const { splt } = window.sentre
    if (!account.isAddress(activeMintAddress)) {
      setAccountData(undefined)
      setMintData(undefined)
      setTokenInfo(undefined)
    } else {
      try {
        const associatedAddress = await account.deriveAssociatedAddress(
          walletAddress,
          activeMintAddress,
          splt.spltProgramId.toBase58(),
          splt.splataProgramId.toBase58(),
        )
        const accountData = await splt.getAccountData(associatedAddress)
        setAccountData(accountData)
      } catch (er) {}
      try {
        const mintData = await splt.getMintData(activeMintAddress)
        setMintData(mintData)
      } catch (er) {}
      try {
        const tokenInfo = await tokenProvider.findByAddress(activeMintAddress)
        setTokenInfo(tokenInfo)
      } catch (er) {}
    }
  }, [activeMintAddress, tokenProvider, walletAddress])

  const SelectPools = () => {
    return (
      <Select
        onChange={onSelect}
        value={activeMintAddress || ''}
        bordered={false}
        suffixIcon={<Divider type="vertical" style={{ margin: 0 }} />}
        style={{ marginLeft: -4, marginRight: -12 }}
      >
        <Select.Option value="Select">
          <Space size={4}>
            <MintAvatar
              mintAddress={'Select'}
              icon={<IonIcon name="help-outline" />}
            />
            <Typography.Text>Select</Typography.Text>
          </Space>
        </Select.Option>
        {mintAddresses.map((mintAddress, i) => {
          return (
            <Select.Option key={mintAddress + i} value={mintAddress}>
              <Space size={4}>
                <MintAvatar mintAddress={mintAddress} />
                <MintSymbol mintAddress={mintAddress} />
              </Space>
            </Select.Option>
          )
        })}
      </Select>
    )
  }

  useEffect(() => {
    fetchData()
  }, [fetchData])
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
        prefix={<SelectPools />}
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
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  Recommend:
                </Typography.Text>
                <Typography.Text
                  type="danger"
                  style={{ fontSize: 12, cursor: 'pointer' }}
                  onClick={() => onAmount(suggestAmount?.toString() || '0')}
                >
                  {numeric(suggestAmount).format('0,0.[00000]a')}
                </Typography.Text>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {suggestSymbol || 'TOKEN'}
                </Typography.Text>
              </Space>
            ) : null}
          </Col>
          <Col>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
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
