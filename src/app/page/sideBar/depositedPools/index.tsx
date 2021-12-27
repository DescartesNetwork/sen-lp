import { useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Row, Col, Button } from 'antd'
import LazyLoad from 'react-lazyload'

import { AppState } from 'app/model'
import { usePool } from 'senhub/providers'
import { handleOpenDrawer, selectPool } from 'app/model/main.controller'
import IonIcon from 'shared/antd/ionicon'
import LPTCard from '../components/lptCard'

const DepositedPools = () => {
  const dispatch = useDispatch()
  const lpts = useSelector((state: AppState) => state.lpts)
  const { selectedPoolAddress } = useSelector((state: AppState) => state.main)
  const { pools } = usePool()

  const lptAddresses = useMemo(
    () =>
      Object.keys(lpts).filter((lptAddress) => {
        const { pool: poolAddress, amount } = lpts[lptAddress]
        if (amount !== BigInt(0)) return pools?.[poolAddress]
        return null
      }),
    [pools, lpts],
  )

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
    <Row gutter={[12, 12]}>
      {lptAddresses.map((lptAddress, i) => {
        const { pool: poolAddress } = lpts[lptAddress]
        return (
          <Col span={24} key={lptAddress + i}>
            <LazyLoad height={78} overflow>
              <LPTCard
                data={lpts[lptAddress]}
                action={action(poolAddress)}
                onClick={() => setActiveAddress(poolAddress)}
                selected={selectedPoolAddress === poolAddress}
              />
            </LazyLoad>
          </Col>
        )
      })}
    </Row>
  )
}

export default DepositedPools
