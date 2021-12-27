import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button, Col, Row } from 'antd'
import ItemPool from '../components/itemPool'
import IonIcon from 'shared/antd/ionicon'

import configs from 'app/configs'
import { usePool } from 'senhub/providers'
import { handleOpenDrawer, selectPool } from 'app/model/main.controller'
import { AppState } from 'app/model'

const SentrePools = () => {
  const dispatch = useDispatch()
  const { selectedPoolAddress } = useSelector((state: AppState) => state.main)
  const { pools } = usePool()
  const senOwner = configs.sol.senOwner

  const listSentrePools = Object.keys(pools).filter((poolAddr) => {
    const poolData = pools?.[poolAddr]
    const { owner } = poolData
    return senOwner.includes(owner)
  })

  const setActiveAddress = useCallback(
    (address: string) => {
      dispatch(selectPool(address))
      dispatch(handleOpenDrawer(false))
    },
    [dispatch],
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

  return (
    <Row gutter={[16, 16]}>
      {listSentrePools.map((poolAddress, idx) => {
        return (
          <Col span={24} key={poolAddress + idx}>
            <ItemPool
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
