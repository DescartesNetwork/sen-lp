import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { account } from '@senswap/sen-js'

import { Tabs } from 'antd'
import CommunityPools from './communityPools'
import YourPools from './yourPools'
import NewPool from './newPool'
import SentrePools from './sentrePools'
import DepositedPools from './depositedPools'

import { usePool } from 'senhub/providers'
import configs from 'app/configs'

const SideBar = () => {
  const { pools } = usePool()
  const [defaultTab, setDefaultTab] = useState('sentre-pools')

  const query = new URLSearchParams(useLocation().search)
  const poolAddress = query.get('poolAddress') || ''
  const senOwner = configs.sol.senOwner

  const listSentrePools = Object.keys(pools).filter((poolAddr) => {
    const poolData = pools?.[poolAddr]
    const { owner } = poolData
    return senOwner.includes(owner)
  })

  useEffect(() => {
    if (
      account.isAddress(poolAddress) &&
      !listSentrePools?.includes(poolAddress)
    ) {
      setDefaultTab('community-pools')
    }
  }, [])

  return (
    <Tabs
      activeKey={defaultTab}
      tabBarExtraContent={<NewPool />}
      onChange={setDefaultTab}
      style={{ maxHeight: 'calc(100vh - 112px)', padding: '16px 24px' }}
      className="scrollbar"
    >
      <Tabs.TabPane key="sentre-pools" tab="Sentre Pools">
        <SentrePools />
      </Tabs.TabPane>
      <Tabs.TabPane key="community-pools" tab="Community Pools">
        <CommunityPools />
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
