import { useDispatch } from 'react-redux'

import { Affix, Button } from 'antd'
import IonIcon from 'shared/antd/ionicon'

import { handleOpenDrawer } from 'app/model/main.controller'

const ViewPoolButton = ({ width }: { width: number }) => {
  const dispatch = useDispatch()

  if (width > 1200) return null
  return (
    <Affix style={{ position: 'fixed', bottom: 80, right: 16 }}>
      <Button
        type="primary"
        onClick={() => dispatch(handleOpenDrawer(true))}
        icon={<IonIcon name="list-outline" />}
      >
        Pools
      </Button>
    </Affix>
  )
}
export default ViewPoolButton
