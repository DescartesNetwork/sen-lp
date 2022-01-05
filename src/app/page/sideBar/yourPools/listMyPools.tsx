import { ReactElement, Fragment } from 'react'
import { useSelector } from 'react-redux'
import LazyLoad from '@senswap/react-lazyload'

import { Row, Col } from 'antd'

import { AppState } from 'app/model'
import { usePool, useWallet } from 'senhub/providers'
import { useTVLSortPool } from 'app/hooks/useTVLSortPool'
import PoolCard from '../components/poolCard'

const ListMyPools = ({
  onInit = () => {},
  selectedPoolAddress,
  action = () => <Fragment />,
  setActiveAddress = () => {},
}: {
  onInit?: (poolAddress: string) => void
  selectedPoolAddress?: string
  action?: (poolAddress: string) => ReactElement
  setActiveAddress?: (poolAddress: string) => void
}) => {
  const lpts = useSelector((state: AppState) => state.lpts)
  const { pools } = usePool()
  const {
    wallet: { address: walletAddress },
  } = useWallet()

  const lptAddresses = Object.keys(lpts).filter((lptAddress) => {
    const { pool: poolAddress } = lpts[lptAddress]
    if (pools?.[poolAddress]?.owner === walletAddress)
      return pools?.[poolAddress]
    return null
  })

  const poolAddresses = lptAddresses.map((address) => {
    const { pool: poolAddress } = lpts?.[address]
    return poolAddress
  })
  const poolSortByTvl = useTVLSortPool(poolAddresses)

  return (
    <Row gutter={[12, 12]}>
      {poolSortByTvl.map(({ address: poolAddress }, i) => {
        return (
          <Col span={24} key={poolAddress + i}>
            <LazyLoad height={78} overflow>
              <PoolCard
                poolAddress={poolAddress}
                action={action(poolAddress)}
                onClick={() => setActiveAddress(poolAddress)}
                selected={selectedPoolAddress === poolAddress}
              />
            </LazyLoad>
          </Col>
        )
      })}
    </Row>
  )
}

export default ListMyPools
