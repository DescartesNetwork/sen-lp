import { Net } from 'shared/runtime'

/**
 * Contructor
 */
type Config = {
  senAddress: string
  swapAddress: string
  taxmanAddress: string
  senOwner: string[]
}

const configs: Record<Net, Config> = {
  /**
   * Development configurations
   */
  devnet: {
    senAddress: '5YwUkPdXLoujGkZuo9B4LsLKj3hdkDcfP4derpspifSJ',
    swapAddress: '4erFSLP7oBFSVC1t35jdxmbfxEhYCKfoM6XdG2BLR3UF',
    taxmanAddress: '8UaZw2jDhJzv5V53569JbCd3bD4BnyCfBH3sjwgajGS9',
    senOwner: ['GJLqpmDxxrV9xruee2vFvEoTho7VVQHRtuHH8nfoAE54'],
  },

  /**
   * Staging configurations
   */
  testnet: {
    senAddress: '5YwUkPdXLoujGkZuo9B4LsLKj3hdkDcfP4derpspifSJ',
    swapAddress: '4erFSLP7oBFSVC1t35jdxmbfxEhYCKfoM6XdG2BLR3UF',
    taxmanAddress: '8UaZw2jDhJzv5V53569JbCd3bD4BnyCfBH3sjwgajGS9',
    senOwner: ['GJLqpmDxxrV9xruee2vFvEoTho7VVQHRtuHH8nfoAE54'],
  },

  /**
   * Production configurations
   */
  mainnet: {
    senAddress: 'SENBBKVCM7homnf5RX9zqpf1GFe935hnbU4uVzY1Y6M',
    swapAddress: 'SSW7ooZ1EbEognq5GosbygA3uWW1Hq1NsFq6TsftCFV',
    taxmanAddress: '9doo2HZQEmh2NgfT3Yx12M89aoBheycYqH1eaR5gKb3e',
    senOwner: ['Cs6jYywHTAgdvjxn8xG4VkJJH8DXXy7zbtatzMUWoCMG'],
  },
}

/**
 * Module exports
 */
export default configs
