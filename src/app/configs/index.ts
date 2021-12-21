import { env } from 'shared/runtime'
import manifest from './manifest.config'
import sol from './sol.config'
import stat from './stat.config'
import fee from './fee'

const configs = {
  manifest: manifest[env],
  sol: sol[env],
  stat: stat[env],
  fee: fee[env],
}

/**
 * Module exports
 */
export default configs
