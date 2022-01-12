import { Row, Col } from 'antd'
import WidgetLoader from 'os/components/widgetLoader'

import { useRootSelector, RootState } from 'os/store'

const Dashboard = () => {
  const { widgetIds, register } = useRootSelector(
    (state: RootState) => state.page,
  )

  return (
    <Row gutter={[24, 24]}>
      <Col span={24} className="sentre-col-container">
        <Row gutter={[24, 24]}>
          {widgetIds.map((appId) => {
            if (!register[appId]) return null
            return (
              <WidgetLoader
                key={appId}
                {...(register[appId] as ComponentManifest)}
              />
            )
          })}
        </Row>
      </Col>
    </Row>
  )
}

export default Dashboard
