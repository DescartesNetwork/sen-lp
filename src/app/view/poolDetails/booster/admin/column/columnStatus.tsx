import { Fragment, useState } from 'react'

import { Button, Modal, Typography } from 'antd'
import OrderStatus from 'app/components/orderStatus'
import IonIcon from '@sentre/antd-ionicon'
import ConfirmOrder from './confirmOrder'

import { OrderState } from 'app/constant'
import { OrderType } from '.'

const ColumnStatus = ({
  state,
  orderData,
}: {
  state: number
  orderData: OrderType
}) => {
  const [visible, setVisible] = useState(false)
  if (state === OrderState.Open)
    return (
      <Fragment>
        <Button size="small" type="primary" onClick={() => setVisible(true)}>
          Confirm
        </Button>
        <Modal
          title={<Typography.Title level={4}>Confirm order</Typography.Title>}
          visible={visible}
          footer={null}
          onCancel={() => setVisible(false)}
          closeIcon={<IonIcon name="close" />}
        >
          <ConfirmOrder onClose={setVisible} orderData={orderData} />
        </Modal>
      </Fragment>
    )
  return <OrderStatus state={state} />
}

export default ColumnStatus
