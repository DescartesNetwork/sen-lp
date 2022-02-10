import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Col, RadioChangeEvent, Row, Table } from 'antd'
import SelectDay, { DayOptions } from '../selectDay'

import { AppState } from 'app/model'
import { fetchWithdrawHistories } from 'app/model/history.controller'
import { HISTORY_COLUMNS } from './columns'
import { notifyError } from 'app/helper'

const WithDrawHistory = () => {
  const [filterOption, setFilterOption] = useState(DayOptions.SEVEN_DAYS)
  const [isLoading, setIsLoading] = useState(false)
  const {
    history: { withdrawHistories },
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch()

  const fetchHistory = useCallback(async () => {
    setIsLoading(true)
    try {
      await dispatch(
        fetchWithdrawHistories({
          days: filterOption,
        }),
      )
    } catch (er) {
      notifyError(er)
    } finally {
      setIsLoading(false)
    }
  }, [dispatch, filterOption])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const onSelect = (e: RadioChangeEvent) => {
    setFilterOption(e.target.value)
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
