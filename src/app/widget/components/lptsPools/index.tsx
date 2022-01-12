import { ReactElement, Fragment, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import LazyLoad from '@senswap/react-lazyload'

import { Row, Col, Empty } from 'antd'
import ItemLPT from './itemLPT'

import { AppState } from 'app/model'
import { usePool, useWallet } from 'senhub/providers'

const LptsPools = ({
  onInit = () => {},
  onClick = () => {},
  action = () => <Fragment />,
}: {
  onInit?: (poolAddress: string) => void
  onClick?: (poolAddress: string) => void
  action?: (lptAddress: string, poolAddress: string) => ReactElement
}) => {
  const lpts = useSelector((state: AppState) => state.lpts)
  const selectedCategoryPool = useSelector(
    (state: AppState) => state.main.selectedCategoryPool,
  )
  const { pools } = usePool()
  const {
    wallet: { address: walletAddress },
  } = useWallet()

  const lptAddresses = useMemo(
    () =>
      Object.keys(lpts).filter((lptAddress) => {
        const { pool: poolAddress, amount } = lpts[lptAddress]
        if (selectedCategoryPool === 'deposited' && amount !== BigInt(0))
          return pools[poolAddress]
        else if (
          selectedCategoryPool === 'your-pools' &&
          pools?.[poolAddress]?.owner === walletAddress
        )
          return pools[poolAddress]
        return null
      }),
    [pools, lpts, walletAddress, selectedCategoryPool],
  )

  useEffect(() => {
    if (!lptAddresses.length) return
    onInit(lptAddresses[0])
  }, [onInit, lptAddresses, lpts])

  return (
    <Row gutter={[12, 12]} justify="center">
      {!lptAddresses.length && (
        <Col>
          <Empty />
        </Col>
      )}
      {lptAddresses.map((lptAddress, i) => {
        const { pool: poolAddress } = lpts[lptAddress]
        return (
          <Col span={24} key={lptAddress + i}>
            <LazyLoad height={78} overflow>
              <ItemLPT
                keyExpand={i + 1}
                data={lpts[lptAddress]}
                action={action(lptAddress, poolAddress)}
                onClick={() => onClick(poolAddress)}
              />
            </LazyLoad>
          </Col>
        )
      })}
    </Row>
  )
}

export default LptsPools
