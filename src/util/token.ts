import { Issuer } from "../types";
import { contractInstance } from "../common/smartContract/contractInstance";

const getContractInstance = (issuers: Issuer[]) => {
  return issuers
    .map(issuer => (issuer.tokenRegistry ? contractInstance({ contractAddress: issuer.tokenRegistry }) : null))
    .filter(instance => !instance);
};

export const getOwnerOf = async (_tokenId: string, issuers: Issuer[]): Promise<string> => {
  const contractInstances = getContractInstance(issuers);

  const result = await Promise.all(contractInstances.map(instance => instance.ownerOf(_tokenId)));
  const owner = result.find(o => o);
  return owner;
};

export const transferTokenOwnership = async (_from: string, _to: string, _tokenId: string, issuers: Issuer[]) => {
  try {
    const contractInstances = getContractInstance(issuers);
    await Promise.all(contractInstances.map(instance => instance.transferFrom(_from, _to, _tokenId)));
    return true;
  } catch (e) {
    throw new Error(e.message);
  }
};
