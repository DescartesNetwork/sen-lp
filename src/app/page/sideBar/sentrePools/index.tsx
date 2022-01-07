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
import { useTVLSortPool } from 'app/hooks/useTVLSortPool'

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

  const sortedPools = useTVLSortPool(listSentrePools)

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
    if (!sortedPools.length || selectedPoolAddress) return
    onInit(sortedPools[0].address)
  }, [sortedPools, onInit, selectedPoolAddress])

  return (
    <Row gutter={[16, 16]}>
      {sortedPools.map(({ address }, idx) => {
        return (
          <Col span={24} key={address + idx}>
            <PoolCard
              poolAddress={address}
              action={
                <Button
                  type="text"
                  onClick={(e: MouseEvent<HTMLButtonElement>) => {
                    e.stopPropagation()
                    setActivePoolAddress(address)
                  }}
                  icon={
                    <IonIcon
                      name="arrow-forward-outline"
                      style={{ fontSize: 12, color: '#7A7B85' }}
                    />
                  }
                />
              }
              onClick={() => setActivePoolAddress(address)}
              selected={selectedPoolAddress === address}
            />
          </Col>
        )
      })}
    </Row>
  )
}

export default SentrePools
