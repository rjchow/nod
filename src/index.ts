import { Document, getData } from "@govtechsg/open-attestation";
import { get } from "lodash";
import { getLogger } from "./util/logger";
import { getProvider } from "./util/provider";
import { getOwnerOf, transferTokenOwnership } from "./util/token";

const { trace } = getLogger("TokenInfo:");

interface TokenInterface {
  document: Document;
  web3Provider: any;
  ownerOf(_tokenId: string): any;
}

/**
 * Class Token to interact with ERC721 contract.
 */
class Token implements TokenInterface {
  document: Document;

  web3Provider: any;

  constructor(_document: Document, _web3Provider?: any) {
    this.document = _document;
    this.web3Provider = _web3Provider || getProvider();
  }

  private getIssuers(): Object[] {
    const data = getData(this.document);
    return data.issuers || [];
  }

  public async ownerOf(): Promise<string> {
    try {
      const tokenId = `0x${get(this.document, "[0].signature.targetHash")}`;
      trace("find owner of:", tokenId);
      return await getOwnerOf(tokenId, this.getIssuers());
    } catch (e) {
      throw new Error(e.message);
    }
  }

  public async transferOnwership(_to: string): Promise<boolean> {
    try {
      const from: string = await this.ownerOf();
      const tokenId = `0x${get(this.document, "[0].signature.targetHash")}`;
      trace(`transfer token ${tokenId} from ${from} to ${_to}`);
      return await transferTokenOwnership(from, _to, tokenId, this.getIssuers());
    } catch (e) {
      throw new Error(e.message);
    }
  }
}

export default Token;
