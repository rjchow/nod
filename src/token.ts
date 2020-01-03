import {WrappedDocument} from "@govtechsg/open-attestation";
import {ethers} from "ethers";
import {getIssuer} from "./util/token";
import {TokenRegistry} from "./registry";
import {EthereumNetwork} from "./types";

/**
 * Class Token to read info from ERC721 contract.
 */
export class ReadOnlyToken {
  document: WrappedDocument;

  web3Provider: ethers.providers.BaseProvider;

  tokenRegistry: TokenRegistry;

  constructor({
    document,
    web3Provider,
    network = EthereumNetwork.Ropsten // Default to Ropsten since we currently only operate on Ropsten
  }: {
    document: WrappedDocument;
    web3Provider?: ethers.providers.BaseProvider;
    network?: EthereumNetwork;
  }) {
    this.document = document;
    this.web3Provider = web3Provider || ethers.getDefaultProvider(network);
    this.tokenRegistry = new TokenRegistry({
      contractAddress: getIssuer(document).tokenRegistry,
      web3Provider: this.web3Provider
    });
  }

  // isIssued?
  public async getOwner(): Promise<string> {
    return this.tokenRegistry.ownerOf(this.document);
  }
}

export class WriteableToken extends ReadOnlyToken {
  wallet: ethers.Wallet;

  constructor({
    document,
    web3Provider,
    wallet,
    network = EthereumNetwork.Ropsten // Default to Ropsten since we currently only operate on Ropsten
  }: {
    document: WrappedDocument;
    web3Provider?: ethers.providers.BaseProvider;
    wallet: ethers.Wallet;
    network?: EthereumNetwork;
  }) {
    super({document, web3Provider, network});

    this.wallet = wallet;
    this.tokenRegistry = new TokenRegistry({
      contractAddress: getIssuer(this.document).tokenRegistry,
      web3Provider: this.web3Provider,
      wallet
    });
  }

  async transferOwnership(to: string) {
    return this.tokenRegistry.transferTo(this.document, to);
  }
}
