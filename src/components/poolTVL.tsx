import { util } from '@sentre/senhub'
import { usePoolTvl } from 'hooks/usePoolTvl'

const PoolTVL = ({ poolAddress }: { poolAddress: string }) => {
  const { tvl } = usePoolTvl(poolAddress)
  return <span>${util.numeric(tvl).format('0,0.[00]a')}</span>
}

export default PoolTVL
