import { Issuer } from "../types";
import { contractInstance } from "../common/smartContract/contractInstance";

export const getOwnerOf = (_tokenId: string, issuers: Issuer[]) => {
  const contractInstances = issuers.map(issuer =>
    issuer.tokenRegistry ? contractInstance({ contractAddress: issuer.tokenRegistry }) : null
  );
  const owner = contractInstances.map(instance => instance.ownerOf(_tokenId)).find(o => o);
  if (!owner) {
    throw new Error("Invalid Document");
  }
  return owner;
};
