import { useMemo } from 'react'

import useTokenProvider from 'app/shared/hooks/useTokenProvider'

const MintSymbol = ({
  mintAddress,
  separator = ' • ',
}: {
  mintAddress: string
  separator?: string
}) => {
  const tokens = useTokenProvider(mintAddress)

  const symbols = useMemo(() => {
    return tokens
      .map((token) => {
        const shortenAddr = `${mintAddress?.substr(0, 3)}...`
        if (!token) return shortenAddr
        return token.symbol
      })
      .join(separator)
  }, [mintAddress, separator, tokens])
  return <span>{symbols}</span>
}

export default MintSymbol
