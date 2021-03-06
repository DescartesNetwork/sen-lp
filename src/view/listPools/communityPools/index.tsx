import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import LazyLoad from '@sentre/react-lazyload'

import { Col, Empty, Row } from 'antd'
import PoolCard from '../components/poolCard'

import configs from 'configs'
import { AppDispatch, AppState } from 'model'
import {
  handleOpenDrawer,
  onSetTotalTvl,
  selectPool,
} from 'model/main.controller'
import { QueryParams } from 'constant'
import { useCommunityPools } from 'hooks/pools/useCommunityPools'
import { useListPoolAddress } from 'hooks/pools/useListPoolAddress'
import PoolCardAction from '../components/poolCardAction'
import { useTotalPoolTvl } from 'hooks/useTotalPoolTvl'

const {
  route: { myRoute },
} = configs

const CommunityPools = () => {
  const history = useHistory()
  const dispatch = useDispatch<AppDispatch>()
  const { selectedPoolAddress } = useSelector((state: AppState) => state.main)
  const { communityPools } = useCommunityPools()
  const { listPoolAddress } = useListPoolAddress(communityPools)
  const totalTvl = useTotalPoolTvl(listPoolAddress)

  const setActivePoolAddress = useCallback(
    async (address: string) => {
      await dispatch(selectPool(address))
      await dispatch(handleOpenDrawer(false))
      return history.push(
        `${myRoute}/details?${QueryParams.address}=${address}`,
      )
    },
    [dispatch, history],
  )

  useEffect(() => {
    dispatch(onSetTotalTvl(totalTvl))
  }, [dispatch, totalTvl])

  return (
    <Row gutter={[12, 12]} justify="center">
      {!listPoolAddress.length ? (
        <Col>
          <Empty />
        </Col>
      ) : (
        listPoolAddress.map((poolAddress) => {
          return (
            <Col id={poolAddress} span={24} key={poolAddress}>
              <LazyLoad height={78} overflow>
                <PoolCard
                  poolAddress={poolAddress}
                  action={<PoolCardAction poolAddress={poolAddress} />}
                  onClick={setActivePoolAddress}
                  selected={selectedPoolAddress === poolAddress}
                  apy
                />
              </LazyLoad>
            </Col>
          )
        })
      )}
    </Row>
  )
}

export default CommunityPools
