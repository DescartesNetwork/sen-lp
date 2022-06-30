import { useDispatch, useSelector } from 'react-redux'

import { Card, Input, Button } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { AppDispatch, AppState } from 'model'
import { onSearch } from 'model/main.controller'

const Search = () => {
  const {
    main: { search },
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch<AppDispatch>()

  return (
    <Card bodyStyle={{ padding: 8 }} bordered={false} className="lp-card">
      <Input
        placeholder="Search"
        value={search}
        size="small"
        bordered={false}
        prefix={
          <Button
            type="text"
            style={{ marginLeft: -7 }}
            size="small"
            onClick={search ? () => dispatch(onSearch('')) : () => {}}
            icon={
              <IonIcon name={search ? 'close-outline' : 'search-outline'} />
            }
          />
        }
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          dispatch(onSearch(e.target.value))
        }
      />
    </Card>
  )
}

export default Search
