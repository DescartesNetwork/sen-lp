import { useCallback, useEffect, useState } from 'react'

import { useMint, usePool } from 'senhub/providers'

const PoolName = ({
  poolAddress,
  separator = ' • ',
  isReverse = false,
}: {
  poolAddress: string
  separator?: string
  isReverse?: boolean
}) => {
  const { tokenProvider } = useMint()
  const { pools } = usePool()
  const [name, setName] = useState('UNKNOWN')

  const getName = useCallback(async () => {
    try {
      const { mint_a, mint_b } = pools[poolAddress]
      const mintAddresses = [mint_a, mint_b]
      const symbols = await Promise.all(
        mintAddresses.map(async (mintAddress) => {
          const tokenInfo = await tokenProvider.findByAddress(mintAddress)
          return tokenInfo?.symbol || 'TOKEN'
        }),
      )
      if (isReverse) symbols.reverse()
      return setName(symbols.join(separator))
    } catch (er) {
      return setName('UNKNOWN')
    }
  }, [pools, poolAddress, isReverse, separator, tokenProvider])

  useEffect(() => {
    getName()
  }, [getName])

  return <span>{name}</span>
}

export default PoolName
