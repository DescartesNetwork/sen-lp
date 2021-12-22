import { env } from 'shared/runtime'
import manifest from './manifest.config'
import sol from './sol.config'
import stat from './stat.config'
import fee from './fee'
import route from './route'

const configs = {
  manifest: manifest[env],
  sol: sol[env],
  stat: stat[env],
  fee: fee[env],
  route: route[env],
}

/**
 * Module exports
 */
export default configs
