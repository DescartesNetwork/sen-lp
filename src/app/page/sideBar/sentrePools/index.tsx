import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account } from '@senswap/sen-js'
import { useHistory, useLocation } from 'react-router-dom'

import { Button, Col, Row } from 'antd'
import PoolCard from '../components/poolCard'
import IonIcon from 'shared/antd/ionicon'

import configs from 'app/configs'
import { usePool } from 'senhub/providers'
import { handleOpenDrawer, selectPool } from 'app/model/main.controller'
import { AppState } from 'app/model'

const {
  sol: { senOwner },
} = configs

const SentrePools = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { selectedPoolAddress } = useSelector((state: AppState) => state.main)
  const { pools } = usePool()
  const query = new URLSearchParams(useLocation().search)
  const poolAddress = query.get('poolAddress') || ''

  const listSentrePools = Object.keys(pools).filter((poolAddr) => {
    const poolData = pools?.[poolAddr]
    const { owner } = poolData
    return senOwner.includes(owner)
  })

  const setActiveAddress = useCallback(
    (address: string) => {
      dispatch(selectPool(address))
      dispatch(handleOpenDrawer(false))
      history.push('/app/senhub?poolAddress=' + address)
    },
    [dispatch, history],
  )

  const action = useCallback(
    (poolAddress) => {
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
    <Row gutter={[16, 16]}>
      {listSentrePools.map((poolAddress, idx) => {
        return (
          <Col span={24} key={poolAddress + idx}>
            <PoolCard
              poolAddress={poolAddress}
              action={action(poolAddress)}
              onClick={() => setActiveAddress(poolAddress)}
              selected={selectedPoolAddress === poolAddress}
            />
          </Col>
        )
      })}
    </Row>
  )
}

export default SentrePools
