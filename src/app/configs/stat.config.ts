import { Env } from 'shared/runtime'

/**
 * Contructor
 */
type Config = {
  baseURL: string
}

const config: Record<Env, Config> = {
  /**
   * Development configurations
   */
  development: {
    baseURL: 'http://3.141.200.97:9090',
  },

  /**
   * Staging configurations
   */
  staging: {
    baseURL: 'https://stat-dev.sentre.io',
  },

  /**
   * Production configurations
   */
  production: {
    baseURL: 'https://stat.sentre.io',
  },
}

/**
 * Module exports
 */
export default config
