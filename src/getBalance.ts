import { pubClient } from "./main";

export const getBalance = async (address: any): Promise<bigint> => {
  return await pubClient.getBalance({ address: address });
}