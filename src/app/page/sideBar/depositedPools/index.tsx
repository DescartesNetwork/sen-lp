import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LazyLoad from '@senswap/react-lazyload'

import { Row, Col, Button } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import PoolCard from '../components/poolCard'

import { AppState } from 'app/model'
import { handleOpenDrawer, selectPool } from 'app/model/main.controller'
import { useTVLSortPool } from 'app/hooks/useTVLSortPool'
import { usePool } from 'senhub/providers'

const DepositedPools = () => {
  const dispatch = useDispatch()
  const lpts = useSelector((state: AppState) => state.lpts)
  const { selectedPoolAddress } = useSelector((state: AppState) => state.main)
  const { pools } = usePool()

  const lptAddresses = Object.keys(lpts).filter((lptAddress) => {
    const { pool: poolAddress, amount } = lpts[lptAddress]
    if (amount !== BigInt(0)) return pools?.[poolAddress]
    return null
  })

  let lptPoolMap: string[] = []

  const poolAddresses = lptAddresses.map((address) => {
    const { pool: poolAddress } = lpts?.[address]
    lptPoolMap.push(address)
    return poolAddress
  })
  const poolSortByTvl = useTVLSortPool(poolAddresses)
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
      {poolSortByTvl.map(({ address: poolAddress }, i) => {
        return (
          <Col span={24} key={poolAddress + i}>
            <LazyLoad height={78} overflow>
              {/* <LPTCard
                data={lpts[address]}
                action={action(poolAddress)}
                onClick={() => setActiveAddress(poolAddress)}
                selected={selectedPoolAddress === poolAddress}
              /> */}
              <PoolCard
                poolAddress={poolAddress}
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
