import { Tag, TagProps } from 'antd'

import { OrderState } from 'app/constant'

const BorderlessTag = (props: TagProps) => {
  return <Tag style={{ border: 'none' }} {...props} />
}
const OrderStatus = ({ state }: { state: number }) => {
  if (state === OrderState.Open)
    return <BorderlessTag color="gold">Pending</BorderlessTag>
  if (state === OrderState.Approved)
    return <BorderlessTag color="cyan">Approved</BorderlessTag>
  if (state === OrderState.Done)
    return <BorderlessTag color="green">Done</BorderlessTag>
  if (state === OrderState.Rejected)
    return <BorderlessTag color="red">Rejected</BorderlessTag>
  if (state === OrderState.Canceled)
    return <BorderlessTag color="volcano">Canceled</BorderlessTag>
  return <BorderlessTag>Unknown</BorderlessTag>
}

export default OrderStatus
