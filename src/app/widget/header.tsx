import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { Col, Select, Row, Typography } from 'antd'

import { AppDispatch } from 'app/model'
import { selectCategoryPool } from 'app/model/main.controller'
import { PoolTabs } from 'app/constant'

const Header = () => {
  const dispatch = useDispatch<AppDispatch>()

  const handleChange = (value: string) => {
    dispatch(selectCategoryPool(value))
  }

  useEffect(() => {
    dispatch(selectCategoryPool(PoolTabs.Sentre))
  }, [dispatch])

  return (
    <Row gutter={24} align="middle" className="header-widget">
      <Col flex="auto">
        <Typography.Text style={{ color: '#e9e9eb ' }}>
          Pools list by
        </Typography.Text>
      </Col>
      <Col>
        <Select
          defaultValue={PoolTabs.Sentre}
          onChange={handleChange}
          className="header-select"
        >
          <Select.Option value={PoolTabs.Sentre}>Sentre</Select.Option>
          <Select.Option value={PoolTabs.Community}>Community</Select.Option>
          <Select.Option value={PoolTabs.Deposited}>Deposited</Select.Option>
          <Select.Option value={PoolTabs.YourPools}>Your pools</Select.Option>
        </Select>
      </Col>
    </Row>
  )
}

export default Header
