import { Tabs } from 'antd'
import AllPools from './allPools'
import YourPools from './yourPools'
import NewPool from './newPool'
import SentrePools from './sentrePools'
import DepositedPools from './depositedPools'

const SideBar = () => {
  return (
    <Tabs
      defaultActiveKey="all-pools"
      tabBarExtraContent={<NewPool />}
      style={{ padding: 16 }}
    >
      <Tabs.TabPane key="sentre-pools" tab="Sentre Pools">
        <SentrePools />
      </Tabs.TabPane>
      <Tabs.TabPane key="all-pools" tab="Community pools">
        <AllPools />
      </Tabs.TabPane>
      <Tabs.TabPane key="deposited" tab="Deposited">
        <DepositedPools />
      </Tabs.TabPane>
      <Tabs.TabPane key="your-pools" tab="Your pools">
        <YourPools />
      </Tabs.TabPane>
    </Tabs>
  )
}

export default SideBar
