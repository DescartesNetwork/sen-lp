import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import LazyLoad from '@senswap/react-lazyload'

import { Row, Col, Button, Empty } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { AppState } from 'app/model'
import { handleOpenDrawer, selectPool } from 'app/model/main.controller'
import { PoolTabs, QueryParams } from 'app/constant'
import configs from 'app/configs'
import { useCallback, useMemo } from 'react'
import PoolCard from '../components/poolCard'
import { useDepositedPools } from 'app/hooks/pools/useDepositedPools'
import { useListPoolAddress } from 'app/hooks/pools/useListPoolAddress'

const {
  route: { myRoute },
} = configs

const DepositedPools = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const query = useMemo(() => new URLSearchParams(location.search), [location])
  const {
    main: { selectedPoolAddress },
  } = useSelector((state: AppState) => state)
  const { depositedPools } = useDepositedPools()
  const { listPoolAddress } = useListPoolAddress(depositedPools)

  const setActiveAddress = useCallback(
    (address: string) => {
      dispatch(selectPool(address))
      dispatch(handleOpenDrawer(false))
      query.set(QueryParams.address, address)
      query.set(QueryParams.category, PoolTabs.Sentre)
      return history.push(`${myRoute}?${query.toString()}`)
    },
    [dispatch, history, query],
  )

  const action = useCallback(
    (poolAddress: string) => {
      return (
        <Button
          type="text"
          onClick={() => setActiveAddress(poolAddress)}
          icon={
            <IonIcon
              name="arrow-forward-outline"
              style={{ fontSize: 12, color: '#7A7B85' }}
            />
          }
        />
      )
    },
    [setActiveAddress],
  )

  return (
    <Row gutter={[12, 12]} justify="center">
      {!listPoolAddress.length ? (
        <Col>
          <Empty />
        </Col>
      ) : (
        listPoolAddress.map((poolAddress, i) => {
          return (
            <Col span={24} key={poolAddress}>
              <LazyLoad height={78} overflow>
                <PoolCard
                  poolAddress={poolAddress}
                  action={action(poolAddress)}
                  onClick={() => setActiveAddress(poolAddress)}
                  selected={selectedPoolAddress === poolAddress}
                  myLp
                />
              </LazyLoad>
            </Col>
          )
        })
      )}
    </Row>
  )
}

export default DepositedPools
