import { AES, enc } from 'crypto-ts'

export function encryption(privateKey: string, password: string): string {
    return AES.encrypt(privateKey, password).toString()
}

export function decryption(cipherText: string, password: string): string {
    const bytes = AES.decrypt(cipherText, password)
    return bytes.toString(enc.Utf8)
}
