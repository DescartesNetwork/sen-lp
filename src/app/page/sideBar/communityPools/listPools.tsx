import { ReactElement, Fragment, useEffect } from 'react'
import { account } from '@senswap/sen-js'
import LazyLoad from '@senswap/react-lazyload'

import { Row, Col, Empty } from 'antd'
import PoolCard from '../components/poolCard'

import { useCommunityPools } from 'app/hooks/pools/useCommunityPools'
import { useFilterPools } from 'app/hooks/pools/useFilterPools'
import { useSearchedPools } from 'app/hooks/pools/useSearchedPools'
import { useSortedPools } from 'app/hooks/pools/useSortedPools'

const ListAllPools = ({
  onClick = () => {},
  selectedPoolAddress,
  action = () => <Fragment />,
}: {
  onClick?: (poolAddress: string) => void
  selectedPoolAddress?: string
  action?: (poolAddress: string) => ReactElement
}) => {
  const { communityPools } = useCommunityPools()
  const { filteredPools } = useFilterPools(communityPools)
  const { searchedPools } = useSearchedPools(filteredPools)
  const { sortedPools } = useSortedPools(searchedPools)

  useEffect(() => {
    if (!account.isAddress(selectedPoolAddress)) return
    const element = document.getElementById(selectedPoolAddress)
    const container = document.getElementById('scroll-container')
    if (container && element?.offsetTop) container.scrollTop = element.offsetTop
  }, [selectedPoolAddress])

  return (
    <Row gutter={[12, 12]} justify="center">
      {!sortedPools.length ? (
        <Col>
          <Empty />
        </Col>
      ) : (
        Object.keys(sortedPools).map((poolAddress) => (
          <Col id={poolAddress} span={24} key={poolAddress}>
            <LazyLoad height={78} overflow>
              <PoolCard
                poolAddress={poolAddress}
                action={action(poolAddress)}
                onClick={() => onClick(poolAddress)}
                selected={selectedPoolAddress === poolAddress}
              />
            </LazyLoad>
          </Col>
        ))
      )}
    </Row>
  )
}

export default ListAllPools
