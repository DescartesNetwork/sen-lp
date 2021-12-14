import { Provider } from 'react-redux'
import {
  WalletProvider,
  UIProvider,
  AccountProvider,
  PoolProvider,
  MintProvider,
} from 'senhub/providers'

import PageView from 'app/page'
import WidgetView from 'app/widget'

import model from 'app/model'
import configs from 'app/configs'

const {
  manifest: { appId },
} = configs

export const Page = () => {
  return (
    <MintProvider>
      <UIProvider appId={appId}>
        <PoolProvider>
          <AccountProvider>
            <WalletProvider>
              <Provider store={model}>
                <PageView />
              </Provider>
            </WalletProvider>
          </AccountProvider>
        </PoolProvider>
      </UIProvider>
    </MintProvider>
  )
}

export const widgetConfig: WidgetConfig = {
  size: 'small',
  type: 'solid',
}

export const Widget = () => {
  return (
    <MintProvider>
      <UIProvider appId={appId}>
        <PoolProvider>
          <AccountProvider>
            <WalletProvider>
              <Provider store={model}>
                <WidgetView />
              </Provider>
            </WalletProvider>
          </AccountProvider>
        </PoolProvider>
      </UIProvider>
    </MintProvider>
  )
}
