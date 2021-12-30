import { Env } from 'shared/runtime'

/**
 * Contructor
 */
type Config = {
  myRoute: string
  swapRoute: string
}

const config: Record<Env, Config> = {
  /**
   * Development configurations
   */
  development: {
    myRoute: '/app/senhub',
    swapRoute: '/app/sen_swap',
  },

  /**
   * Staging configurations
   */
  staging: {
    myRoute: '/app/sen_lp',
    swapRoute: '/app/sen_swap',
  },

  /**
   * Production configurations
   */
  production: {
    myRoute: '/app/sen_lp',
    swapRoute: '/app/sen_swap',
  },
}

/**
 * Module exports
 */
export default config
