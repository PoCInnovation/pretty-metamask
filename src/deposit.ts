import { account, publicClientL2, publicClientL1, walletClientL1 } from './config.ts'
import { parseEther } from 'viem'
import { getL2TransactionHashes } from 'viem/op-stack'

export async function Bridge() {
  try {
    console.log("Simulating deposit from L1 to L2...")

    const args = await publicClientL2.buildDepositTransaction({
      mint: parseEther('0.0000001'),
      to: account.address
    })

    console.log("Deposit transaction built:", args)

    const hash = await walletClientL1.depositTransaction(args)
    console.log("L1 transaction hash:", hash)

    const receipt = await publicClientL1.waitForTransactionReceipt({ hash })
    console.log("L1 transaction receipt:", receipt)

    const [l2Hash] = getL2TransactionHashes(receipt)
    console.log("L2 transaction hash:", l2Hash)

    const l2Receipt = await publicClientL2.waitForTransactionReceipt({
      hash: l2Hash
    })
    console.log("L2 transaction receipt:", l2Receipt)

    console.log("Deposit simulation completed successfully!")
  } catch (error) {
    console.error("Error during deposit simulation:", error)
  }
}
