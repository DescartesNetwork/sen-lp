import { MouseEvent, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import LazyLoad from '@senswap/react-lazyload'

import { Button, Col, Empty, Row } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import PoolCard from '../components/poolCard'

import configs from 'app/configs'
import { AppDispatch, AppState } from 'app/model'
import { handleOpenDrawer, selectPool } from 'app/model/main.controller'
import { PoolTabs, QueryParams } from 'app/constant'
import { useCommunityPools } from 'app/hooks/pools/useCommunityPools'
import { useListPoolAddress } from 'app/hooks/pools/useListPoolAddress'

const {
  route: { myRoute },
} = configs

const CommunityPools = () => {
  const history = useHistory()
  const dispatch = useDispatch<AppDispatch>()
  const { selectedPoolAddress } = useSelector((state: AppState) => state.main)
  const { communityPools } = useCommunityPools()
  const { listPoolAddress } = useListPoolAddress(communityPools)

  const setActivePoolAddress = useCallback(
    async (address: string) => {
      await dispatch(selectPool(address))
      await dispatch(handleOpenDrawer(false))
      return history.push(
        `${myRoute}?${QueryParams.address}=${address}&${QueryParams.category}=${PoolTabs.Community}`,
      )
    },
    [dispatch, history],
  )

  const action = useCallback(
    (poolAddress) => {
      return (
        <Button
          type="text"
          onClick={(e: MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation()
            setActivePoolAddress(poolAddress)
          }}
          icon={
            <IonIcon
              name="arrow-forward-outline"
              style={{ fontSize: 12, color: '#7A7B85' }}
            />
          }
        />
      )
    },
    [setActivePoolAddress],
  )

  return (
    <Row gutter={[12, 12]}>
      {!listPoolAddress.length ? (
        <Col>
          <Empty />
        </Col>
      ) : (
        listPoolAddress.map((poolAddress) => (
          <Col id={poolAddress} span={24} key={poolAddress}>
            <LazyLoad height={78} overflow>
              <PoolCard
                poolAddress={poolAddress}
                action={action(poolAddress)}
                onClick={setActivePoolAddress}
                selected={selectedPoolAddress === poolAddress}
              />
            </LazyLoad>
          </Col>
        ))
      )}
    </Row>
  )
}

export default CommunityPools
