import { type WalletClient } from "viem"

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

async function swap(wallet: WalletClient, {fromChain, toChain, fromToken, toToken, fromAmount, fromAddress}: quote) {

  const quote = await getQuote({
    fromChain: fromChain,
    toChain: toChain,
    fromToken: fromToken,
    toToken: toToken,
    fromAmount: fromAmount,
    fromAddress: fromAddress
  });

  console.log(quote.transactionRequest);

  // const tx = await wallet.sendTransaction({
  //   account: wallet.account,
  //   to: quote.transactionRequest.to,
  //   data: quote.transactionRequest.data,
  //   gasPrice: quote.transactionRequest.gasPrice,
  //   gasLimit: quote.transactionRequest.gasLimit,
  // });

  // console.log('Tx:', tx);
}
export { swap }