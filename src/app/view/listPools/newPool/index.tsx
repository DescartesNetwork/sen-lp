import { Fragment, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAccount, usePool, useWallet } from '@senhub/providers'
import { account, utils } from '@senswap/sen-js'

import { Row, Col, Modal, Button, Typography, Space } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import AmountSelect, { AmountSelectOnChnage } from './amountSelect'

import { notifyError, notifySuccess } from 'app/helper'
import { AppState } from 'app/model'
import configs from 'app/configs'
import { useMintPrice } from 'app/hooks/useMintPrice'
import useMintDecimals from 'shared/hooks/useMintDecimals'
import { useHistory } from 'react-router-dom'
import { LiquidityPoolTabs, PoolTabs, QueryParams } from 'app/constant'

const {
  sol: { taxmanAddress },
  fee: { exoticFee, exoticTax },
  route: { myRoute },
} = configs

const NewPool = () => {
  const history = useHistory()
  const [visible, setVisible] = useState(false)
  const [reserveA, setReserveA] = useState(BigInt(0))
  const [mintAddressA, setMintAddressA] = useState('')
  const [reserveB, setReserveB] = useState(BigInt(0))
  const [mintAddressB, setMintAddressB] = useState('')
  const [isMintAChanged, setIsMintAChanged] = useState(false)
  const [suggestions, setSuggestions] = useState([0, 0])
  const { lpts } = useSelector((state: AppState) => state)
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const { accounts } = useAccount()
  const { pools } = usePool()

  // String combination of mint_a and mint_b
  const existedPoolKeys = Object.values(pools).map(
    ({ mint_a, mint_b }) => `${mint_a}${mint_b}`,
  )
  // Check the pool whether exists
  const isExisted =
    existedPoolKeys.includes(`${mintAddressA}${mintAddressB}`) ||
    existedPoolKeys.includes(`${mintAddressB}${mintAddressA}`)
  // Filtered the valid mints (exclude lp tokens)
  const exclusiveMintAddresses = Object.values(lpts)
    .map(({ pool }) => pools[pool]?.mint_lpt)
    .filter((mintAddress) => account.isAddress(mintAddress))
  const filteredMintAddress = Object.values(accounts)
    .map(({ mint }) => mint)
    .filter((mintAddress) => !exclusiveMintAddresses.includes(mintAddress))
  // Mint info
  const mintAPrice = useMintPrice(mintAddressA)
  const decimalsA = useMintDecimals(mintAddressA) || 0
  const mintBPrice = useMintPrice(mintAddressB)
  const decimalsB = useMintDecimals(mintAddressB) || 0
  // Valid to supply
  const isValid =
    reserveA &&
    reserveB &&
    account.isAddress(mintAddressA) &&
    account.isAddress(mintAddressB)

  const onSelectMintA = ({ amount, mintAddress }: AmountSelectOnChnage) => {
    setReserveA(amount)
    setMintAddressA(mintAddress)
    setIsMintAChanged(true)
  }

  const onSelectMintB = ({ amount, mintAddress }: AmountSelectOnChnage) => {
    setReserveB(amount)
    setMintAddressB(mintAddress)
    setIsMintAChanged(false)
  }

  const onNewPool = async () => {
    try {
      const { swap, splt, wallet } = window.sentre
      if (!wallet || !account.isAddress(walletAddress))
        throw new Error('Wallet is not connected')
      if (!account.isAddress(mintAddressA) || !account.isAddress(mintAddressB))
        throw new Error('Please select both tokens')
      const mintAddresses = [mintAddressA, mintAddressB]
      const srcAddresses = await Promise.all(
        mintAddresses.map((mintAddress) =>
          splt.deriveAssociatedAddress(walletAddress, mintAddress),
        ),
      )
      const { txId } = await swap.initializePool(
        reserveA,
        reserveB,
        exoticFee,
        exoticTax,
        walletAddress,
        srcAddresses[0],
        srcAddresses[1],
        taxmanAddress,
        wallet,
      )
      history.push(
        `${myRoute}?${QueryParams.wrapTab}=${LiquidityPoolTabs.Pools}&${QueryParams.tabInPools}=${PoolTabs.YourPools}`,
      )
      setVisible(false)
      return notifySuccess('Create a new pool', txId)
    } catch (er) {
      return notifyError(er)
    }
  }

  const onClose = () => {
    setVisible(false)
    setMintAddressA('')
    setMintAddressB('')
    setSuggestions([0, 0])
  }

  useEffect(() => {
    if (isMintAChanged && mintBPrice) {
      const amount =
        (Number(utils.undecimalize(reserveA, decimalsA)) * mintAPrice) /
        mintBPrice
      return setSuggestions([0, amount])
    }
    if (!isMintAChanged && mintAPrice) {
      const amount =
        (Number(utils.undecimalize(reserveB, decimalsB)) * mintBPrice) /
        mintAPrice
      return setSuggestions([amount, 0])
    }
    return setSuggestions([0, 0])
  }, [
    isMintAChanged,
    reserveA,
    mintAPrice,
    decimalsA,
    reserveB,
    mintBPrice,
    decimalsB,
  ])

  return (
    <Fragment>
      <Button
        type="primary"
        icon={<IonIcon name="add-outline" />}
        onClick={() => setVisible(!visible)}
      >
        New
      </Button>
      <Modal
        visible={visible}
        onCancel={onClose}
        closeIcon={<IonIcon name="close" />}
        footer={null}
        destroyOnClose={true}
        centered={true}
      >
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Typography.Title level={4}>New Pool</Typography.Title>
          </Col>
          <Col span={24}>
            <Typography.Text type="secondary">
              <strong className="content">Liquidity Provider Incentive.</strong>{' '}
              Liquidity providers earn a 0.25% fee on all trades proportional to
              their share of the pool. Fees are accrued into the pool and can be
              claimed by withdrawing your liquidity.
            </Typography.Text>
          </Col>
          <Col span={24}>
            <AmountSelect
              mintAddresses={filteredMintAddress}
              onChange={onSelectMintA}
              suggestion={suggestions[0]}
            />
          </Col>
          <Col span={24}>
            <AmountSelect
              mintAddresses={filteredMintAddress}
              onChange={onSelectMintB}
              suggestion={suggestions[1]}
            />
          </Col>
          <Col span={24}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Button
                  type="primary"
                  onClick={onNewPool}
                  disabled={!isValid}
                  block
                >
                  Supply
                </Button>
              </Col>
              {isExisted && (
                <Col span={24}>
                  <Space align="start">
                    <Typography.Text className="caption" type="danger">
                      <IonIcon name="warning-outline" />
                    </Typography.Text>
                    <Typography.Text className="caption" type="danger">
                      A pool of the desired pair of tokens had already created.
                      We highly recommend to deposit your liquidity to the pool
                      instead.
                    </Typography.Text>
                  </Space>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </Modal>
    </Fragment>
  )
}

export default NewPool
