import { Env } from '@sentre/senhub'

/**
 * Contructor
 */
type Config = {
  exoticFee: bigint
  exoticTax: bigint
  correlatedFee: bigint
  correlatedTax: bigint
}

const config: Record<Env, Config> = {
  /**
   * Development configurations
   */
  development: {
    exoticFee: BigInt(2500000),
    exoticTax: BigInt(0),
    correlatedFee: BigInt(500000),
    correlatedTax: BigInt(0),
  },

  /**
   * Production configurations
   */
  production: {
    exoticFee: BigInt(2500000),
    exoticTax: BigInt(0),
    correlatedFee: BigInt(500000),
    correlatedTax: BigInt(0),
  },
}

/**
 * Module exports
 */
export default config
