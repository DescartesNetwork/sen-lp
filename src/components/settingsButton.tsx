import { useDispatch, useSelector } from 'react-redux'

import { Row, Col, Popover, Space, Switch, Typography, Button } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { AppDispatch, AppState } from 'model'
import { setShowArchived } from 'model/settings.controller'

const SettingsButton = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    settings: { showArchived },
  } = useSelector((state: AppState) => state)

  return (
    <Popover
      zIndex={1000}
      content={
        <Row gutter={[8, 8]} style={{ maxWidth: 224 }}>
          <Col span={24}>
            <Space size="large">
              <Switch
                size="small"
                checked={showArchived}
                onChange={(checked) => dispatch(setShowArchived(checked))}
              />
              <Typography.Text>Show archived pools</Typography.Text>
            </Space>
          </Col>
        </Row>
      }
      trigger="click"
      placement="topRight"
    >
      <Button type="text" icon={<IonIcon name="cog-outline" />} />
    </Popover>
  )
}

export default SettingsButton
