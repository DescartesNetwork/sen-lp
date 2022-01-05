import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Row, Col, Button } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import ListMyPools from './listMyPools'

import { handleOpenDrawer, selectPool } from 'app/model/main.controller'
import { AppDispatch, AppState } from 'app/model'

const YourPools = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    main: { selectedPoolAddress },
  } = useSelector((state: AppState) => state)

  const setActiveAddress = useCallback(
    (poolAddress: string) => {
      dispatch(selectPool(poolAddress))
      dispatch(handleOpenDrawer(false))
    },
    [dispatch],
  )
  const action = useCallback(
    (poolAddress) => (
      <Button
        type="text"
        onClick={() => setActiveAddress(poolAddress)}
        size="small"
        icon={
          <IonIcon
            name="arrow-forward-outline"
            style={{ fontSize: 12, color: '#7A7B85' }}
          />
        }
      />
    ),
    [setActiveAddress],
  )

  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <ListMyPools
          action={action}
          setActiveAddress={setActiveAddress}
          selectedPoolAddress={selectedPoolAddress}
        />
      </Col>
    </Row>
  )
}

export default YourPools
