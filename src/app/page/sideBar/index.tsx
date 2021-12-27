import { Tabs } from 'antd'
import AllPools from './allPools'
import YourPools from './yourPools'
import NewPool from './newPool'
import SentrePools from './sentrePools'
import DepositedPools from './depositedPools'

const SideBar = () => {
  return (
    <Tabs
      defaultActiveKey="sentre-pools"
      tabBarExtraContent={<NewPool />}
      style={{ padding: 16 }}
    >
      <Tabs.TabPane key="sentre-pools" tab="Sentre Pools">
        <SentrePools />
      </Tabs.TabPane>
      <Tabs.TabPane key="all-pools" tab="Community Pools">
        <AllPools />
      </Tabs.TabPane>
      <Tabs.TabPane key="deposited" tab="Deposited">
        <DepositedPools />
      </Tabs.TabPane>
      <Tabs.TabPane key="your-pools" tab="Your Pools">
        <YourPools />
      </Tabs.TabPane>
    </Tabs>
  )
}

export default SideBar
