
import { type WalletClient } from "viem"

interface quote {
  fromChain: string,
  toChain: string,
  fromToken: string,
  toToken: string,
  fromAmount: string,
  fromAddress: `0x${string}`
}

const API_URL: `https://li.quest/${string}` = "https://li.quest/v1/";

async function getQuote({fromChain, toChain, fromToken, toToken, fromAmount, fromAddress}: quote): Promise<any | Error> {
  const query_params: string = `?fromChain=${fromChain}&toChain=${toChain}&fromToken=${fromToken}&toToken=${toToken}&fromAmount=${fromAmount}&fromAddress=${fromAddress}`;
  const options: {method: string, headers: {accept: string}} = {
    method: 'GET',
    headers: {accept: 'application/json'}
  }

  const response: Response = await fetch(API_URL + "quote" + query_params, options);
  return await response.json();
}

async function getAssetInfos(chainName: string, coinName: string) {
  const query_params: string = `?chain=${chainName}&token=${coinName}`;
  const options: {method: string, headers: {accept: string}} = {
    method: 'GET',
    headers: {accept: 'application/json'}
  }

  const response: Response = await fetch(API_URL + "token" + query_params, options);
  const json = await response.json();
  return json;
}

async function swap(fromChain: number, fromToken: string, toToken: string, fromAmount: string, fromAddress: `0x${string}`) {

  const quote = await getQuote({
    fromChain: fromChain.toString(),
    toChain: fromChain.toString(),
    fromToken: fromToken,
    toToken: toToken,
    fromAmount: fromAmount,
    fromAddress: fromAddress,
  });
  console.log(quote.transactionRequest);
  return quote
}

async function bridge(fromChain: string, toChain: string, fromToken: string, toToken: string, fromAmount: string, fromAddress: `0x${string}`) {

  const quote = await getQuote({
    fromChain: fromChain,
    toChain: toChain,
    fromToken: fromToken,
    toToken: toToken,
    fromAmount: fromAmount,
    fromAddress: fromAddress
  });
  console.log(quote.transactionRequest);
  return quote
}

export { swap, bridge, getAssetInfos }
export type { quote }
