import { numeric } from 'shared/util'
import { usePoolTvl } from 'app/hooks/usePoolTvl'

const PoolTVL = ({ poolAddress }: { poolAddress: string }) => {
  const { tvl } = usePoolTvl(poolAddress)
  return <span>${numeric(tvl).format('0,0.[00]a')}</span>
}

export default PoolTVL
