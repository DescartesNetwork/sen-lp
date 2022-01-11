import { ReactElement, Fragment } from 'react'
import LazyLoad from '@senswap/react-lazyload'

import { Row, Col, Empty } from 'antd'

import PoolCard from '../components/poolCard'
import { useYourPools } from 'app/hooks/pools/useYourPools'
import { useListPoolAddress } from 'app/hooks/pools/useListPoolAddress'

const ListMyPools = ({
  onClick = () => {},
  selectedPoolAddress,
  action = () => <Fragment />,
}: {
  onClick?: (poolAddress: string) => void
  selectedPoolAddress?: string
  action?: (poolAddress: string) => ReactElement
}) => {
  const { yourPools } = useYourPools()
  const { listPoolAddress } = useListPoolAddress(yourPools)

  return (
    <Row gutter={[12, 12]} justify="center">
      {!listPoolAddress.length && (
        <Col>
          <Empty />
        </Col>
      )}
      {listPoolAddress.map((poolAddress) => (
        <Col span={24} key={poolAddress}>
          <LazyLoad height={78} overflow>
            <PoolCard
              poolAddress={poolAddress}
              action={action(poolAddress)}
              onClick={() => onClick(poolAddress)}
              selected={selectedPoolAddress === poolAddress}
              myLp
            />
          </LazyLoad>
        </Col>
      ))}
    </Row>
  )
}

export default ListMyPools
