import type { AlchemyConfig } from "alchemy-sdk";
import { Network, Alchemy, Utils } from "alchemy-sdk";
import { BigNumber } from 'bignumber.js';
import { getBalance } from './getBalance'
import { chain } from './multichain'

interface Config {
  apiKey: string;
  network: Network;
}

const config: Config = {
  apiKey: 'aKVhzlNCwLMUs1hm_m7G3g00_vcuBkKh',
  network: chain.value.alchemyNetwork,
};

interface CoinGeckoToken {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi?: string;
  last_updated: string;
  price_change_percentage_1h?: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

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


export const processAll = async (address_: `0x${string}`, network_: Network) => {

  const balanceTokens: BalanceToken[] = await getBalances2(address_, network_);

  await updateCoinGeckoTokensValue();
  const map = new Map<string, string>();

  balanceTokens.forEach(result => {
    const symbol = result.symbol.toLowerCase();
    const value = localStorage.getItem(symbol);
    console.log(`symbol is ${symbol}, value ${value}`);
    if (value !== null) {
        map.set(symbol, value);
    }
  });
  if (balanceTokens.length > 0)
    await setEth(address_, map, balanceTokens);
  await getTokensValue(map, balanceTokens);
  return balanceTokens.sort((a, b) => {
    const aValue = a.balanceValue ? parseFloat(a.balanceValue) : 0;
    const bValue = b.balanceValue ? parseFloat(b.balanceValue) : 0;
    return bValue - aValue;
  });
}

async function setEth(address_: `0x${string}`, map: Map<string, string>, balanceTokens: BalanceToken[]) {
  const weiValue = await getBalance(address_ as string)

  map.set('eth', 'ethereum');

  const balanceEth: string = Utils.formatEther(weiValue);

  balanceTokens.push({
    name: 'Etherum',
    logo: '/img/eth_logo.png',
    balance: balanceEth,
    symbol: 'eth',
    decimals: 18,
    balanceValue: null
  });
}

async function getBalances2(address_: `0x${string}`, network: Network): Promise<BalanceToken[]> {
  try {
    config.network = network;
    console.log("network is ",network);
    const alchemy = new Alchemy(config as AlchemyConfig);
    const balances = await alchemy.core.getTokenBalances(address_);
    const nonZeroBalances = balances.tokenBalances.filter((token) => {
        return token.tokenBalance !== "0x0000000000000000000000000000000000000000000000000000000000000000";
    });

    const balanceResults: BalanceToken[] = [];

    for (const token of nonZeroBalances) {
      let balance: BigNumber = new BigNumber(0);
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
    console.log(`${address_}`)
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
    if (localStorage.getItem("btc") || isMoreThanWeek())
      return;

    if (!Array.isArray(tokens)) {
      throw new Error('Expected an array but received: ' + typeof tokens);
    }
    const tokenMap: Record<string, string> = tokens.reduce((map: Record<string, string>, token: Token) => {
      map[token.symbol] = token.id;
      console.log(`token symbol : ${token.symbol}, token id : ${token.id}`)
      return map;
    }, {} as Record<string, string>);
    // console.log(tokenMap);
    for (const [symbol, id] of Object.entries(tokenMap)) {
      localStorage.setItem(symbol, id);
    }
    localStorage.setItem("TimeOfLastUpdate", Date.now().toString());
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

    const valueString = Array.from(id.values()).join(",");
    console.log(`valueString is ${valueString}`);

    const apiUrl = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${valueString}&x_cg_demo_api_key=CG-X2ove9UTHLYyzyJYeYiQgY9T`;

    const response = await fetch(apiUrl, options);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
    }
    
    const tokens: CoinGeckoToken[] = await response.json();

    if (!Array.isArray(tokens)) {
      throw new Error(`Expected an array but received: ${typeof tokens}`);
    }

    console.log("Data from coingecko is ready")
    balanceTokens.forEach(token => {
      const tokenId = id.get(token.symbol.toLowerCase());
      if (tokenId) {
        const matchingToken = tokens.find(t => t.id === tokenId);
        if (matchingToken) {
          if (typeof matchingToken.current_price === 'number') {
            console.log(`Token ID: ${tokenId}, Current Price: ${matchingToken.current_price}`);
            token.balanceValue = formatBalanceValue(matchingToken.current_price, parseInt(token.balance));
            console.log(`The user have: ${token.balanceValue}$`);
          } else {
            console.warn(`Current price is invalid for token ID: ${tokenId}`);
            token.balanceValue = null;
          }
        } else {
          console.log(`There is not correspondence for ${tokenId}`);
        }
      }
    });
    
  } catch (err) {
    console.error('Error fetching tokens:', err);
    return;
  }
}

function formatBalanceValue(price: number, quantity: number): string {
  const result: number = price * quantity;

  if (result > 10000)
    return result.toExponential(3);
  else
    return result.toPrecision(2);
}

function isMoreThanWeek(): boolean {
  const storedTime = localStorage.getItem('TimeOfLastUpdate');

  if (!storedTime)
    return false;

  const storedTimestamp = parseInt(storedTime, 10);
  const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
  const currentTime = Date.now();

  return currentTime < (storedTimestamp + oneWeekInMilliseconds);
}