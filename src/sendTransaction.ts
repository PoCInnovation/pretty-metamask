import { account, walClient } from './main'

export const sendTransaction = async (to: `0x${string}`, value: bigint) : Promise<`0x${string}`> => {
  console.log("amount", value)
  return await walClient.sendTransaction({
    account,
    to: to,
    value: value,
  })
}
