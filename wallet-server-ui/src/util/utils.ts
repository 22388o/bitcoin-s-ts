import { DLCState } from "~type/wallet-server-types"

export function copyToClipboard(s: string|undefined|null) {
  if (s === undefined || s === null) return
  const hiddenta = document.createElement('textarea')
  hiddenta.style.position = 'fixed'
  hiddenta.style.opacity = '0'
  hiddenta.style.left = '0'
  hiddenta.style.top = '0'
  hiddenta.value = s
  document.body.appendChild(hiddenta)
  hiddenta.focus()
  hiddenta.select()
  document.execCommand('copy')
  document.body.removeChild(hiddenta)
}

export enum BitcoinNetwork {
  main = 'main', // NOT VALIDATED AGAINST BACKEND
  test = 'test',
  signet = 'signet', // NOT VALIDATED AGAINST BACKEND
  regnet = 'regnet', // NOT VALIDATED AGAINST BACKEND
}

// Network Regex Validators
const TESTNET_REGEX = /^(tb1|[2nm]|bcrt)[a-zA-HJ-NP-Z0-9]{25,40}$/;
const MAINNET_REGEX = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}$/;

export function validateBitcoinAddress(network: string, address: string) {
  if (!network || !address) return false

  switch (network) {
    case BitcoinNetwork.test:
      return TESTNET_REGEX.test(address)
    case BitcoinNetwork.main:
      return MAINNET_REGEX.test(address)
    default:
      console.error('unknown network', network)
  }
  return false
}

export function getValidationRegexForNetwork(network: string) {
  switch (network) {
    case BitcoinNetwork.test:
      return TESTNET_REGEX
    case BitcoinNetwork.main:
      return MAINNET_REGEX
    default:
      console.error('unknown network', network)
      return TESTNET_REGEX
  }
}

export function formatDatePlusDays(date: string, days: number) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result.toLocaleDateString()
}

export function formatISODate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString()
}

// units epochSeconds?
export function formatDateTime(dateTime: number) {
  return new Date(dateTime * 1000).toLocaleDateString()
}

// From common-ts
export function dateToSecondsSinceEpoch(date: Date) {
  const secondsSinceEpoch = Math.round(date.getTime() / 1000)
  return secondsSinceEpoch
}

export function datePlusDays(date: Date, days: number) {
  date.setDate(date.getDate() + days)
  return date
}

export function formatNumber(n: number): string {
  if (n === undefined || n === null) return ''
  return n.toLocaleString()
}

export function formatPercent(num: number, fractionalDigits = 2, addPercentSign = true): string {
  let value = ''
  if (num !== undefined) {
    value = (num * 100).toFixed(fractionalDigits)
    if (addPercentSign) value += '%'
  }
  return value
}

// Matches upper and lower case hex strings
const UPPERLOWER_CASE_HEX = /[0-9A-Fa-f]{6}/g;

export function validateHexString(s: string) {
  return UPPERLOWER_CASE_HEX.test(s)
}

const SHORT_HEX_LENGTH = 6

export function formatShortHex(s: string|null|undefined) {
  if (s) {
    if (s.length < SHORT_HEX_LENGTH) return s
    return s.substring(0, SHORT_HEX_LENGTH) + '...' // this.translate('unit.ellipsis')
  }
  return ''
}

export function mempoolTransactionURL(txIdHex: string, network: string) {
  switch (network) {
    case BitcoinNetwork.main:
      return `https://mempool.space/tx/${txIdHex}`
    case BitcoinNetwork.test:
      return `https://mempool.space/testnet/tx/${txIdHex}`
    case BitcoinNetwork.signet:
      return `https://mempool.space/signet/tx/${txIdHex}`
    default:
      console.error('mempoolTransactionURL() unknown BitcoinNetwork', network)
      return ''
  }
}

const IPV6_ADDRESS = /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/

export const TOR_V3_ADDRESS = /^[a-z2-7]{56}.onion\:\d{4,5}$/

export function validateTorAddress(address: string) {
  return TOR_V3_ADDRESS.test(address)
}

// DLCState of DLCContract allow operation functions

export function isCancelable(state: DLCState) {
  return [DLCState.offered, DLCState.accepted, DLCState.signed].includes(state)
}

export function isRefundable(state: DLCState) {
  return [DLCState.confirmed, DLCState.broadcast, DLCState.confirmed].includes(state)
}

export function isExecutable(state: DLCState) {
  return [DLCState.confirmed, DLCState.broadcast].includes(state)
}

export function isFundingTxRebroadcastable(state: DLCState) {
  return [DLCState.broadcast].includes(state)
}
