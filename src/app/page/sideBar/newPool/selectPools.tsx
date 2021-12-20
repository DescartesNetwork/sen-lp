import { Space, Select, Divider, Typography } from 'antd'
import { MintAvatar, MintSymbol } from 'app/shared/components/mint'
import IonIcon from 'shared/antd/ionicon'

const SelectPools = ({
  mintAddresses,
  activeMintAddress,
  onSelect,
}: {
  mintAddresses: string[]
  activeMintAddress: string
  onSelect: (mintAddress: any) => void
}) => {
  return (
    <Select
      onChange={onSelect}
      value={activeMintAddress || ''}
      bordered={false}
      suffixIcon={<Divider type="vertical" style={{ margin: 0 }} />}
      style={{ marginLeft: -4, marginRight: -12 }}
    >
      <Select.Option value="Select">
        <Space size={4}>
          <MintAvatar
            mintAddress={'Select'}
            icon={<IonIcon name="help-outline" />}
          />
          <Typography.Text>Select</Typography.Text>
        </Space>
      </Select.Option>
      {mintAddresses.map((mintAddress, i) => {
        return (
          <Select.Option key={mintAddress + i} value={mintAddress}>
            <Space size={4}>
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
