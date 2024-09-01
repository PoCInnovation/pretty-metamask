import type { AlchemyConfig } from "alchemy-sdk";
import { Network, Alchemy } from "alchemy-sdk";
import { BigNumber } from 'bignumber.js';

interface Config {
  apiKey: string;
  network: Network;
}

const config: Config = {
  apiKey: 'aKVhzlNCwLMUs1hm_m7G3g00_vcuBkKh',
  network: Network.ETH_MAINNET,
};

type Token = {
  id: string;
  symbol: string;
  name: string;
};

type BalanceToken = {
  name: string;
  logo: string;
  balance: string;
  symbol: string;
  decimals: number;
  balanceValue: string | null;
}

const options = {
  method: 'GET',
  headers: { accept: 'application/json' }
};


export const processAll = async (address: string, network: Network) => {

  const balanceTokens = await getBalances(address, network);

  await updateCoinGeckoTokensValue();
  const map = new Map<string, string>();

  // recup les id dans le local storage, il faut l'id pas le symbol....
  balanceTokens.forEach(result => {
    const symbol = result.symbol;
    const value = localStorage.getItem(symbol);
    
    if (value !== null) {
        map.set(symbol, value);
    }
  });

  await getTokensValue(map, balanceTokens);
  return balanceTokens;
}

async function getBalances(address: string, network: Network): Promise<BalanceToken[]> {
  try {
    config.network = network;
    const alchemy = new Alchemy(config as AlchemyConfig);
    const balances = await alchemy.core.getTokenBalances(address);
    const nonZeroBalances = balances.tokenBalances.filter((token) => {
        return token.tokenBalance !== "0x0000000000000000000000000000000000000000000000000000000000000000";
    });

    const balanceResults: BalanceToken[] = [];

    for (const token of nonZeroBalances) {
      let balance: BigNumber = new BigNumber(0); // Use BigNumber for precision
      if (token.tokenBalance != null) {
        balance = new BigNumber(token.tokenBalance);
      }

      const metadata = await alchemy.core.getTokenMetadata(token.contractAddress);
      if (metadata.name == null || metadata.symbol == null) continue;

      const decimals = metadata.decimals ?? 18;

      const factor = new BigNumber(10).pow(decimals);
      const formattedBalance = balance.div(factor).toFixed(2);

      balanceResults.push({
        name: metadata.name,
        logo: metadata.logo ? metadata.logo : 'img/question.png',
        balance: formattedBalance,
        symbol: metadata.symbol,
        decimals: decimals,
        balanceValue: null
      });
    }
    return balanceResults

  } catch (error) {
    console.log(`${address}`)
    console.error(`Failed to fetch token balances:`, error);
    return [];
  }
};

/**
 * Set all CoinGecko tokens in localStorage with the format <symbol, id>.
 * Also updates the 'Time' variable in localStorage to reflect the last update time.
 *
 * This function fetches the latest token data from CoinGecko and stores it 
 * in localStorage as a map of token symbols to their corresponding IDs.
 */
async function updateCoinGeckoTokensValue() {
  try {
    const apiUrl = 'https://api.coingecko.com/api/v3/coins/list';
    const response = await fetch(apiUrl, options);
    const tokens = await response.json();
    if (!localStorage.getItem("btc") || isMoreThanWeek())
      return;
    console.log('API Response:', tokens);
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

/**
 * Get a string array of all wallets tokens symbol.
 * fetch all data from the coingecko api and return a Map with sym.
 */
async function getTokensValue(id: Map<string, string> , balanceTokens: BalanceToken[]) {
  try {
    if (id == null) {
      return;
    }

    const valueString = Array.from(id.values()).join(", ");
    console.log(`valueString is ${valueString}`); 

    const apiUrl = `https://pro-api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${valueString}`;
    const response = await fetch(apiUrl, options);
    const tokens = await response.json();

    if (!Array.isArray(tokens)) {
      throw new Error('Expected an array but received: ' + typeof tokens);
    }

    balanceTokens.forEach(token => {
      const tokenId = id.get(token.symbol); // Get the corresponding ID for the symbol
      if (tokenId) {
        const matchingToken = tokens.find(t => t.id === tokenId); // Find the corresponding token from the API response
        if (matchingToken) {
          token.balanceValue = matchingToken.current_price.toString(); // Update balanceValue
        }
      }
    });
    
  } catch (err) {
    console.error('Error fetching tokens:', err);
    return;
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