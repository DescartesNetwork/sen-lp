import { useDispatch } from 'react-redux'

import { Affix, Button } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { handleOpenDrawer } from 'app/model/main.controller'

const ViewPoolButton = ({ width }: { width: number }) => {
  const dispatch = useDispatch()
  const onOpen = () => {
    dispatch(handleOpenDrawer(true))
  }

  if (width > 1200) return null
  return (
    <Affix style={{ position: 'fixed', bottom: 80, right: 0 }}>
      <Button
        type="primary"
        onClick={() => onOpen()}
        icon={<IonIcon name="list-outline" />}
      >
        Pools
      </Button>
    </Affix>
  )
}
export default ViewPoolButton
