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
<<<<<<< HEAD
    <UIProvider appId={appId}>
      <MintProvider>
        <PoolProvider>
          <AccountProvider>
            <WalletProvider>
              <Provider store={model}>
                <PageView />
              </Provider>
            </WalletProvider>
          </AccountProvider>
        </PoolProvider>
      </MintProvider>
=======
    <UIProvider appId={appId} antd>
      <WalletProvider>
        <Provider store={model}>
          <PageView />
        </Provider>
      </WalletProvider>
>>>>>>> 055ec5df223a67b536b0ccc78520c02af6dc1f08
    </UIProvider>
  )
}

export const widgetConfig: WidgetConfig = {
  size: 'small',
  type: 'solid',
}

export const Widget = () => {
  return (
<<<<<<< HEAD
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
=======
    <UIProvider appId={appId} antd>
      <Provider store={model}>
        <WidgetView />
      </Provider>
    </UIProvider>
>>>>>>> 055ec5df223a67b536b0ccc78520c02af6dc1f08
  )
}
