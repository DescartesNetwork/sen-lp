import { ReactElement, useMemo, useState, Fragment, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { account, PoolData } from '@senswap/sen-js'
import LazyLoad from '@senswap/react-lazyload'

import { Row, Col, Empty } from 'antd'
import Search from './search'
import PoolCard from '../components/poolCard'

import { usePool } from 'senhub/providers'
import configs from 'app/configs'
import { AppState } from 'app/model'

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
  const {
    settings: { showArchived },
  } = useSelector((state: AppState) => state)
  const { pools } = usePool()

  const sortedPools = useMemo(
    () =>
      Object.keys(pools)
        .map((address) => ({ address, ...pools[address] }))
        .filter(({ owner }) => !senOwner.includes(owner))
        .filter((pool) => {
          const { reserve_a, reserve_b } = pool || {}
          const empty = !reserve_a || !reserve_b
          return showArchived || !empty
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
    [pools, showArchived],
  )

  useEffect(() => {
    if (!account.isAddress(selectedPoolAddress)) return
    const element = document.getElementById(selectedPoolAddress)
    const container = document.getElementById('scroll-container')
    if (container && element?.offsetTop) container.scrollTop = element.offsetTop
  }, [selectedPoolAddress])

  console.log(selectedPoolAddress)

  return (
    <Row gutter={[12, 12]} justify="center">
      <Col span={24}>
        <Search onChange={setSearchedPools} pools={sortedPools} />
      </Col>
      {!(searchedPools || sortedPools).length && (
        <Col>
          <Empty />
        </Col>
      )}
      {(searchedPools || sortedPools).map(({ address: poolAddress }, i) => (
        <Col id={poolAddress} span={24} key={i}>
          <LazyLoad height={78} overflow>
            <PoolCard
              poolAddress={poolAddress}
              action={action(poolAddress)}
              onClick={() => onClick(poolAddress)}
              selected={selectedPoolAddress === poolAddress}
            />
          </LazyLoad>
        </Col>
      ))}
    </Row>
  )
}

export default ListAllPools
