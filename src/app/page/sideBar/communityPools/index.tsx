import { MouseEvent, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { Button, Col, Row } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import ListAllPools from './listPools'

import configs from 'app/configs'
import { AppDispatch, AppState } from 'app/model'
import { handleOpenDrawer, selectPool } from 'app/model/main.controller'
import { PoolTabs, QueryParams } from 'app/constant'

const {
  route: { myRoute },
} = configs

const CommunityPools = () => {
  const history = useHistory()
  const dispatch = useDispatch<AppDispatch>()
  const { selectedPoolAddress } = useSelector((state: AppState) => state.main)

  const setActivePoolAddress = useCallback(
    async (address: string) => {
      await dispatch(selectPool(address))
      await dispatch(handleOpenDrawer(false))
      return history.push(
        `${myRoute}?${QueryParams.address}=${address}&${QueryParams.category}=${PoolTabs.Community}`,
      )
    },
    [dispatch, history],
  )

  const action = useCallback(
    (poolAddress) => {
      return (
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
      )
    },
    [setActivePoolAddress],
  )

  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <ListAllPools
          action={action}
          selectedPoolAddress={selectedPoolAddress}
          onClick={setActivePoolAddress}
        />
      </Col>
    </Row>
  )
}

export default CommunityPools
