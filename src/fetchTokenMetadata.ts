import { x } from './main';

export const fetchTokenMetadata = async (tokenAddress: string) => {
  const raw = {
    "jsonrpc": "2.0",
    "method": "alchemy_getTokenMetadata",
    "params": [
      `${tokenAddress}`
    ],
    "id": 42
  };

  try {
    const response = await x.post("/", raw, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const result = JSON.stringify(response.data.result, null, 2);
    console.log(result);
    return result;
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};
