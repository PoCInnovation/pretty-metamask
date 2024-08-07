const PAGE_SIZE: number = 100

export const getNFTsForOwner = async (address: string, network: string)  => {
  const requestOptions : RequestInit = {
    method: 'GET',
    redirect: 'follow'
  }
  const apiKey : string = import.meta.env.VITE_ALCHEMY_API_KEY as string;
  const baseURL : string = `https://${network}.g.alchemy.com/nft/v3/${apiKey}/getNFTsForOwner/`

  try {
    const response : Response = await fetch(`${baseURL}?owner=${address}&pageSize=${PAGE_SIZE}`, requestOptions)
    return (await response.json()).ownedNfts
  } catch (error) {
    console.log('An error occurred:', error)
    throw error
  }
}