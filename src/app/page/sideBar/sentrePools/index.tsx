import { useCallback, useEffect, MouseEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'
import { useHistory, useLocation } from 'react-router-dom'

import { Button, Col, Empty, Row } from 'antd'
import PoolCard from '../components/poolCard'
import IonIcon from 'shared/antd/ionicon'

import configs from 'app/configs'
import { usePool } from 'senhub/providers'
import { handleOpenDrawer, selectPool } from 'app/model/main.controller'
import { AppState } from 'app/model'

const {
  sol: { senOwner },
  route: { myRoute },
} = configs

const SentrePools = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const {
    main: { selectedPoolAddress },
    settings: { showArchived },
  } = useSelector((state: AppState) => state)
  const { pools } = usePool()
  const query = new URLSearchParams(useLocation().search)
  const poolAddress = query.get('poolAddress') || ''

  const listSentrePools = Object.keys(pools)
    .filter((poolAddr) => {
      const { owner } = pools[poolAddr] || {}
      return senOwner.includes(owner)
    })
    .filter((poolAddr) => {
      const { reserve_a, reserve_b } = pools[poolAddr] || {}
      const empty = !reserve_a || !reserve_b
      return showArchived || !empty
    })

  const setActivePoolAddress = useCallback(
    async (address: string) => {
      await dispatch(selectPool(address))
      await dispatch(handleOpenDrawer(false))
      return history.push(`${myRoute}?poolAddress=${address}`)
    },
    [dispatch, history],
  )

  const onInit = useCallback(
    (address) => {
      const addr = account.isAddress(poolAddress) ? poolAddress : address
      return dispatch(selectPool(addr))
    },
    [dispatch, poolAddress],
  )

  useEffect(() => {
    if (!listSentrePools.length || selectedPoolAddress) return
    onInit(listSentrePools[0])
  }, [listSentrePools, onInit, selectedPoolAddress])

  return (
    <Row gutter={[12, 12]} justify="center">
      {!listSentrePools.length && (
        <Col>
          <Empty />
        </Col>
      )}
      {listSentrePools.map((poolAddress, idx) => {
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
            />
          </Col>
        )
      })}
    </Row>
  )
}

export default SentrePools
