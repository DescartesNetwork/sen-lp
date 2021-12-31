import { Space, Tabs } from 'antd'
import CommunityPools from './communityPools'
import YourPools from './yourPools'
import NewPool from './newPool'
import SentrePools from './sentrePools'
import DepositedPools from './depositedPools'
import SettingsButton from 'app/components/settingsButton'

const SideBar = ({
  setActiveTab = () => {},
  activeTab = 'sentre-pools',
}: {
  setActiveTab?: (activeTab: string) => void
  activeTab?: string
}) => {
  return (
    <Tabs
      activeKey={activeTab}
      onChange={setActiveTab}
      tabBarExtraContent={
        <Space>
          <SettingsButton />
          <NewPool />
        </Space>
      }
      style={{
        maxHeight: 'calc(100vh - 112px)',
        padding: '16px 24px',
        marginBottom: 16,
      }}
      className="scrollbar"
    >
      <Tabs.TabPane key="sentre-pools" tab="Sentre Pools">
        <SentrePools />
      </Tabs.TabPane>
      <Tabs.TabPane key="community-pools" tab="Community Pools">
        <CommunityPools />
      </Tabs.TabPane>
      <Tabs.TabPane key="deposited" tab="Deposited Pools">
        <DepositedPools />
      </Tabs.TabPane>
      <Tabs.TabPane key="your-pools" tab="Your Pools">
        <YourPools />
      </Tabs.TabPane>
    </Tabs>
  )
}

export default SideBar
