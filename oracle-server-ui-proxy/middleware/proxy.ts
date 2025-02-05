import http from 'http'

import { Request, Response } from 'express'
import { SocksProxyAgent } from 'socks-proxy-agent'

import { RunConfig } from '../type/run-config'


const Config = <RunConfig>require('../type/run-config')
const logger = require('../middleware/logger')

/** For proxy routes used in the Oracle that aren't currently used here */

const ECONNREFUSED = 'ECONNREFUSED'
const ECONNREFUSED_REGEX = /ECONNREFUSED/

const TOR_CONNECTION_REFUSED = 'tor connection refused'
const CONNECTION_REFRUSED_ERROR = 'connection refused'
const CONNECTION_ERROR = 'connection error' // generic error

const HOST_OVERRIDE_HEADER = 'host-override'

module.exports = {
  removeFrontendHeaders: (proxyReq: http.ClientRequest) => {
    proxyReq.removeHeader('cookie')
    proxyReq.removeHeader('referer')
    proxyReq.removeHeader('authorization')
  },
  getProxyErrorHandler: (name: string, agent?: SocksProxyAgent) => 
    (err: Error, req: Request, res: Response) => {
      if (err) {
        logger.error(`${name}`, { err, statusCode: res.statusCode, statusMessage: res.statusMessage })
        const connectionRefused = ECONNREFUSED_REGEX.test(err.message)
        if (connectionRefused) {
          if (agent) {
            res.writeHead(500, `${name} ${TOR_CONNECTION_REFUSED}`).end()
          } else {
            res.writeHead(500, `${name} ${CONNECTION_REFRUSED_ERROR}`).end()
          }
        } else {
          res.writeHead(500, `${name} ${CONNECTION_ERROR}`).end()
        }
      }
    },
  hostRouter: (req: http.IncomingMessage) => {
    const host = req.headers[HOST_OVERRIDE_HEADER] || Config.oracleExplorerHost
    return `https://${host}/v2`
  }
}
