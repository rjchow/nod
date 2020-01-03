import {WrappedDocument} from "@govtechsg/open-attestation";
import {ethers} from "ethers";
import {getBatchMerkleRoot} from "./util/token";
import {abi as TokenRegistryABI} from "../build/contracts/ERC721MintableFull.json";

export class TokenRegistry {
  web3Provider: ethers.providers.BaseProvider;

  address: string;

  contractInstance: ethers.Contract;

  /**
   * Creates a TokenRegistry instance with the specified address and ethersjs signer
   * @param instanceParameters
   * @param instanceParameters.contractAddress - Address that the TokenRegistry is located at
   * @param instanceParameters.web3Provider - An ethers.js signer instance with read/write access
   */
  constructor({
    contractAddress,
    web3Provider,
    wallet
  }: {
    contractAddress: string;
    web3Provider: ethers.providers.BaseProvider;
    wallet?: ethers.Wallet;
  }) {
    this.web3Provider = web3Provider;
    this.address = contractAddress;
    // doing JSON.stringify below because of ethers.js type issue: https://github.com/ethers-io/ethers.js/issues/602
    this.contractInstance = new ethers.Contract(contractAddress, JSON.stringify(TokenRegistryABI), web3Provider);
    if (wallet) {
      this.contractInstance = this.contractInstance.connect(wallet);
    }
  }

  async mint(document: WrappedDocument, owner: string) {
    const tokenId = getBatchMerkleRoot(document);
    return this.contractInstance["safeMint(address,uint256)"](owner, tokenId);
  }

  async ownerOf(document: WrappedDocument) {
    const tokenId = getBatchMerkleRoot(document);
    return this.contractInstance.ownerOf(tokenId);
  }

  async transferTo(document: WrappedDocument, newOwner: string) {
    const tokenId = getBatchMerkleRoot(document);
    const currentOwner = await this.ownerOf(document);
    return this.contractInstance["safeTransferFrom(address,address,uint256)"](currentOwner, newOwner, tokenId);
  }
}
