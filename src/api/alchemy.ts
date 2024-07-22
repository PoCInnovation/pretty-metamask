// alchemy.ts
import type { AlchemyConfig } from "alchemy-sdk";
import { Network, Alchemy } from "alchemy-sdk";

interface Config {
  apiKey: string;
  network: Network;
}

const config: Config = {
  apiKey: import.meta.env.VITE_ALCHEMY_API_KEY as string,
  network: Network.ETH_SEPOLIA,
};

const alchemy = new Alchemy(config as AlchemyConfig);

export const getBalances = async (address: string) => {
  try {
    const balances = await alchemy.core.getTokenBalances(address);
    const nonZeroBalances = balances.tokenBalances.filter((token) => {
        return token.tokenBalance !== "0x0000000000000000000000000000000000000000000000000000000000000000";
    });
    // console.log(`The balances of ${address} address are:`, nonZeroBalances);

    // let i = 1;
    const balanceResults = [];

    for (const token of nonZeroBalances) {
      let balance: number = 0;
      // console.log(`token balance ${token.tokenBalance}`);
      if (token.tokenBalance != null)
        balance = parseInt(token.tokenBalance, 16);
      const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);

      balance = balance / Math.pow(10, metadata.decimals ?? 1);
      const balanceStr: string = balance.toFixed(2);
      balanceResults.push({
        name: metadata.name,
        balance: balanceStr,
        symbol: metadata.symbol,
        decimals: metadata.decimals
      });
    }
    // console.log(`${i++}. ${metadata.name}: ${balanceStr} ${metadata.symbol} decimals is ${metadata.decimals}`);
    return balanceResults;
  } catch (error) {
    console.error(`Failed to fetch token balances:`, error);
    return [];
  }
};

// const runMain = async () => {
//   try {
//     await getBalances("0x439d71C47858c31bcaDc0EdBc41969d5BFB413f4");
//     process.exit(0);
//   } catch (error) {
//     console.error(`Error in main function:`, error);
//     process.exit(1);
//   }
// };

// if (process.argv[1] === fileURLToPath(import.meta.url)) {
//   runMain();
// }