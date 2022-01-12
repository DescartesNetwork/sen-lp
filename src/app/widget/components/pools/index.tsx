import { ReactElement, useMemo, useEffect, Fragment } from 'react'
import { useSelector } from 'react-redux'
import LazyLoad from '@senswap/react-lazyload'

import { Row, Col, Empty } from 'antd'
import ItemPool from './itemPool'

import { AppState } from 'app/model'
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
  onInit = () => {},
  onClick = () => {},
  action = () => <Fragment />,
}: {
  onInit?: (poolAddress: string) => void
  onClick?: (poolAddress: string) => void
  action?: (poolAddress: string) => ReactElement
}) => {
  const { communityPools } = useCommunityPools()
  const { listPoolAddress } = useListPoolAddress(communityPools)

  useEffect(() => {
    if (!listPoolAddress.length) return
    onInit(listPoolAddress[0])
  }, [onInit, listPoolAddress])

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
  onInit = () => {},
  onClick = () => {},
  action = () => <Fragment />,
}: {
  onInit?: (poolAddress: string) => void
  onClick?: (poolAddress: string) => void
  action?: (poolAddress: string) => ReactElement
}) => {
  const selectedCategoryPool = useSelector(
    (state: AppState) => state.main.selectedCategoryPool,
  )
  const isSentrePools = useMemo(
    () => selectedCategoryPool === PoolTabs.Sentre,
    [selectedCategoryPool],
  )

  return (
    <Row gutter={[12, 12]} justify="center">
      {isSentrePools ? (
        <SentrePools onClick={onClick} action={action} />
      ) : (
        <CommunityPool onInit={onInit} onClick={onClick} action={action} />
      )}
    </Row>
  )
}

export default ListPools
