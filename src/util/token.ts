import {Issuer, TransferOwnership} from "../types";
import {contractInstance} from "../common/smartContract/contractInstance";

const getContractInstance = (issuer: Issuer, signer?: string) => {
  return contractInstance({contractAddress: issuer.tokenRegistry, signer});
};

export const getOwnerOf = async (tokenId: string, issuer: Issuer): Promise<string> => {
  const contractInstances = getContractInstance(issuer);
  return contractInstances.ownerOf(tokenId);
};

export const transferTokenOwnership = async (
  from: string,
  to: string,
  tokenId: string,
  issuer: Issuer,
  signer: string
): Promise<TransferOwnership> => {
  const contractInstancesWithSigner = getContractInstance(issuer, signer);
  const tx = await contractInstancesWithSigner.transferFrom(from, to, tokenId);
  return {txHash: tx.hash, token: tokenId, owner: to};
};
