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
    swapRoute: '/app/sen_swap',
  },

  /**
   * Staging configurations
   */
  staging: {
    swapRoute: '/app/sen_swap',
  },

  /**
   * Production configurations
   */
  production: {
    swapRoute: '/app/sen_swap',
  },
}

/**
 * Module exports
 */
export default config
