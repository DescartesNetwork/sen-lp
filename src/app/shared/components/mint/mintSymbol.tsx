import { useMemo } from 'react'

import useTokenProvider from 'app/shared/hooks/useTokenProvider'
import { account } from '@senswap/sen-js'

const MintSymbol = ({
  mintAddress,
  separator = ' • ',
  isReverse = false,
}: {
  mintAddress: string
  separator?: string
  isReverse?: boolean
}) => {
  const tokens = useTokenProvider(mintAddress)

  const symbols = useMemo(() => {
    const symbols = tokens.map((token) => {
      if (!account.isAddress(mintAddress)) return 'TOKN'
      if (token) return token.symbol
      return mintAddress.substring(0, 4)
    })
    if (isReverse) symbols.reverse()
    return symbols.join(separator)
  }, [isReverse, mintAddress, separator, tokens])

  return <span>{symbols}</span>
}

export default MintSymbol
