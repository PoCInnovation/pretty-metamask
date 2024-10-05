export const addImportedNFTs = (NFT: any): boolean => {
  let NFTsList: any = window.localStorage.getItem('ImportedNFTs')

  if (NFTsList === null) {
    NFTsList = []
  } else {
    NFTsList = JSON.parse(NFTsList)
  }

  if (errorHandling(NFTsList, NFT)) return true
  NFTsList.push(NFT)
  window.localStorage.setItem('ImportedNFTs', JSON.stringify(NFTsList))
  return false
}

const errorHandling = (NFTsList: any, NFT: any): boolean => {
  const isAlreadyImported = NFTsList.some((existingNFT: any) => existingNFT.contract.address === NFT.contract.address && existingNFT.tokenId === NFT.tokenId)
  if (isAlreadyImported) {
    return true
  }
  return false
}
