export const exchangeRates = async (currency: string) => {
  try {
    return (await fetch(`https://api.coinbase.com/v2/exchange-rates?currency=${currency}`)).json()
  } catch (error) {
    console.error(error)
  }
}