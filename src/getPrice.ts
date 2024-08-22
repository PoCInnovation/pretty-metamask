type Token = {
  id: string;
  symbol: string;
  name: string;
};

const options = {
  method: 'GET',
  headers: { accept: 'application/json' }
};

async function updateCoinGeckoTokensValue(): Promise<Record<string, string>> {
  try {
  const apiUrl = 'https://api.coingecko.com/api/v3/coins/list';
    const response = await fetch(apiUrl, options);
    const tokens = await response.json();

    // console.log('API Response:', tokens);
    if (!Array.isArray(tokens)) {
      throw new Error('Expected an array but received: ' + typeof tokens);
    }
    const tokenMap: Record<string, string> = tokens.reduce((map: Record<string, string>, token: Token) => {
      map[token.symbol] = token.id;
      return map;
    }, {} as Record<string, string>);
    // console.log(tokenMap);
    for (const [symbol, id] of Object.entries(tokenMap)) {
      localStorage.setItem(symbol, id);
    }
    return tokenMap;
  } catch (err) {
    console.error('Error fetching tokens:', err);
    return {};
  }
}

updateCoinGeckoTokensValue();
