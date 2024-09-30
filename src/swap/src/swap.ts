import { createWalletClient, http, parseGwei } from 'viem'
import { mainnet } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'

interface quote {
  fromChain: string,
  toChain: string,
  fromToken: string,
  toToken: string,
  fromAmount: string,
  fromAddress: `0x${string}`
}

const API_URL: `https://li.quest/${string}` = "https://li.quest/v1/quote";

async function getQuote({fromChain, toChain, fromToken, toToken, fromAmount, fromAddress}: quote): Promise<any | Error> {
  const query_params: string = `?fromChain=${fromChain}&toChain=${toChain}&fromToken=${fromToken}&toToken=${toToken}&fromAmount=${fromAmount}&fromAddress=${fromAddress}`;
  const options: {method: string, headers: {accept: string}} = {
    method: 'GET',
    headers: {accept: 'application/json'}
  }

  const response: Response = await fetch(API_URL + query_params, options);
  return await response.json();
}

async function swap({fromChain, toChain, fromToken, toToken, fromAmount, fromAddress}: quote) {
  const client = createWalletClient({
    chain: mainnet,
    transport: http(),
    account: privateKeyToAccount('')
  })

  const quote = await getQuote({
    fromChain: fromChain,
    toChain: toChain,
    fromToken: fromToken,
    toToken: toToken,
    fromAmount: fromAmount,
    fromAddress: fromAddress
  });

  console.log(quote.transactionRequest);

  const tx = await client.sendTransaction({
    to: quote.transactionRequest.to,
    data: quote.transactionRequest.data,
    gasPrice: quote.transactionRequest.gasPrice,
    gasLimit: quote.transactionRequest.gasLimit,
  });

  console.log('Tx:', tx);
}

const fromChain = 'ETH';
const fromToken = 'USDC';
const toChain = 'POL';
const toToken = 'USDC';
const fromAmount = '1000000';
const fromAddress = '0x418Fb5029dCEB014390BF12718ef3Ca5AB4AC673';

swap({fromChain, toChain, fromToken, toToken, fromAmount, fromAddress}).then(r => console.log(r));