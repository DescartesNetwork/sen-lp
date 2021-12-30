import { Typography } from 'antd'

const Caption = ({ title }: { title: string }) => {
  return (
    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
      {title}
    </Typography.Text>
  )
}

export default Caption
