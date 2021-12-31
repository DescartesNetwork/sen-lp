import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LazyLoad from '@senswap/react-lazyload'

import { Row, Col, Button } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import LPTCard from '../components/lptCard'

import { AppState } from 'app/model'
import { handleOpenDrawer, selectPool } from 'app/model/main.controller'

const DepositedPools = () => {
  const dispatch = useDispatch()
  const lpts = useSelector((state: AppState) => state.lpts)
  const {
    main: { selectedPoolAddress },
  } = useSelector((state: AppState) => state)

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
      {Object.keys(lpts).map((lptAddress, i) => {
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
