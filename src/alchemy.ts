import type { AlchemyConfig } from "alchemy-sdk";
import { Network, Alchemy } from "alchemy-sdk";

interface Config {
  apiKey: string;
  network: Network;
}

const config: Config = {
  apiKey: 'aKVhzlNCwLMUs1hm_m7G3g00_vcuBkKh',
  network: Network.ETH_SEPOLIA,
};

const alchemy = new Alchemy(config as AlchemyConfig);



export const getBalances = async (address: string) => {
  try {
    const balances = await alchemy.core.getTokenBalances(address);
    const nonZeroBalances = balances.tokenBalances.filter((token) => {
        return token.tokenBalance !== "0x0000000000000000000000000000000000000000000000000000000000000000";
    });

    let i = 1;
    const balanceResults = [];

    for (const token of nonZeroBalances) {
      let balance: number = 0;
      if (token.tokenBalance != null)
        balance = parseInt(token.tokenBalance, 16);
      const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);
      console.log(`The logo is ${metadata.logo}`);
      balance = balance / Math.pow(10, metadata.decimals ?? 1);
      const balanceStr: string = balance.toFixed(2);
      balanceResults.push({
        name: metadata.name,
        logo: metadata.logo,
        balance: balanceStr,
        symbol: metadata.symbol,
        decimals: metadata.decimals
      });
      console.log(`${i++}. ${metadata.name}: ${balanceStr} ${metadata.symbol} decimals is ${metadata.decimals}`);
    }
    
    return balanceResults;
  } catch (error) {
    console.log(`${address}`)
    console.error(`Failed to fetch token balances:`, error);
    return [];
  }
};