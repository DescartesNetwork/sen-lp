import { Purchasing } from '@senswap/sen-js'

import { Net, rpc } from '@sentre/senhub'

/**
 * Contructor
 */
type Config = {
  // For lp
  swapAddress: string
  taxmanAddress: string
  senOwners: string[]
  // For purchasing
  sntrAddress: string
  purchasingAddress: string
  spltAddress: string
  splataAddress: string
  nodeUrl: string
  purchasing: Purchasing
}

const configs: Record<Net, Config> = {
  /**
   * Development configurations
   */
  devnet: {
    // For lp
    swapAddress: '4erFSLP7oBFSVC1t35jdxmbfxEhYCKfoM6XdG2BLR3UF',
    taxmanAddress: '8UaZw2jDhJzv5V53569JbCd3bD4BnyCfBH3sjwgajGS9',
    senOwners: ['GJLqpmDxxrV9xruee2vFvEoTho7VVQHRtuHH8nfoAE54'],
    // For purchasing
    sntrAddress: '5YwUkPdXLoujGkZuo9B4LsLKj3hdkDcfP4derpspifSJ',
    purchasingAddress: 'FHeonxeZFH76K57KGRWgsmE97tiupcHDjvWNKMQDmdVd',
    spltAddress: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    splataAddress: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
    nodeUrl: rpc,
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
  testnet: {
    // For lp
    swapAddress: '',
    taxmanAddress: '',
    senOwners: [],
    // For purchasing
    sntrAddress: '',
    purchasingAddress: '',
    spltAddress: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    splataAddress: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
    nodeUrl: rpc,
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
  mainnet: {
    // For lp
    swapAddress: 'SSW7ooZ1EbEognq5GosbygA3uWW1Hq1NsFq6TsftCFV',
    taxmanAddress: '9doo2HZQEmh2NgfT3Yx12M89aoBheycYqH1eaR5gKb3e',
    senOwners: [
      'Cs6jYywHTAgdvjxn8xG4VkJJH8DXXy7zbtatzMUWoCMG',
      '8W6QginLcAydYyMYjxuyKQN56NzeakDE3aRFrAmocS6D',
    ],
    // For purchasing
    sntrAddress: 'SENBBKVCM7homnf5RX9zqpf1GFe935hnbU4uVzY1Y6M',
    purchasingAddress: 'Ecw8Vh3cwwwwMsaU63mW6knKMsuaiSakVDvKxB5nyhFC',
    spltAddress: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    splataAddress: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
    nodeUrl: rpc,
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
export default configs
