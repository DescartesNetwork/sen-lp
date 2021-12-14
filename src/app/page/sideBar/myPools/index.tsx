import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Row, Col, Button } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import ListMyPools from './listMyPools'

import { handleOpenDrawer, selectPool } from 'app/model/main.controller'
import { AppDispatch, AppState } from 'app/model'

const MyPools = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { selectedPoolAddress } = useSelector((state: AppState) => state.main)

  const setActiveAddress = useCallback(
    (lptAddress: string, poolAddress: string) => {
      dispatch(selectPool(poolAddress))
      dispatch(handleOpenDrawer(false))
    },
    [dispatch],
  )
  const action = useCallback(
    (lptAddress, poolAddress) => (
      <Button
        type="text"
        onClick={() => setActiveAddress(lptAddress, poolAddress)}
        icon={<IonIcon name="arrow-forward-outline" />}
      />
    ),
    [setActiveAddress],
  )

  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <ListMyPools
          action={action}
          selectedPoolAddress={selectedPoolAddress}
          onClick={setActiveAddress}
        />
      </Col>
    </Row>
  )
}

export default MyPools
