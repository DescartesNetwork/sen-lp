import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { usePool } from '@senhub/providers'

import { Col, RadioChangeEvent, Row, Table } from 'antd'
import SelectDay, { DayOptions } from '../selectDay'

import { fetchDepositHistory } from 'app/model/history.controller'
import { AppState } from 'app/model'
import { HISTORY_DEPOSIT_COLUMNS } from './columns'
import { notifyError } from 'app/helper'

const DepositHistory = () => {
  const [pastDays, setPastDays] = useState(DayOptions.SEVEN_DAYS)
  const [isLoading, setIsLoading] = useState(false)
  const {
    history: { depositHistories },
    main: { selectedPoolAddress: poolAddress },
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch()
  const {
    pools: { [poolAddress]: poolData },
  } = usePool()

  const fetchHistory = useCallback(async () => {
    setIsLoading(true)
    try {
      await dispatch(fetchDepositHistory({ days: pastDays, poolData }))
    } catch (er) {
      notifyError(er)
    } finally {
      setIsLoading(false)
    }
  }, [dispatch, pastDays, poolData])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const onSelect = (e: RadioChangeEvent) => {
    setPastDays(e.target.value)
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <SelectDay onChange={onSelect} />
      </Col>
      <Col span={24}>
        <Table
          pagination={false}
          rowClassName={(record, index) => (index % 2 ? 'odd-row' : 'even-row')}
          dataSource={depositHistories}
          columns={HISTORY_DEPOSIT_COLUMNS}
          rowKey={(record) => record.time}
          loading={isLoading}
          scroll={{ y: 300 }}
        />
      </Col>
    </Row>
  )
}

export default DepositHistory
