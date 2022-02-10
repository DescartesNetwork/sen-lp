import { Radio, RadioChangeEvent } from 'antd'

const RADIO_STYLE = {
  width: '33%',
}

export enum DayOptions {
  SEVEN_DAYS = 7,
  THIRTY_DAYS = 30,
  NINETY_DAYS = 90,
}

type SelectProps = {
  onChange: (e: RadioChangeEvent) => void
}

const SelectDay = ({ onChange }: SelectProps) => {
  return (
    <Radio.Group
      onChange={onChange}
      style={{ width: '100%', textAlign: 'center' }}
      defaultValue={DayOptions.SEVEN_DAYS}
    >
      <Radio.Button style={RADIO_STYLE} value={DayOptions.SEVEN_DAYS}>
        Past {DayOptions.SEVEN_DAYS} days
      </Radio.Button>
      <Radio.Button style={RADIO_STYLE} value={DayOptions.THIRTY_DAYS}>
        Past {DayOptions.THIRTY_DAYS} days
      </Radio.Button>
      <Radio.Button style={RADIO_STYLE} value={DayOptions.NINETY_DAYS}>
        Past {DayOptions.NINETY_DAYS} days
      </Radio.Button>
    </Radio.Group>
  )
}

export default SelectDay
