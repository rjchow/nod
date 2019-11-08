import { Document, getData } from "@govtechsg/open-attestation";
import { get } from "lodash";
import { getLogger } from "./util/logger";
import { getProvider } from "./util/provider";
import { getOwnerOf, transferTokenOwnership } from "./util/token";
import { Issuer, TransferOwnership } from "./types";

const { trace } = getLogger("TokenInfo:");

interface TokenInterface {
  document: Document;
  web3Provider: any;
  getOwner(): Promise<string>;
  transferOwnership(to: string): Promise<object>;
}

/**
 * Class Token to interact with ERC721 contract.
 */
class Token implements TokenInterface {
  document: Document;

  web3Provider: any;

  constructor(document: Document, web3Provider?: any) {
    this.document = document;
    this.web3Provider = web3Provider || getProvider();
  }

  private getIssuer(): Issuer {
    const data = getData(this.document);
    if (data.issuers.length > 1) throw new Error("Token must have exactly one token registry contract");
    if (!data.issuers[0].tokenRegistry) throw new Error("Token must have token registry in it");
    return data.issuers[0];
  }

  public getSigner(): Promise<string> {
    return this.web3Provider.getSigner(0);
  }

  public async getOwner(): Promise<string> {
    const tokenId = `0x${get(this.document, "signature.targetHash")}`;
    trace("find owner of:", tokenId);
    return getOwnerOf(tokenId, this.getIssuer());
  }

  public async transferOwnership(to: string): Promise<TransferOwnership> {
    const from: string = await this.getOwner();
    const signer = await this.getSigner();
    const tokenId = `0x${get(this.document, "signature.targetHash")}`;
    trace(`transfer token ${tokenId} from ${from} to ${to}`);
    trace(`admin address: ${signer}`);
    return transferTokenOwnership(from, to, tokenId, this.getIssuer(), signer);
  }
}

export default Token;
