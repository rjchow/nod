import * as ethers from "ethers";
import { getProvider } from "../../util/provider";
import tokenRegistryAbi from "./abi/tokenRegistry.json";

interface ContractInstance {
  contractAddress: string;
}
export const contractInstance = ({ contractAddress }: ContractInstance) => {
  return new ethers.Contract(contractAddress, tokenRegistryAbi, getProvider());
};
