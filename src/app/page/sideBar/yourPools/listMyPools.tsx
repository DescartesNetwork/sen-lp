import { ReactElement, Fragment, useMemo } from 'react'
import { useSelector } from 'react-redux'
import LazyLoad from '@senswap/react-lazyload'

import { Row, Col, Empty } from 'antd'
import LPTCard from '../components/lptCard'

import { AppState } from 'app/model'
import { usePool, useWallet } from 'senhub/providers'

const ListMyPools = ({
  onClick = () => {},
  selectedPoolAddress,
  action = () => <Fragment />,
}: {
  onClick?: (lptAddress: string, poolAddress: string) => void
  selectedPoolAddress?: string
  action?: (lptAddress: string, poolAddress: string) => ReactElement
}) => {
  const lpts = useSelector((state: AppState) => state.lpts)
  const { pools } = usePool()
  const {
    wallet: { address: walletAddress },
  } = useWallet()

  const lptAddresses = useMemo(
    () =>
      Object.keys(lpts).filter((lptAddress) => {
        const { pool: poolAddress } = lpts[lptAddress]
        return pools[poolAddress]?.owner === walletAddress
      }),
    [lpts, pools, walletAddress],
  )

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
              <LPTCard
                data={lpts[lptAddress]}
                action={action(lptAddress, poolAddress)}
                onClick={() => onClick(lptAddress, poolAddress)}
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
