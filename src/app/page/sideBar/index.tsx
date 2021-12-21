import { Card, Tabs } from 'antd'
import AllPools from './allPools'
import MyPools from './deposited'
import NewPool from './newPool'

const SideBar = () => {
  return (
    <Card className="side-bar" bodyStyle={{ padding: 0 }} bordered={false}>
      <Tabs
        defaultActiveKey="all-pools"
        tabBarExtraContent={<NewPool />}
        style={{ padding: 16 }}
      >
        <Tabs.TabPane key="all-pools" tab="All pools">
          <AllPools />
        </Tabs.TabPane>
        <Tabs.TabPane key="deposited" tab="Deposited">
          <MyPools />
        </Tabs.TabPane>
      </Tabs>
    </Card>
  )
}

export default SideBar
