import { ReactElement, Fragment, useMemo } from 'react'
import { useSelector } from 'react-redux'
import LazyLoad from '@senswap/react-lazyload'
import { usePool, useWallet } from '@senhub/providers'

import { Row, Col, Empty } from 'antd'
import ItemLPT from './itemLPT'

import { AppState } from 'app/model'
import { PoolTabs } from 'app/constant'

const LptsPools = ({
  selectedTab,
  onClick = () => {},
  action = () => <Fragment />,
}: {
  selectedTab: string
  onClick?: (poolAddress: string) => void
  action?: (lptAddress: string, poolAddress: string) => ReactElement
}) => {
  const lpts = useSelector((state: AppState) => state.lpts)
  const { pools } = usePool()
  const {
    wallet: { address: walletAddress },
  } = useWallet()

  const lptAddresses = useMemo(
    () =>
      Object.keys(lpts).filter((lptAddress) => {
        const { pool: poolAddress } = lpts[lptAddress]
        if (selectedTab === PoolTabs.Deposited) return pools[poolAddress]
        else if (
          selectedTab === PoolTabs.YourPools &&
          pools?.[poolAddress]?.owner === walletAddress
        )
          return pools[poolAddress]
        return null
      }),
    [lpts, selectedTab, pools, walletAddress],
  )

  return (
    <Row gutter={[12, 12]} justify="center">
      {!lptAddresses?.length && (
        <Col>
          <Empty />
        </Col>
      )}
      {lptAddresses?.map((lptAddress, i) => {
        const { pool: poolAddress } = lpts[lptAddress]
        return (
          <Col span={24} key={lptAddress + i}>
            <LazyLoad height={78} overflow>
              <ItemLPT
                keyExpand={i + 1}
                data={lpts[lptAddress]}
                action={action(lptAddress, poolAddress)}
                onClick={() => onClick(poolAddress)}
              />
            </LazyLoad>
          </Col>
        )
      })}
    </Row>
  )
}

export default LptsPools
