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
    baseURL: 'https://stat-dev.sentre.io',
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
