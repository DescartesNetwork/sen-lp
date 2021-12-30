import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { account } from '@senswap/sen-js'

import { Button, Col, Row } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import ListAllPools from './listPools'

import { AppDispatch, AppState } from 'app/model'
import { handleOpenDrawer, selectPool } from 'app/model/main.controller'

const CommunityPools = () => {
  const history = useHistory()
  const dispatch = useDispatch<AppDispatch>()
  const { selectedPoolAddress } = useSelector((state: AppState) => state.main)
  const query = new URLSearchParams(useLocation().search)
  const poolAddress = query.get('poolAddress') || ''

  const onInit = useCallback(
    (address) => {
      const addr = account.isAddress(poolAddress) ? poolAddress : address
      return dispatch(selectPool(addr))
    },
    [dispatch, poolAddress],
  )
  const setActiveAddress = useCallback(
    (address: string) => {
      dispatch(selectPool(address))
      dispatch(handleOpenDrawer(false))
      history.push('/app/senhub?poolAddress=' + address)
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
      <Col span={24}>
        <ListAllPools
          action={action}
          selectedPoolAddress={selectedPoolAddress}
          onInit={onInit}
          onClick={setActiveAddress}
        />
      </Col>
    </Row>
  )
}

export default CommunityPools
