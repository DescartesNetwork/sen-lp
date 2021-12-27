import { ReactElement, useMemo, useEffect, Fragment } from 'react'

import { Row, Col } from 'antd'
import ItemPool from './itemPool'
import LazyLoad from 'react-lazyload'

import { usePool } from 'senhub/providers'

const ListPools = ({
  onInit = () => {},
  onClick = () => {},
  action = () => <Fragment />,
}: {
  onInit?: (poolAddress: string) => void
  onClick?: (poolAddress: string) => void
  action?: (poolAddress: string) => ReactElement
}) => {
  const { pools } = usePool()
  const sortedPools = useMemo(
    () =>
      Object.keys(pools).map((address) => {
        return { address, ...pools[address] }
      }),

    [pools],
  )

  useEffect(() => {
    if (!sortedPools.length) return
    onInit(sortedPools[0]?.address)
  }, [onInit, sortedPools])

  return (
    <Row gutter={[12, 12]}>
      {sortedPools.map((poolData, i) => (
        <Col span={24} key={poolData.address + i}>
          <LazyLoad height={78} overflow>
            <ItemPool
              poolAddress={poolData.address}
              action={action(poolData.address)}
              onClick={() => onClick(poolData.address)}
              keyExpand={i + 1}
            />
          </LazyLoad>
        </Col>
      ))}
    </Row>
  )
}

export default ListPools
