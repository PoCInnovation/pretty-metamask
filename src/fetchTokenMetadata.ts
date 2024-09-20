export const fetchTokenMetadata = async (tokenAddress: string) => {
  const fetchURL = `https://eth-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}`

  const raw = JSON.stringify({
    jsonrpc: '2.0',
    method: 'alchemy_getTokenMetadata',
    headers: {
      'Content-Type': 'application/json'
    },
    params: [`${tokenAddress}`],
    id: 42
  })
  const requestOptions: any = {
    method: 'POST',
    body: raw,
    redirect: 'follow'
  }
  fetch(fetchURL, requestOptions)
    .then((response) => response.json())
    .then((response) => JSON.stringify(response['result'], null, 2))
    .then((result) => console.log(result))
    .catch((error) => console.log('error', error))
}
