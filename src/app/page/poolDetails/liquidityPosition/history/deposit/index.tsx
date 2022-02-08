import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Col, RadioChangeEvent, Row, Table } from 'antd'
import FilterHistory from '../filterHistory'

import { fetchDepositHistory } from 'app/model/history.controller'
import { AppState } from 'app/model'
import { HISTORY_DEPOSIT_COLUMN } from './column'

const DepositHistory = () => {
  const [filterOption, setFilterOption] = useState(7)
  const [isLoading, setIsLoading] = useState(false)

  const {
    history: { depositHistories },
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch()

  const fetchHistory = useCallback(async () => {
    setIsLoading(true)
    try {
      await dispatch(
        fetchDepositHistory({
          days: filterOption,
        }),
      )
    } catch (er) {
      console.error(er)
    } finally {
      setIsLoading(false)
    }
  }, [dispatch, filterOption])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const onFilter = (e: RadioChangeEvent) => {
    setFilterOption(e.target.value)
  }

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <FilterHistory onChange={onFilter} />
      </Col>
      <Col span={24}>
        <Table
          pagination={false}
          rowClassName={(record, index) => (index % 2 ? 'odd-row' : 'even-row')}
          dataSource={depositHistories}
          columns={HISTORY_DEPOSIT_COLUMN}
          rowKey={(record) => record.time}
          loading={isLoading}
          scroll={{ y: 300 }}
        />
      </Col>
    </Row>
  )
}

export default DepositHistory
