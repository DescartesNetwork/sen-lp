import { Net } from 'shared/runtime'

const SOLVARS = {
  spltAddress: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  splataAddress: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
}

/**
 * Contructor
 */
type Config = {
  node: string
  cluster: 'devnet' | 'testnet' | 'mainnet'
  chainId: 101 | 102 | 103
  senAddress: string
  swapAddress: string
  taxmanAddress: string
  blackPoolAddresses: string[]
  senPoolAddress: string
  senOwner: string[]
} & typeof SOLVARS

const configs: Record<Net, Config> = {
  /**
   * Development configurations
   */
  devnet: {
    node: 'https://api.devnet.solana.com',
    chainId: 103,
    cluster: 'devnet',
    senAddress: '5YwUkPdXLoujGkZuo9B4LsLKj3hdkDcfP4derpspifSJ',
    ...SOLVARS,
    swapAddress: '4erFSLP7oBFSVC1t35jdxmbfxEhYCKfoM6XdG2BLR3UF',
    taxmanAddress: '8UaZw2jDhJzv5V53569JbCd3bD4BnyCfBH3sjwgajGS9',
    blackPoolAddresses: [
      'FaHQpdp87S7d7PBJZjaty514rrEtmStaf1FcDst9GPY4',
      '5V7sDTzYmjkyg7zXLTTcY8Ls6AAusLRX27CpWEJiqriE',
      'G8BEKsiKPiazG623piXynTSr89TXLTgWycByvDR9bPii',
    ],
    senPoolAddress: '3EUPL7YQLbU6DNU5LZeQeHPXTf1MigJ2yASXA9rH5Ku4',
    senOwner: ['GJLqpmDxxrV9xruee2vFvEoTho7VVQHRtuHH8nfoAE54'],
  },

  /**
   * Staging configurations
   */
  testnet: {
    node: 'https://api.devnet.solana.com',
    cluster: 'devnet',
    chainId: 103,
    senAddress: '5YwUkPdXLoujGkZuo9B4LsLKj3hdkDcfP4derpspifSJ',
    ...SOLVARS,
    swapAddress: '4erFSLP7oBFSVC1t35jdxmbfxEhYCKfoM6XdG2BLR3UF',
    taxmanAddress: '8UaZw2jDhJzv5V53569JbCd3bD4BnyCfBH3sjwgajGS9',
    blackPoolAddresses: [
      'FaHQpdp87S7d7PBJZjaty514rrEtmStaf1FcDst9GPY4',
      '5V7sDTzYmjkyg7zXLTTcY8Ls6AAusLRX27CpWEJiqriE',
      'G8BEKsiKPiazG623piXynTSr89TXLTgWycByvDR9bPii',
    ],
    senPoolAddress: '3EUPL7YQLbU6DNU5LZeQeHPXTf1MigJ2yASXA9rH5Ku4',
    senOwner: ['GJLqpmDxxrV9xruee2vFvEoTho7VVQHRtuHH8nfoAE54'],
  },

  /**
   * Production configurations
   */
  mainnet: {
    node: 'https://api.mainnet-beta.solana.com',
    cluster: 'mainnet',
    chainId: 101,
    senAddress: 'SENBBKVCM7homnf5RX9zqpf1GFe935hnbU4uVzY1Y6M',
    ...SOLVARS,
    swapAddress: 'SSW7ooZ1EbEognq5GosbygA3uWW1Hq1NsFq6TsftCFV',
    taxmanAddress: '9doo2HZQEmh2NgfT3Yx12M89aoBheycYqH1eaR5gKb3e',
    blackPoolAddresses: [],
    senPoolAddress: '',
    senOwner: ['Cs6jYywHTAgdvjxn8xG4VkJJH8DXXy7zbtatzMUWoCMG'],
  },
}

/**
 * Module exports
 */
export default configs
