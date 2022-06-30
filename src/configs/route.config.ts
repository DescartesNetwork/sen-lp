import { Env } from '@sentre/senhub'

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
    myRoute: '/app/sen_lp',
    swapRoute: '/app/sen_swap',
    farmRoute: '/app/sen_farming',
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
