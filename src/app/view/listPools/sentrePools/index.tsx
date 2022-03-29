import { useCallback, MouseEvent, useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'

import { Button, Col, Empty, Row } from 'antd'
import PoolCard from '../components/poolCard'
import IonIcon from 'shared/antd/ionicon'

import configs from 'app/configs'
import { onSetTotalTvl, selectPool } from 'app/model/main.controller'
import { AppState } from 'app/model'
import { QueryParams } from 'app/constant'
import { useSentrePools } from 'app/hooks/pools/useSentrePools'
import { useListPoolAddress } from 'app/hooks/pools/useListPoolAddress'
import { useTotalPoolTvl } from 'app/hooks/useTotalPoolTvl'

const {
  route: { myRoute },
} = configs

const SentrePools = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const {
    main: { selectedPoolAddress },
  } = useSelector((state: AppState) => state)
  const location = useLocation()

  const { sentrePools } = useSentrePools()
  const { listPoolAddress } = useListPoolAddress(sentrePools)
  const totalTvl = useTotalPoolTvl(listPoolAddress)

  const query = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  )

  const setActivePoolAddress = useCallback(
    async (address: string) => {
      await dispatch(selectPool(address))
      query.set(QueryParams.address, address)
      return history.push(`${myRoute}/details?${query.toString()}`)
    },
    [dispatch, history, query],
  )

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
      {listPoolAddress.map((poolAddress, idx) => {
        return (
          <Col span={24} key={poolAddress + idx}>
            <PoolCard
              poolAddress={poolAddress}
              action={
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
              }
              onClick={() => setActivePoolAddress(poolAddress)}
              selected={selectedPoolAddress === poolAddress}
              apy
            />
          </Col>
        )
      })}
    </Row>
  )
}

export default SentrePools
