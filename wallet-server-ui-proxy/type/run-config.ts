import path from 'path'

import { resolveHome } from 'common-ts/lib/util/fs-util'

import { ServerConfig } from './server-config'


const Config = <ServerConfig>require('../config.json')

const LOG_FILENAME = 'wallet-server-ui-proxy.log'

export class RunConfig {
  // server
  get stopOnError() { return Config.stopOnError }
  get port() { return Config.port }
  get useHTTPS() { return Config.useHTTPS }
  // auth
  get serverUser() { return Config.serverUser }
  get serverPassword() { return process.env.BITCOIN_S_SERVER_RPC_PASSWORD || Config.serverPassword }
  get serverAuthHeader() { return 'Basic ' + Buffer.from(this.serverUser + ':' + this.serverPassword).toString('base64') }
  get uiPassword() { return process.env.DEFAULT_UI_PASSWORD || Config.uiPassword }
  // fs
  private _rootDirectory // must be set after initialization
  get rootDirectory() { return this._rootDirectory }
  set rootDirectory(directory: string) { this._rootDirectory = path.resolve(directory) }
  get uiDirectory() { return Config.uiPath }
  get bitcoinsDirectory() {
    if (process.env.BITCOIN_S_HOME) return path.resolve(process.env.BITCOIN_S_HOME)
    return resolveHome(Config.bitcoinsPath)
  }
  get logFilepath() {
    const basePath = process.env.LOG_PATH || this.rootDirectory
    return path.join(basePath, LOG_FILENAME)
  }
  // routes
  get apiRoot() { return Config.apiRoot }
  get wsRoot() { return Config.wsRoot }
  get proxyRoot() { return Config.proxyRoot }
  // appServer
  get walletServerUrl() { return process.env.WALLET_SERVER_API_URL || Config.walletServerUrl }
  get walletServerWs() { return process.env.WALLET_SERVER_WS || Config.walletServerWs }
  // proxy
  // get oracleExplorerHost() { return Config.oracleExplorerHost } // get overriden by 'host-override' header
  // get blockstreamUrl() { return Config.blockstreamUrl }
  // get mempoolUrl() { return process.env.MEMPOOL_API_URL || Config.mempoolUrl }
  // get torProxyRoot() { return Config.torProxyRoot }
  // ui data
  get mempoolUrl() { return process.env.MEMPOOL_API_URL || Config.mempoolUrl } // BAD env var value incoming, should be updated
  show(logger) {
    logger.info(`Config:
stopOnError: ${this.stopOnError}
port: ${this.port}
useHTTPS: ${this.useHTTPS}
rootDirectory: ${this.rootDirectory}
uiDirectory: ${this.uiDirectory}
bitcoinsDirectory: ${this.bitcoinsDirectory}
logFilename: ${this.logFilepath}
serverUser: ${this.serverUser}
apiRoot: ${this.apiRoot}
wsRoot: ${this.wsRoot}
proxyRoot: ${this.proxyRoot}
walletServerUrl: ${this.walletServerUrl}
walletServerWs: ${this.walletServerWs}
mempoolUrl: ${this.mempoolUrl}
`)
// serverPassword: ${this.serverPassword}
// uiPassword: ${this.uiPassword}
  }
}

const instance = new RunConfig()

module.exports = instance
