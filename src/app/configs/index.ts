import { env, net } from 'shared/runtime'
import manifest from './manifest.config'
import sol from './sol.config'
import stat from './stat.config'

const configs = {
  manifest: manifest[env],
  sol: sol[net],
  stat: stat[env],
}

/**
 * Module exports
 */
export default configs
