const TokenKey = 'Admin-Token'
const AccountKey = 'Ygo-Account'

export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}

export function getAccount() {
  return localStorage.getItem(AccountKey)
}

export function setAccount(account) {
  return localStorage.setItem(AccountKey, account)
}

export function removeAccount() {
  return localStorage.removeItem(AccountKey)
}
