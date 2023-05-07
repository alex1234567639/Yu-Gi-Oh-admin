import CryptoJS from 'crypto-js'

export const encode = (str) =>
  CryptoJS.AES.encrypt(JSON.stringify(str), 'C8763').toString()

export const decode = (str) =>
  JSON.parse(CryptoJS.AES.decrypt(str, 'C8763').toString(CryptoJS.enc.Utf8))
