import { HDKey } from '@scure/bip32'
import { mnemonicToSeedSync } from '@scure/bip39'
import { createWalletClient, http, type WalletClient } from 'viem'
import { privateKeyToAccount, generateMnemonic, english } from 'viem/accounts'
import { mainnet } from 'viem/chains'

function uint8ToHexString(uint8Array: Uint8Array | null): `0x${string}` {
    if (uint8Array === null)
        return `0x` as `0x${string}`;
    const hexString = Array.from(uint8Array)
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
    return `0x${hexString}` as `0x${string}`;
}

export function generateWallet(walletNumber: number): { newWallet:WalletClient, mnemonic:string, privateKey:string } {
    const mnemonic = generateMnemonic(english)
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