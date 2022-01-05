import { numeric } from 'shared/util'
import { useTVL } from 'app/hooks/useTVL'

const PoolTVL = ({ poolAddress }: { poolAddress: string }) => {
  const { tvl } = useTVL(poolAddress)

  return <span>${numeric(tvl).format('0,0.[00]a')}</span>
}

export default PoolTVL
