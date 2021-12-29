import { ReactElement, useMemo, useEffect, Fragment } from 'react'
import { useSelector } from 'react-redux'
import LazyLoad from '@senswap/react-lazyload'

import { Row, Col } from 'antd'
import ItemPool from './itemPool'

import { usePool } from 'senhub/providers'
import { AppState } from 'app/model'
import configs from 'app/configs'

const {
  sol: { senOwner },
} = configs

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
  const selectedCategoryPool = useSelector(
    (state: AppState) => state.main.selectedCategoryPool,
  )
  const sortedPools = useMemo(
    () =>
      Object.keys(pools)
        .map((address) => ({ address, ...pools[address] }))
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

  const listSentrePools = Object.keys(pools).filter((poolAddr) => {
    const poolData = pools?.[poolAddr]
    const { owner } = poolData
    return senOwner.includes(owner)
  })

  useEffect(() => {
    if (!sortedPools.length) return
    onInit(sortedPools[0]?.address)
  }, [onInit, sortedPools])

  const CommunityPool = () => (
    <Fragment>
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
    </Fragment>
  )

  const SentrePools = () => (
    <Fragment>
      {listSentrePools.map((poolAddress, i) => (
        <Col span={24} key={poolAddress + i}>
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

  return (
    <Row gutter={[12, 12]}>
      {selectedCategoryPool === 'sentre' ? <SentrePools /> : <CommunityPool />}
    </Row>
  )
}

export default ListPools
