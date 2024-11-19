import { cosmiconfig } from 'cosmiconfig'
import dotenv from 'dotenv'

dotenv.config()

const defaultConfig = {
  nunjucksPaths: [],
  serviceName: 'Your service name',
  showLogs: false,
  templateExtension: 'html',
  useAuth: true,
  useAutoStoreData: true,
  useCookieSessionStore: false,
  useHttps: true
}

/**
 * Get user config values from package.json or config file
 *
 * @see {@link https://github.com/davidtheclark/cosmiconfig#readme}
 * @access private
 * @returns {object} User config
 */
async function _getUserConfig() {
  const explorer = cosmiconfig('prototype')

  const search = await explorer.search()
  const result = await search
  return result ? result.config : {}
}

/**
 * Get config derived from user and default config values
 *
 * @returns {object} Combined config
 */
export async function getConfig() {
  const userConfig = await _getUserConfig()

  return { ...defaultConfig, ...userConfig }
}
