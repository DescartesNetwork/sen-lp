import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { Col, Select, Row, Typography } from 'antd'

import { AppDispatch } from 'app/model'
import { selectCategoryPool } from 'app/model/main.controller'

const Header = () => {
  const dispatch = useDispatch<AppDispatch>()

  const handleChange = (value: string) => {
    dispatch(selectCategoryPool(value))
  }

  useEffect(() => {
    dispatch(selectCategoryPool('hot'))
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
          defaultValue="hot"
          onChange={handleChange}
          className="header-select"
        >
          <Select.Option value="hot">Hot</Select.Option>
          <Select.Option value="deposited">Deposited</Select.Option>
          <Select.Option value="your-pools">Your pools</Select.Option>
        </Select>
      </Col>
    </Row>
  )
}

export default Header
