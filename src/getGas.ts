import { Network, Alchemy } from "alchemy-sdk";
import type { AlchemyConfig } from "alchemy-sdk";
import { BigNumber} from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";


interface Config {
    apiKey: string;
    network: Network;
  }
  
const config: Config = {
  apiKey: 'aKVhzlNCwLMUs1hm_m7G3g00_vcuBkKh',
  network: Network.ETH_MAINNET,
};

export async function getGas(network: Network): Promise<string> {
    config.network = network;
    const alchemy = new Alchemy(config as AlchemyConfig);
    const gasPrice: BigNumber = await alchemy.core.getGasPrice();
    return Number(formatUnits(gasPrice, "gwei")).toFixed(2);
}