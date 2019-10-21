import { Document, getData } from "@govtechsg/open-attestation";
import { getLogger } from "./util/logger";
import { getProvider } from "./util/provider";
import { getOwnerOf } from "./util/token";

const { trace } = getLogger("TokenInfo:");

interface TokenInterface {
  document: Document;
  web3Provider: any;
  ownerOf(_tokenId: string): any;
}

/**
 * This function says hello.
 * @param name Some name to say hello for.
 * @returns The hello.
 */
class Token implements TokenInterface {
  document: Document;

  web3Provider: any;

  constructor(_document: Document, _web3Provider?: any) {
    this.document = _document;
    this.web3Provider = _web3Provider || getProvider();
  }

  ownerOf(_tokenId: string): any {
    try {
      trace("find owner of:", _tokenId);
      const data = getData(this.document);
      const issuers = data.issuers || [];
      return getOwnerOf(_tokenId, issuers);
    } catch (e) {
      throw new Error(e.message);
    }
  }
}

export default Token;
