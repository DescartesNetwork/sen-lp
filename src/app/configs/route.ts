import { Env } from 'shared/runtime'

/**
 * Contructor
 */
type Config = {
  swapRoute: string
}

const config: Record<Env, Config> = {
  /**
   * Development configurations
   */
  development: {
    swapRoute: '/app/senhub',
  },

  /**
   * Staging configurations
   */
  staging: {
    swapRoute: '/app/senhub',
  },

  /**
   * Production configurations
   */
  production: {
    swapRoute: '/app/senhub',
  },
}

/**
 * Module exports
 */
export default config
