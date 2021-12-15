import { Provider } from 'react-redux'
import { WalletProvider, UIProvider, PoolProvider } from 'senhub/providers'

import PageView from 'app/page'
import WidgetView from 'app/widget'

import model from 'app/model'
import configs from 'app/configs'

const {
  manifest: { appId },
} = configs

export const Page = () => {
  return (
    <UIProvider appId={appId}>
      <WalletProvider>
        <PoolProvider>
          <Provider store={model}>
            <PageView />
          </Provider>
        </PoolProvider>
      </WalletProvider>
    </UIProvider>
  )
}

export const widgetConfig: WidgetConfig = {
  size: 'small',
  type: 'solid',
}

export const Widget = () => {
  return (
    <UIProvider appId={appId}>
      <Provider store={model}>
        <WidgetView />
      </Provider>
    </UIProvider>
  )
}
