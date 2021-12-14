import { ReactElement, Fragment, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'

import { Row, Col } from 'antd'
import LPTCard from './lptCard'
import LazyLoad from 'react-lazyload'

import { AppState } from 'app/model'
import { usePool } from 'senhub/providers'

const ListMyPools = ({
  onInit = () => {},
  onClick = () => {},
  selectedPoolAddress,
  action = () => <Fragment />,
}: {
  onInit?: (poolAddress: string) => void
  onClick?: (lptAddress: string, poolAddress: string) => void
  selectedPoolAddress?: string
  action?: (lptAddress: string, poolAddress: string) => ReactElement
}) => {
  const lpts = useSelector((state: AppState) => state.lpts)
  const { pools } = usePool()

  const lptAddresses = useMemo(
    () =>
      Object.keys(lpts).filter((lptAddress) => {
        const { pool: poolAddress } = lpts[lptAddress]
        return pools[poolAddress]
      }),
    [pools, lpts],
  )

  useEffect(() => {
    if (!lptAddresses.length) return
    onInit(lptAddresses[0])
  }, [onInit, lptAddresses, lpts])

  return (
    <Row gutter={[12, 12]}>
      {lptAddresses.map((lptAddress, i) => {
        const { pool: poolAddress } = lpts[lptAddress]
        return (
          <Col span={24} key={lptAddress + i}>
            <LazyLoad height={84} overflow>
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
