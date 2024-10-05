const PAGE_SIZE: number = 100

export const getNFTsForOwner = async (address: string, baseURL: string) => {
  const requestOptions: RequestInit = {
    method: 'GET',
    redirect: 'follow'
  }
  console.log('baseURL:', baseURL)

  try {
    const response: Response = await fetch(
      `${baseURL}?owner=${address}&pageSize=${PAGE_SIZE}`,
      requestOptions
    )
    console.log('response:', response)
    return (await response.json()).ownedNfts
  } catch (error) {
    console.log('An error occurred:', error)
    throw error
  }
}
