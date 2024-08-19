import { useStore } from 'vuex';

export const sendTransaction = async (to: `0x${string}`, value: bigint): Promise<`0x${string}`> => {
  const store = useStore();

  const account = store.getters.selectedAccount;
  const walClient = store.getters.walletClient;

  if (!account || !walClient) {
    throw new Error("Account or Wallet Client not available");
  }

  console.log("amount", value);
  return await walClient.sendTransaction({
    account,
    to: to,
    value: value,
  });
};
