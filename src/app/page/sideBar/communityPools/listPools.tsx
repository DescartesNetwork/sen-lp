import { ReactElement, useState, Fragment } from 'react'
import { PoolData } from '@senswap/sen-js'
import LazyLoad from '@senswap/react-lazyload'

import { Row, Col, Empty } from 'antd'
import Search from './search'
import PoolCard from '../components/poolCard'

import { usePool } from 'senhub/providers'
import configs from 'app/configs'
import { useTVLSortPool } from 'app/hooks/useTVLSortPool'

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

  const listPool = Object.keys(pools).filter((poolAddr) => {
    const poolData = pools?.[poolAddr]
    const { owner } = poolData
    return !senOwner.includes(owner)
  })

  const sortedPools = useTVLSortPool(listPool)

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
