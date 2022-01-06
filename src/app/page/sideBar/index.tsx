import { useMemo, useState } from 'react'

import { Col, Row, Select } from 'antd'
import CommunityPools from './communityPools'
import YourPools from './yourPools'
import NewPool from './newPool'
import SentrePools from './sentrePools'
import DepositedPools from './depositedPools'
import SettingsButton from 'app/components/settingsButton'

const SideBar = () => {
  const [selectPools, setSelectPools] = useState('sentre-pools')
  const handleChange = (value: string) => {
    setSelectPools(value)
  }

  const PoolsSelected = useMemo(() => {
    if (selectPools === 'sentre-pools') return <SentrePools />
    if (selectPools === 'community-pools') return <CommunityPools />
    if (selectPools === 'deposited-pools') return <DepositedPools />
    return <YourPools />
  }, [selectPools])

  return (
    <Row gutter={[12, 24]} className="side-bar">
      <Col span={24}>
        <Row gutter={[8, 8]} wrap={false}>
          <Col>
            <SettingsButton />
          </Col>
          <Col flex="auto">
            <Select
              defaultValue="sentre-pools"
              onChange={handleChange}
              className="header-sidebar"
            >
              <Select.Option value="sentre-pools">Sentre pools</Select.Option>
              <Select.Option value="deposited-pools">
                Deposited pools
              </Select.Option>
              <Select.Option value="your-pools">Your pools</Select.Option>
              <Select.Option value="community-pools">
                Community pools
              </Select.Option>
            </Select>
          </Col>
          <Col>
            <NewPool />
          </Col>
        </Row>
      </Col>
      <Col span={24} className="body-sidebar scrollbar">
        {PoolsSelected}
      </Col>
    </Row>
  )
}

export default SideBar
