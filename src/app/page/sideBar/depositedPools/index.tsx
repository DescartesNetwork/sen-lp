import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import LazyLoad from '@senswap/react-lazyload'

import { Row, Col, Button, Empty } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import LPTCard from '../components/lptCard'

import { AppState } from 'app/model'
import { handleOpenDrawer, selectPool } from 'app/model/main.controller'
import { PoolTabs, QueryParams } from 'app/constant'
import configs from 'app/configs'

const {
  route: { myRoute },
} = configs

const DepositedPools = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const lpts = useSelector((state: AppState) => state.lpts)
  const {
    main: { selectedPoolAddress },
  } = useSelector((state: AppState) => state)
  const query = new URLSearchParams(useLocation().search)

  const setActiveAddress = (address: string) => {
    dispatch(selectPool(address))
    dispatch(handleOpenDrawer(false))
    query.set(QueryParams.address, address)
    query.set(QueryParams.category, PoolTabs.Sentre)
    return history.push(`${myRoute}?${query.toString()}`)
  }

  const action = (poolAddress: string) => {
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
  }

  return (
    <Row gutter={[12, 12]} justify="center">
      {!Object.keys(lpts).length && (
        <Col>
          <Empty />
        </Col>
      )}
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
