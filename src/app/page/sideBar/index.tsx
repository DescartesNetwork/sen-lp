import { useState } from 'react'

import { Col, Row, Select } from 'antd'
import CommunityPools from './communityPools'
import YourPools from './yourPools'
import NewPool from './newPool'
import SentrePools from './sentrePools'
import DepositedPools from './depositedPools'

const SideBar = () => {
  const [selectPools, setSelectPools] = useState('sentre-pools')
  const handleChange = (value: string) => {
    setSelectPools(value)
  }

  const PoolsSelected = () => {
    if (selectPools === 'sentre-pools') return <SentrePools />
    else if (selectPools === 'community-pools') return <CommunityPools />
    else if (selectPools === 'deposited-pools') return <DepositedPools />
    else return <YourPools />
  }
  return (
    <Row gutter={[12, 24]} className="side-bar scrollbar">
      <Col flex="auto">
        <Select
          defaultValue="sentre-pools"
          onChange={handleChange}
          className="header-sidebar"
        >
          <Select.Option value="sentre-pools">Sentre pools</Select.Option>
          <Select.Option value="deposited-pools">Deposited pools</Select.Option>
          <Select.Option value="your-pools">Your pools</Select.Option>
          <Select.Option value="community-pools">Community pools</Select.Option>
        </Select>
      </Col>
      <Col>
        <NewPool />
      </Col>
      <Col span={24}>
        <PoolsSelected />
      </Col>
    </Row>
  )
}

export default SideBar
