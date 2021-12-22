import { Env } from 'shared/runtime'

/**
 * Contructor
 */
type Config = {
  route: string
}

const config: Record<Env, Config> = {
  /**
   * Development configurations
   */
  development: {
    route: '/app/senhub',
  },

  /**
   * Staging configurations
   */
  staging: {
    route: '/app/senhub',
  },

  /**
   * Production configurations
   */
  production: {
    route: '/app/senhub',
  },
}

/**
 * Module exports
 */
export default config
