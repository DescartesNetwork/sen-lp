import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { usePool } from '@sentre/senhub'

import { Col, RadioChangeEvent, Row, Table } from 'antd'
import SelectDay, { DayOptions } from '../selectDay'

import { AppState } from 'model'
import { fetchWithdrawHistories } from 'model/history.controller'
import { HISTORY_COLUMNS } from './columns'
import { notifyError } from 'helper'

const WithDrawHistory = () => {
  const [pastDays, setPastDays] = useState(DayOptions.SEVEN_DAYS)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const {
    history: { withdrawHistories },
    main: { selectedPoolAddress: poolAddress },
  } = useSelector((state: AppState) => state)
  const {
    pools: { [poolAddress]: poolData },
  } = usePool()

  const fetchHistory = useCallback(async () => {
    setIsLoading(true)
    try {
      await dispatch(fetchWithdrawHistories({ days: pastDays, poolData }))
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
          dataSource={withdrawHistories}
          columns={HISTORY_COLUMNS}
          rowKey={(record) => record.time}
          loading={isLoading}
          scroll={{ y: 300 }}
        />
      </Col>
    </Row>
  )
}

export default WithDrawHistory
