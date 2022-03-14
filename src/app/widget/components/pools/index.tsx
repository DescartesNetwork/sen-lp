import { ReactElement, Fragment } from 'react'
import LazyLoad from '@senswap/react-lazyload'

import { Row, Col, Empty } from 'antd'
import ItemPool from './itemPool'

import { PoolTabs } from 'app/constant'
import { useSentrePools } from 'app/hooks/pools/useSentrePools'
import { useListPoolAddress } from 'app/hooks/pools/useListPoolAddress'
import { useCommunityPools } from 'app/hooks/pools/useCommunityPools'

const SentrePools = ({
  onClick = () => {},
  action = () => <Fragment />,
}: {
  onClick?: (poolAddress: string) => void
  action?: (poolAddress: string) => ReactElement
}) => {
  const { sentrePools } = useSentrePools()
  const { listPoolAddress } = useListPoolAddress(sentrePools)

  return (
    <Fragment>
      {!listPoolAddress.length && (
        <Col>
          <Empty />
        </Col>
      )}
      {listPoolAddress.map((poolAddress, i) => (
        <Col span={24} key={poolAddress}>
          <LazyLoad height={78} overflow>
            <ItemPool
              poolAddress={poolAddress}
              action={action(poolAddress)}
              onClick={() => onClick(poolAddress)}
              keyExpand={i + 1}
            />
          </LazyLoad>
        </Col>
      ))}
    </Fragment>
  )
}

const CommunityPool = ({
  onClick = () => {},
  action = () => <Fragment />,
}: {
  onClick?: (poolAddress: string) => void
  action?: (poolAddress: string) => ReactElement
}) => {
  const { communityPools } = useCommunityPools()
  const { listPoolAddress } = useListPoolAddress(communityPools)

  return (
    <Fragment>
      {listPoolAddress.map((poolAddress, i) => (
        <Col span={24} key={poolAddress}>
          <LazyLoad height={78} overflow>
            <ItemPool
              poolAddress={poolAddress}
              action={action(poolAddress)}
              onClick={() => onClick(poolAddress)}
              keyExpand={i + 1}
            />
          </LazyLoad>
        </Col>
      ))}
    </Fragment>
  )
}

const ListPools = ({
  selectedTab,
  onClick = () => {},
  action = () => <Fragment />,
}: {
  selectedTab: string
  onClick?: (poolAddress: string) => void
  action?: (poolAddress: string) => ReactElement
}) => {
  return (
    <Row gutter={[12, 12]} justify="center">
      {selectedTab === PoolTabs.Sentre ? (
        <SentrePools onClick={onClick} action={action} />
      ) : (
        <CommunityPool onClick={onClick} action={action} />
      )}
    </Row>
  )
}

export default ListPools
