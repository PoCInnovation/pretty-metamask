import { x } from "./main";

export const getBalance = async (address: string): Promise<bigint> => {
  try {
    const response = await x.post('/', {
      jsonrpc: '2.0',
      method: 'eth_getBalance',
      params: [address, 'latest'],
      id: 1
    });

    if (response.data.result) {
      return BigInt(response.data.result);
    } else {
      throw new Error('Failed to get balance');
    }
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw error;
  }
}