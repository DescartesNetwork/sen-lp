import { useCallback, useEffect, useState } from 'react'
import { account, PoolData } from '@senswap/sen-js'

import { Card, Input, Button } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { useMint } from 'senhub/providers'

const KEYSIZE = 3

const Search = ({
  pools,
  onChange,
}: {
  pools: Array<PoolData & { address: string }>
  onChange: (value: Array<PoolData & { address: string }> | undefined) => void
}) => {
  const [keyword, setKeyword] = useState('')
  const { tokenProvider } = useMint()

  const search = useCallback(async () => {
    if (!keyword || keyword.length < KEYSIZE) return onChange(undefined)
    if (account.isAddress(keyword)) {
      const poolData = pools.find(({ address }) => address === keyword)
      if (!poolData) return onChange([])
      else return onChange([poolData])
    }
    const tokenInfos = await tokenProvider.find(keyword)
    if (!tokenInfos) return onChange(undefined)
    const mintAddress = tokenInfos.map(({ address }) => address)
    const searchedPools = pools.filter((data) => {
      const { mint_a, mint_b } = data
      if (mintAddress.includes(mint_a)) return true
      if (mintAddress.includes(mint_b)) return true
      return false
    })
    return onChange(searchedPools)
  }, [pools, keyword, onChange, tokenProvider])

  useEffect(() => {
    search()
  }, [search])

  return (
    <Card bodyStyle={{ padding: 8 }} bordered={false}>
      <Input
        placeholder="Search"
        value={keyword}
        size="small"
        bordered={false}
        prefix={
          <Button
            type="text"
            style={{ marginLeft: -7 }}
            size="small"
            onClick={keyword ? () => setKeyword('') : () => {}}
            icon={
              <IonIcon name={keyword ? 'close-outline' : 'search-outline'} />
            }
          />
        }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setKeyword(e.target.value || '')
        }
      />
    </Card>
  )
}

export default Search
