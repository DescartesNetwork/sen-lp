import { ReactElement, useMemo, useState, Fragment } from 'react'
import { PoolData } from '@senswap/sen-js'
import LazyLoad from '@senswap/react-lazyload'

import { Row, Col } from 'antd'
import Search from './search'
import PoolCard from '../components/poolCard'

import { usePool } from 'senhub/providers'
import configs from 'app/configs'

const {
  sol: { senOwner },
} = configs

const ListAllPools = ({
  onClick = () => {},
  selectedPoolAddress,
  action = () => <Fragment />,
}: {
  onClick?: (poolAddress: string) => void
  selectedPoolAddress?: string
  action?: (poolAddress: string) => ReactElement
}) => {
  const [searchedPools, setSearchedPools] = useState<
    Array<PoolData & { address: string }> | undefined
  >()
  const { pools } = usePool()

  const sortedPools = useMemo(
    () =>
      Object.keys(pools)
        .map((address) => ({ address, ...pools[address] }))
        .filter((pool) => {
          const { owner } = pool || {}
          return !senOwner.includes(owner)
        })
        .sort(
          (
            { reserve_a: firstRa, reserve_b: firstRb },
            { reserve_a: secondRa, reserve_b: secondRb },
          ) => {
            const firstK = firstRa * firstRb
            const secondK = secondRa * secondRb
            if (firstK > secondK) return -1
            if (firstK < secondK) return 1
            return 0
          },
        ),
    [pools],
  )

  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <Search onChange={setSearchedPools} pools={sortedPools} />
      </Col>
      {(searchedPools || sortedPools).map((poolData, i) => (
        <Col span={24} key={poolData.address + i}>
          <LazyLoad height={78} overflow>
            <PoolCard
              poolAddress={poolData.address}
              action={action(poolData.address)}
              onClick={() => onClick(poolData.address)}
              selected={selectedPoolAddress === poolData.address}
            />
          </LazyLoad>
        </Col>
      ))}
    </Row>
  )
}

export default ListAllPools
