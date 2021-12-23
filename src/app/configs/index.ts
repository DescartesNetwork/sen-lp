import { net, env } from 'shared/runtime'
import manifest from './manifest.config'
import sol from './sol.config'
import stat from './stat.config'
import fee from './fee'
import swapRoute from './swapRoute'

const configs = {
  manifest: manifest[env],
  sol: sol[env],
  stat: stat[net],
  fee: fee[env],
  swapRoute: swapRoute[env],
}

/**
 * Module exports
 */
export default configs
