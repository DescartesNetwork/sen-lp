import { Radio, RadioChangeEvent } from 'antd'

const RADIO_STYLE = {
  width: '33%',
}

export enum FilterOptions {
  SEVEN_DAYS = 7,
  THIRTY_DAYS = 30,
  NINETY_DAYS = 90,
}

type FilterProps = {
  onChange: (e: RadioChangeEvent) => void
}

const FilterHistory = ({ onChange }: FilterProps) => {
  return (
    <Radio.Group
      onChange={onChange}
      style={{ width: '100%', textAlign: 'center' }}
      defaultValue={FilterOptions.SEVEN_DAYS}
    >
      <Radio.Button style={RADIO_STYLE} value={FilterOptions.SEVEN_DAYS}>
        Past {FilterOptions.SEVEN_DAYS} days
      </Radio.Button>
      <Radio.Button style={RADIO_STYLE} value={FilterOptions.THIRTY_DAYS}>
        Past {FilterOptions.THIRTY_DAYS} days
      </Radio.Button>
      <Radio.Button style={RADIO_STYLE} value={FilterOptions.NINETY_DAYS}>
        Past {FilterOptions.NINETY_DAYS} days
      </Radio.Button>
    </Radio.Group>
  )
}

export default FilterHistory
