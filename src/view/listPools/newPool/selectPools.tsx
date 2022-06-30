import { Space, Select, Divider, Typography } from 'antd'
import { MintAvatar, MintSymbol } from 'shared/antd/mint'
import IonIcon from '@sentre/antd-ionicon'
import Avatar from 'antd/lib/avatar/avatar'

const DEFAULT_VALUE = 'Select'

const SelectPools = ({
  mintAddresses,
  activeMintAddress,
  onSelect,
}: {
  mintAddresses: string[]
  activeMintAddress: string
  onSelect: (mintAddress: string) => void
}) => {
  return (
    <Select
      onChange={onSelect}
      value={activeMintAddress || DEFAULT_VALUE}
      bordered={false}
      suffixIcon={<Divider type="vertical" style={{ margin: 0 }} />}
      style={{ marginLeft: -7 }}
    >
      <Select.Option value={DEFAULT_VALUE}>
        <Space>
          <Avatar>
            <IonIcon name="help-outline" />
          </Avatar>
          <Typography.Text>{DEFAULT_VALUE}</Typography.Text>
        </Space>
      </Select.Option>
      {mintAddresses.map((mintAddress, i) => {
        return (
          <Select.Option key={i} value={mintAddress}>
            <Space>
              <MintAvatar mintAddress={mintAddress} />
              <MintSymbol mintAddress={mintAddress} />
            </Space>
          </Select.Option>
        )
      })}
    </Select>
  )
}

export default SelectPools
