import { net, env } from '@sentre/senhub'
import manifest from './manifest.config'
import sol from './sol.config'
import stat from './stat.config'
import fee from './fee.config'
import route from './route.config'

const configs = {
  manifest: manifest[env],
  sol: sol[net],
  stat: stat[net],
  fee: fee[env],
  route: route[env],
}

/**
 * Module exports
 */
export default configs
