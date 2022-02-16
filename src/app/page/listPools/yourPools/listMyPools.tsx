import { ReactElement, Fragment, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import LazyLoad from '@senswap/react-lazyload'

import { Row, Col, Empty } from 'antd'
import PoolCard from '../components/poolCard'

import { useYourPools } from 'app/hooks/pools/useYourPools'
import { useListPoolAddress } from 'app/hooks/pools/useListPoolAddress'
import { useTotalPoolTvl } from 'app/hooks/useTotalPoolTvl'
import { AppDispatch } from 'app/model'
import { onSetTotalTvl } from 'app/model/main.controller'

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
