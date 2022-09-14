import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Swap, utils } from '@senswap/sen-js'
import {
  useGetMintData,
  useGetMintDecimals,
  useWalletAddress,
  util,
} from '@sentre/senhub'

import { Row, Col, Typography, Button } from 'antd'
import LPT from './lpt'
import Info from './info'

import { AppState } from 'model'
import { usePool } from 'hooks/pools/usePool'

const Withdraw = ({
  poolAddress,
  onClose = () => {},
}: {
  poolAddress: string
  onClose?: () => void
}) => {
  const [lpt, setLPT] = useState(BigInt(0))
  const [supply, setSupply] = useState<bigint | undefined>()
  const [amounts, setAmounts] = useState<string[]>([])
  const [decimals, setDecimals] = useState([0, 0])
  const [loading, setLoading] = useState(false)
  const { lpts } = useSelector((state: AppState) => state)
  const getDecimals = useGetMintDecimals()

  const lptAddress =
    Object.keys(lpts).find((key) => lpts[key].pool === poolAddress) || ''
  const lptPoolAddress = lpts?.[lptAddress]?.pool

  const walletAddress = useWalletAddress()
  const { pools } = usePool()
  const getMint = useGetMintData()

  const { reserve_a, reserve_b, mint_lpt } = pools?.[lptPoolAddress] || {}
  const { mint_a, mint_b } = pools?.[poolAddress]
  const mintAddresses = [mint_a, mint_b]

  const fetchData = useCallback(async () => {
    try {
      const mintDataLPT = await getMint({ mintAddress: mint_lpt })
      if (!mintDataLPT) return setSupply(undefined)
      const { supply } = mintDataLPT[mint_lpt]
      setSupply(supply)
    } catch (er) {}
    try {
      let decimalsA = (await getDecimals({ mintAddress: mint_a })) || 0
      let decimalsB = (await getDecimals({ mintAddress: mint_b })) || 0
      setDecimals([decimalsA, decimalsB])
    } catch (er) {}
  }, [getMint, mint_lpt, getDecimals, mint_a, mint_b])

  const onWithdraw = async () => {
    if (!lpt) return
    setLoading(true)
    const { swap, wallet, splt } = window.sentre
    const dstAddresses = await Promise.all(
      mintAddresses.map((mintAddress) =>
        splt.deriveAssociatedAddress(walletAddress, mintAddress),
      ),
    )
    if (!wallet) return
    try {
      const { txId } = await swap.removeLiquidity(
        lpt,
        poolAddress,
        dstAddresses[0],
        dstAddresses[1],
        wallet,
      )
      setLPT(BigInt(0))
      return window.notify({
        type: 'success',
        description: 'Withdraw liquidity successfully. Click to view details.',
        onClick: () => window.open(util.explorer(txId), '_blank'),
      })
    } catch (er: any) {
      return window.notify({ type: 'error', description: er.message })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!supply) {
      setAmounts([])
    } else {
      const { deltaA, deltaB } = Swap.oracle.withdraw(
        lpt,
        supply,
        reserve_a,
        reserve_b,
      )
      const deltas = [deltaA, deltaB]
      const amounts = deltas.map((delta, i) =>
        utils.undecimalize(delta, decimals[i]),
      )
      setAmounts(amounts)
    }
  }, [reserve_a, reserve_b, lpt, supply, decimals])
  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Typography.Title level={5}>Withdraw Liquidity</Typography.Title>
      </Col>
      <Col span={24}>
        <LPT
          lpt={lpt}
          poolAddress={poolAddress}
          lptAddress={lptAddress}
          onChange={setLPT}
        />
      </Col>
      <Col span={24}>
        <Info mintAddresses={mintAddresses} amounts={amounts} />
      </Col>
      <Col span={24}>
        <Button
          type="primary"
          onClick={onWithdraw}
          disabled={!lpt}
          block
          loading={loading}
        >
          Withdraw
        </Button>
      </Col>
    </Row>
  )
}

export default Withdraw
