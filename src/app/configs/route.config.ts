import { Env } from 'shared/runtime'

/**
 * Contructor
 */
type Config = {
  myRoute: string
  swapRoute: string
  farmRoute: string
}

const config: Record<Env, Config> = {
  /**
   * Development configurations
   */
  development: {
    myRoute: '/app/senhub',
    swapRoute: '/app/sen_swap',
    farmRoute: '/app/senhub',
  },

  /**
   * Staging configurations
   */
  staging: {
    myRoute: '/app/sen_lp',
    swapRoute: '/app/sen_swap',
    farmRoute: '/app/sen_farming',
  },

  /**
   * Production configurations
   */
  production: {
    myRoute: '/app/sen_lp',
    swapRoute: '/app/sen_swap',
    farmRoute: '/app/sen_farming',
  },
}

/**
 * Module exports
 */
export default config
