import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'

import { Button, Col, Row } from 'antd'
import PoolDetailsHeader from 'app/page/poolDetails/poolDetailsHeader'
import Volume24h from 'app/page/poolDetails/volume24h'
import IonIcon from 'shared/antd/ionicon'
import TotalValueLocked from 'app/page/poolDetails/totalValueLocked'

import { AppDispatch, AppState } from 'app/model'
import { selectPool } from 'app/model/main.controller'

import configs from 'app/configs'
import DepositForm from './depositForm'
import { QueryParams } from 'app/constant'

const {
  route: { myRoute },
} = configs

const PoolDetails = () => {
  const dispatch = useDispatch<AppDispatch>()
  const history = useHistory()
  const {
    main: { selectedPoolAddress },
  } = useSelector((state: AppState) => state)
  const location = useLocation()
  const query = useMemo(() => new URLSearchParams(location.search), [location])
  const queryPoolAddress = query.get(QueryParams.address) || ''

  const onBack = useCallback(async () => {
    await dispatch(selectPool(''))
    return await history.push(myRoute)
  }, [dispatch, history])

  const poolAddress = queryPoolAddress || selectedPoolAddress

  return (
    <Row gutter={[24, 24]} justify="center">
      <Col xs={24} md={20} lg={18}>
        <Row gutter={[16, 16]}>
          <Col>
            <Button
              type="text"
              icon={<IonIcon name="arrow-back-outline" />}
              onClick={onBack}
              style={{ margin: -12 }}
            >
              Back
            </Button>
          </Col>
          <Col span={24}>
            <PoolDetailsHeader poolAddress={poolAddress} />
          </Col>
          <Col xs={24} md={12}>
            <Row gutter={[16, 16]} style={{ height: '100%' }}>
              <Col span={24}>
                <TotalValueLocked />
              </Col>
              <Col span={24}>
                <Volume24h />
              </Col>
            </Row>
          </Col>
          <Col xs={24} md={12}>
            <DepositForm poolAddress={poolAddress} />
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default PoolDetails
