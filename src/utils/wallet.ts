import { HDKey } from '@scure/bip32'
import { mnemonicToSeedSync } from '@scure/bip39'
import { createWalletClient, http, type WalletClient } from 'viem'
import { privateKeyToAccount, generateMnemonic, english } from 'viem/accounts'
import { mainnet } from 'viem/chains'
import { decryption, encryption } from './crypto'

function uint8ToHexString(uint8Array: Uint8Array | null): `0x${string}` {
  if (uint8Array === null) return `0x` as `0x${string}`
  const hexString = Array.from(uint8Array)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
  return `0x${hexString}` as `0x${string}`
}

export function generateWallet(walletNumber: number, password: string): {
  newWallet: WalletClient
  mnemonic: string
  privateKey: string
} {
  const storedMnemonic = localStorage.getItem('storedMnemonic')
  let mnemonic: string
  if (!storedMnemonic) {
    const mnemonic = generateMnemonic(english)
    const encryptedMnemonic = encryption(mnemonic, password)
    localStorage.setItem('storedMnemonic', encryptedMnemonic)
  } else {
    mnemonic = decryption(storedMnemonic, password)
  }
  const seed = mnemonicToSeedSync(mnemonic)
  const masterKey = HDKey.fromMasterSeed(seed)
  const privateKeyUint8 = masterKey.derive(`m/44'/60'/0'/0/${walletNumber}`).privateKey
  const privateKey = uint8ToHexString(privateKeyUint8)
  const account = privateKeyToAccount(privateKey)

  const newWallet = createWalletClient({
    account,
    chain: mainnet,
    transport: http()
  })
  return { newWallet, mnemonic, privateKey }
}

export function generateWalletFromPrivateKey(privateKey: `0x${string}`): WalletClient {
  const account = privateKeyToAccount(privateKey)
  return createWalletClient({
    account,
    chain: mainnet,
    transport: http()
  })
}

export function generateWalletFromMnemonic(mnemonic: string[], password: string): {
  newWallet: WalletClient | null
  privateKey: string | null
} {
  try {
    const checkStoredMnemonic = localStorage.getItem('storedMnemonic')
    if (!checkStoredMnemonic) {
      localStorage.setItem('storedMnemonic', encryption(mnemonic.join(' '), password))
    }
    const seed = mnemonicToSeedSync(mnemonic.join(' '))
    const masterKey = HDKey.fromMasterSeed(seed)
    const privateKeyUint8 = masterKey.derive(`m/44'/60'/0'/0/0`).privateKey
    const privateKey = uint8ToHexString(privateKeyUint8)
    const account = privateKeyToAccount(privateKey)
    const newWallet = createWalletClient({
      account,
      chain: mainnet,
      transport: http()
    })
    return { newWallet, privateKey }
  } catch (error) {
    console.error('The mnemonic format is invalid')
    return { newWallet: null, privateKey: null }
  }
}
