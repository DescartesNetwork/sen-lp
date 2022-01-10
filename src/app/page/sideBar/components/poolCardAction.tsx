import { Button } from 'antd'
import configs from 'app/configs'
import { PoolTabs, QueryParams } from 'app/constant'
import { handleOpenDrawer, selectPool } from 'app/model/main.controller'
import { MouseEvent, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import IonIcon from 'shared/antd/ionicon'

const {
  route: { myRoute },
} = configs

const PoolCardAction = ({
  poolAddress,
  category,
}: {
  poolAddress: string
  category: PoolTabs
}) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const setActivePoolAddress = useCallback(
    async (address: string) => {
      await dispatch(selectPool(address))
      await dispatch(handleOpenDrawer(false))
      return history.push(
        `${myRoute}?${QueryParams.address}=${address}&${QueryParams.category}=${category}`,
      )
    },
    [category, dispatch, history],
  )

  return (
    <Button
      type="text"
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        setActivePoolAddress(poolAddress)
      }}
      icon={
        <IonIcon
          name="arrow-forward-outline"
          style={{ fontSize: 12, color: '#7A7B85' }}
        />
      }
    />
  )
}
export default PoolCardAction
