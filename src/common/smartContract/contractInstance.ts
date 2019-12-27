import * as ethers from "ethers";
import { getProvider } from "../../util/provider";
import { abi as tokenRegistryAbi } from "../../../build/contracts/ERC721MintableFull.json";

interface ContractInstance {
  contractAddress: string;
  signer?: string;
}
export const contractInstance = ({ contractAddress, signer }: ContractInstance) => {
  return new ethers.Contract(contractAddress, tokenRegistryAbi, signer || getProvider());
};
