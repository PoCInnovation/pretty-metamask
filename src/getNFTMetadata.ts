export const getNFTMetadata = async (contractAddress: string, tokenId: number, network: string) => {
  const requestOptions = {
    method: 'GET',
    headers: {accept: 'application/json'}
  }
  const apiKey : string = import.meta.env.VITE_ALCHEMY_API_KEY as string;
  const baseURL : string = `https://${network}.g.alchemy.com/nft/v3/${apiKey}/getNFTMetadata/`

  try {
    const response = await fetch(`${baseURL}?contractAddress=${contractAddress}&tokenId=${tokenId}`, requestOptions)
    return await response.json()
  } catch (error) {
    console.log('An error occurred:', error)
    throw error
  }
}