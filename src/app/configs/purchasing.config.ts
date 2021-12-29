import { Purchasing } from '@senswap/sen-js'

import { Env } from 'shared/runtime'

/**
 * Contructor
 */
type Config = {
  purchasingAddress: string
  spltAddress: string
  splataAddress: string
  nodeUrl: string
  purchasing: Purchasing
}

const config: Record<Env, Config> = {
  /**
   * Development configurations
   */
  development: {
    purchasingAddress: 'FHeonxeZFH76K57KGRWgsmE97tiupcHDjvWNKMQDmdVd',
    spltAddress: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    splataAddress: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
    nodeUrl: 'https://api.devnet.solana.com',
    get purchasing() {
      return new Purchasing(
        this.purchasingAddress,
        this.spltAddress,
        this.splataAddress,
        this.nodeUrl,
      )
    },
  },

  /**
   * Staging configurations
   */
  staging: {
    purchasingAddress: 'FHeonxeZFH76K57KGRWgsmE97tiupcHDjvWNKMQDmdVd',
    spltAddress: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    splataAddress: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
    nodeUrl: 'https://api.devnet.solana.com',
    get purchasing() {
      return new Purchasing(
        this.purchasingAddress,
        this.spltAddress,
        this.splataAddress,
        this.nodeUrl,
      )
    },
  },

  /**
   * Production configurations
   */
  production: {
    purchasingAddress: '',
    spltAddress: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    splataAddress: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
    nodeUrl: 'https://api.mainnet-beta.solana.com',
    get purchasing() {
      return new Purchasing(
        this.purchasingAddress,
        this.spltAddress,
        this.splataAddress,
        this.nodeUrl,
      )
    },
  },
}

/**
 * Module exports
 */
export default config
