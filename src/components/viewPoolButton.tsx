import { useDispatch } from 'react-redux'
import { useUI } from '@sentre/senhub'

import { Affix, Button } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { handleOpenDrawer } from 'model/main.controller'

const ViewPoolButton = () => {
  const dispatch = useDispatch()
  const {
    ui: { width },
  } = useUI()

  if (width >= 1200) return null
  return (
    <Affix style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
      <Button
        type="primary"
        onClick={() => dispatch(handleOpenDrawer(true))}
        icon={<IonIcon name="list-outline" />}
        size="large"
      >
        Pools List
      </Button>
    </Affix>
  )
}
export default ViewPoolButton
