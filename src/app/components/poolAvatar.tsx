import { useCallback, useEffect, useState } from 'react'

import { Avatar } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { useMint, usePool } from 'senhub/providers'

const PoolAvatar = ({
  poolAddress,
  onClick = () => {},
  size = 32,
  isReverse = false,
}: {
  poolAddress: string
  onClick?: () => void
  size?: number
  isReverse?: boolean
}) => {
  const { tokenProvider } = useMint()
  const { pools } = usePool()
  const [logoURIs, setLogoURIs] = useState<string[]>([])

  const getLogoURIs = useCallback(async () => {
    try {
      const { mint_a, mint_b } = pools[poolAddress]
      const mintAddresses = [mint_a, mint_b]
      const logoURIs = await Promise.all(
        mintAddresses.map(async (mintAddress) => {
          const tokenInfo = await tokenProvider.findByAddress(mintAddress)
          return tokenInfo?.logoURI || '#'
        }),
      )
      if (isReverse) logoURIs.reverse()
      return setLogoURIs(logoURIs)
    } catch (er) {
      return setLogoURIs([])
    }
  }, [pools, poolAddress, isReverse, tokenProvider])

  useEffect(() => {
    getLogoURIs()
  }, [getLogoURIs])

  return (
    <Avatar.Group style={{ marginTop: 4, marginBottom: 4 }}>
      {logoURIs.map((logoURI, i) => (
        <Avatar
          key={i}
          src={logoURI}
          size={size}
          style={{ backgroundColor: '#2D3355', border: 'none' }}
        >
          <IonIcon name="diamond-outline" />
        </Avatar>
      ))}
    </Avatar.Group>
  )
}

export default PoolAvatar
