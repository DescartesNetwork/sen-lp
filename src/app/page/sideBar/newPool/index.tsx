import { Fragment, useState, useEffect, useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useAccount, useMint, usePool, useWallet } from 'senhub/providers'
import { account } from '@senswap/sen-js'

import { Row, Col, Modal, Button, Typography } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import AmountSelect from './amountSelect'

import { notifyError, notifySuccess } from 'app/helper'
import { AppState } from 'app/model'
import configs from 'app/configs'
import suggestions, { MintInfo } from 'app/helper/suggestions'
import { fetchCGK } from 'shared/util'

const {
  sol: { taxmanAddress },
  fee: { exoticFee, exoticTax },
} = configs

const NewPool = () => {
  const [visible, setVisible] = useState(false)
  const [reserveA, setReserveA] = useState(BigInt(0))
  const [mintAddressA, setMintAddressA] = useState('')
  const [reserveB, setReserveB] = useState(BigInt(0))
  const [mintAddressB, setMintAddressB] = useState('')
  const [mapMints, setMapMints] = useState<Map<string, string>>(new Map())
  const [mintInfos, setMintInfos] = useState<Map<string, MintInfo>>()
  const [isMintAChanged, setIsMintAChanged] = useState<boolean>(false)
  const { accounts } = useAccount()
  const lpts = useSelector((state: AppState) => state.lpts)
  const {
    wallet: { address: walletAddress },
  } = useWallet()
  const { pools } = usePool()
  const { tokenProvider } = useMint()

  const lptAddresses = useMemo(
    () =>
      Object.keys(lpts).map((lptAddress) => {
        const { pool: poolAddress } = lpts[lptAddress]
        return pools?.[poolAddress]?.mint_lpt
      }),
    [pools, lpts],
  )

  const filterMintAddress = () => {
    const mintAddress = []
    for (const accountAddress of Object.keys(accounts)) {
      const { mint } = accounts[accountAddress]
      if (!lptAddresses.includes(mint)) mintAddress.push(mint)
    }
    return mintAddress
  }

  const mintsAddress = useMemo(() => {
    const mints = []
    if (mintAddressA) mints.push(mintAddressA)
    if (mintAddressB) mints.push(mintAddressB)
    return mints
  }, [mintAddressA, mintAddressB])

  const isValid =
    reserveA &&
    reserveB &&
    account.isAddress(mintAddressA) &&
    account.isAddress(mintAddressB)

  const mint_a_b = `${mintAddressA}${mintAddressB}`
  const mint_b_a = `${mintAddressB}${mintAddressA}`
  const isExist = mapMints.has(mint_a_b) || mapMints.has(mint_b_a)

  const onSelectMintA = ({
    amount,
    mintAddress,
  }: {
    amount: bigint
    mintAddress: string
  }) => {
    setReserveA(amount)
    setMintAddressA(mintAddress)
    setIsMintAChanged(true)
  }

  const onSelectMintB = async ({
    amount,
    mintAddress,
  }: {
    amount: bigint
    mintAddress: string
  }) => {
    setReserveB(amount)
    setMintAddressB(mintAddress)
    setIsMintAChanged(false)
  }

  const suggestInfo = useMemo(() => {
    if (!mintInfos) return
    const mintInfoA = mintInfos.get(mintAddressA)
    const mintInfoB = mintInfos.get(mintAddressB)

    if (!mintInfoA || !mintInfoB) return
    const { address: addressA, symbol: symbolA } = mintInfoA
    const { address: addressB, symbol: symbolB } = mintInfoB

    let suggestAmount = 0
    let symbol = ''
    let mintAddress = ''
    if (isMintAChanged) {
      suggestAmount = suggestions.calculateAmount(
        reserveA,
        mintInfoA,
        mintInfoB,
      )
      symbol = symbolB
      mintAddress = addressB
    } else {
      suggestAmount = suggestions.calculateAmount(
        reserveB,
        mintInfoB,
        mintInfoA,
      )
      symbol = symbolA
      mintAddress = addressA
    }
    return { symbol, amount: suggestAmount, address: mintAddress }
  }, [
    isMintAChanged,
    mintAddressA,
    mintAddressB,
    mintInfos,
    reserveA,
    reserveB,
  ])

  const onNewPool = async () => {
    const { swap, splt, wallet } = window.sentre
    const mintAddresses = [mintAddressA, mintAddressB]
    const srcAddresses = await Promise.all(
      mintAddresses.map((mintAddress) =>
        splt.deriveAssociatedAddress(walletAddress, mintAddress),
      ),
    )
    if (!wallet) return
    try {
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
      setVisible(false)
      return notifySuccess('Create a new pool', txId)
    } catch (er) {
      return notifyError(er)
    }
  }

  const getMapMints = useCallback(() => {
    for (let addr in pools) {
      const pool = pools[addr]
      const { mint_a, mint_b } = pool
      const concatMint = `${mint_a}${mint_b}`
      mapMints.set(concatMint, addr)
    }
    setMapMints(mapMints)
  }, [mapMints, pools])

  useEffect(() => {
    getMapMints()
  }, [getMapMints])

  const onClose = () => {
    setVisible(!visible)
    setMintAddressA('')
    setMintAddressB('')
  }

  const getMintInfos = useCallback(
    async (mintAddress: string[]) => {
      let promise = mintAddress.map(async (mint) => {
        const mintInfo = {} as MintInfo
        const tokenInfo = await tokenProvider.findByAddress(mint)
        const ticket = tokenInfo?.extensions?.coingeckoId
        let price = 0
        if (ticket) {
          price = (await fetchCGK(ticket)).price
        }
        if (tokenInfo) {
          mintInfo.symbol = tokenInfo.symbol
          mintInfo.decimals = tokenInfo.decimals
          mintInfo.address = tokenInfo.address
          mintInfo.price = price
        }
        return mintInfo
      })
      const mintsDetails = await Promise.all(promise)
      const mapMintsDetails = new Map<string, MintInfo>()
      mintsDetails.forEach((mint) => {
        mapMintsDetails.set(mint.address, mint)
      })
      return mapMintsDetails
    },
    [tokenProvider],
  )

  useEffect(() => {
    if (!mintsAddress) return
    ;(async () => {
      const infos = await getMintInfos(mintsAddress)
      setMintInfos(infos)
    })()
  }, [mintsAddress, getMintInfos])

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
        title={<Typography.Title level={4}>New Pool</Typography.Title>}
        footer={
          <Button
            type="primary"
            size="large"
            onClick={onNewPool}
            disabled={!isValid}
            block
          >
            Supply
          </Button>
        }
        destroyOnClose={true}
        centered={true}
      >
        <Row gutter={[16, 12]}>
          <Col span={24}>
            <Typography.Text type="secondary">
              This is your first time adding liquidity. It is the rate you add
              that sets the price for that LP token pair. If you feel satisfied
              with the rate please press the Supply button.
            </Typography.Text>
          </Col>
          <Col span={24}>
            <Typography.Text type="secondary">
              <strong className="content">Liquidity provider incentive.</strong>{' '}
              Liquidity providers earn a 0.25% fee on all trades proportional to
              their share of the pool. Fees are accrued into the pool and can be
              claimed by withdrawing your liquidity.
            </Typography.Text>
          </Col>
          <Col span={24}>
            <AmountSelect
              mintAddresses={filterMintAddress()}
              onChange={onSelectMintA}
              suggestInfo={suggestInfo}
            />
          </Col>
          <Col span={24}>
            <AmountSelect
              mintAddresses={filterMintAddress()}
              onChange={onSelectMintB}
              suggestInfo={suggestInfo}
            />
          </Col>
          {isExist && (
            <Col span={24}>
              <Typography.Text className="caption" type="danger">
                The pool you want to create with selected mints already exists.
                We hightly recomment to deposit your liquidity to the pool
                instead.
              </Typography.Text>
            </Col>
          )}
        </Row>
      </Modal>
    </Fragment>
  )
}

export default NewPool
