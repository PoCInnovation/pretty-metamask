import { client } from './client';

export const getBalance = async (address: any): Promise<bigint> => {
  return await client.getBalance({ address: address });
}