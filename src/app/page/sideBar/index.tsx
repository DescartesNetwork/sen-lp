import { Tabs } from 'antd'
import AllPools from './allPools'
import MyPools from './deposited'
import NewPool from './newPool'

const SideBar = () => {
  return (
    <Tabs
      defaultActiveKey="all-pools"
      tabBarExtraContent={<NewPool />}
      style={{ padding: 16 }}
    >
      <Tabs.TabPane key="all-pools" tab="All pools">
        <AllPools />
      </Tabs.TabPane>
      <Tabs.TabPane key="your-pools" tab="Your pools">
        <MyPools />
      </Tabs.TabPane>
    </Tabs>
  )
}

export default SideBar
