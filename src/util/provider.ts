import { ethers } from "ethers";

export const getProvider = () => {
  const { web3 } = <any>window;
  const alreadyInjected = typeof web3 !== "undefined";

  if (!alreadyInjected) throw new Error("Metamask cannot be found");
  return new ethers.providers.Web3Provider(web3.currentProvider);
};
