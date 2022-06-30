import { ReactElement, Fragment, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import LazyLoad from '@sentre/react-lazyload'

import { Row, Col, Empty } from 'antd'
import PoolCard from '../components/poolCard'

import { useYourPools } from 'hooks/pools/useYourPools'
import { useListPoolAddress } from 'hooks/pools/useListPoolAddress'
import { useTotalPoolTvl } from 'hooks/useTotalPoolTvl'
import { AppDispatch } from 'model'
import { onSetTotalTvl } from 'model/main.controller'

const ListMyPools = ({
  onClick = () => {},
  selectedPoolAddress,
  action = () => <Fragment />,
}: {
  onClick?: (poolAddress: string) => void
  selectedPoolAddress?: string
  action?: (poolAddress: string) => ReactElement
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { yourPools } = useYourPools()
  const { listPoolAddress } = useListPoolAddress(yourPools)
  const totalTvl = useTotalPoolTvl(listPoolAddress)

  useEffect(() => {
    dispatch(onSetTotalTvl(totalTvl))
  }, [dispatch, totalTvl])

  return (
    <Row gutter={[12, 12]} justify="center">
      {!listPoolAddress.length && (
        <Col>
          <Empty />
        </Col>
      )}
      {listPoolAddress.map((poolAddress) => (
        <Col span={24} key={poolAddress}>
          <LazyLoad height={78} overflow>
            <PoolCard
              poolAddress={poolAddress}
              action={action(poolAddress)}
              onClick={() => onClick(poolAddress)}
              selected={selectedPoolAddress === poolAddress}
              myLp
            />
          </LazyLoad>
        </Col>
      ))}
    </Row>
  )
}

export default ListMyPools
