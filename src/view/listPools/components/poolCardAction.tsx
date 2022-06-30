import { MouseEvent, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { Button } from 'antd'
import configs from 'configs'
import { QueryParams } from 'constant'
import { handleOpenDrawer, selectPool } from 'model/main.controller'
import IonIcon from '@sentre/antd-ionicon'

const {
  route: { myRoute },
} = configs

const PoolCardAction = ({ poolAddress }: { poolAddress: string }) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const setActivePoolAddress = useCallback(
    async (address: string) => {
      await dispatch(selectPool(address))
      await dispatch(handleOpenDrawer(false))
      return history.push(
        `${myRoute}/details?${QueryParams.address}=${address}`,
      )
    },
    [dispatch, history],
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
