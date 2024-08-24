import type { AlchemyConfig } from "alchemy-sdk";
import { Network, Alchemy } from "alchemy-sdk";
import { time } from "console";

interface Config {
  apiKey: string;
  network: Network;
}

const config: Config = {
  apiKey: 'aKVhzlNCwLMUs1hm_m7G3g00_vcuBkKh',
  network: Network.ETH_SEPOLIA,
};

const alchemy = new Alchemy(config as AlchemyConfig);

type Token = {
  id: string;
  symbol: string;
  name: string;
};

const options = {
  method: 'GET',
  headers: { accept: 'application/json' }
};

export const getBalances = async (address: string) => {
  try {
    const balances = await alchemy.core.getTokenBalances(address);
    const nonZeroBalances = balances.tokenBalances.filter((token) => {
        return token.tokenBalance !== "0x0000000000000000000000000000000000000000000000000000000000000000";
    });

    let i = 1;
    const balanceResults = [];
    updateCoinGeckoTokensValue();
    for (const token of nonZeroBalances) {
      let balance: number = 0;
      if (token.tokenBalance != null)
        balance = parseInt(token.tokenBalance, 16);
      const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);
      console.log(`The logo is ${metadata.logo}`);
      balance = balance / Math.pow(10, metadata.decimals ?? 1);
      const balanceStr: string = balance.toFixed(2);
      const value: number = 

      balanceResults.push({
        name: metadata.name,
        logo: metadata.logo,
        balance: balanceStr,
        symbol: metadata.symbol,
        decimals: metadata.decimals,
        balanceValue: null // change this
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

async function updateCoinGeckoTokensValue() {
  try {
  const apiUrl = 'https://api.coingecko.com/api/v3/coins/list';
    const response = await fetch(apiUrl, options);
    const tokens = await response.json();
    if (!localStorage.getItem("btc") || isMoreThanWeek())
      return;
    // console.log('API Response:', tokens);
    if (!Array.isArray(tokens)) {
      throw new Error('Expected an array but received: ' + typeof tokens);
    }
    const tokenMap: Record<string, string> = tokens.reduce((map: Record<string, string>, token: Token) => {
      map[token.symbol] = token.id;
      return map;
    }, {} as Record<string, string>);
    // console.log(tokenMap);
    for (const [symbol, id] of Object.entries(tokenMap)) {
      localStorage.setItem(symbol, id);
    }
    localStorage.setItem("Time", Date.now().toString());
    return;
  } catch (err) {
    console.error('Error fetching tokens:', err);
    return {};
  }
}

async function getTokensValue(id: string) {
  try {
    if (!localStorage.getItem("btc") || isMoreThanWeek())
      return;

    const apiUrl = `https://pro-api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${id}`;
    const response = await fetch(apiUrl, options);
    const tokens = await response.json();
    if (!Array.isArray(tokens)) {
      throw new Error('Expected an array but received: ' + typeof tokens);
    }
    const tokenMap: Record<string, string> = tokens.reduce((map: Record<string, string>, token: Token) => {
      map[token.symbol] = token.id;
      return map;
    }, {} as Record<string, string>);
    // console.log(tokenMap);
    for (const [symbol, id] of Object.entries(tokenMap)) {
      localStorage.setItem(symbol, id);
    }
    localStorage.setItem("Time", Date.now().toString());
    return;
  } catch (err) {
    console.error('Error fetching tokens:', err);
    return {};
  }
}

function isMoreThanWeek(): boolean {
  const storedTime = localStorage.getItem('Time');

  if (!storedTime)
    return false;

  const storedTimestamp = parseInt(storedTime, 10);
  const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
  const currentTime = Date.now();

  return currentTime < (storedTimestamp + oneWeekInMilliseconds);
}