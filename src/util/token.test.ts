import {WrappedDocument} from "@govtechsg/open-attestation";
import {getIssuer, getBatchMerkleRoot} from "./token";
import tokenRopstenValid from "../../fixtures/tokenRopstenValid.json";
import tokenRopstenInvalidWithTwoIssuers from "../../fixtures/tokenRopstenInvalidWithTwoIssuers.json";
import nonTokenDocument from "../../fixtures/nonTokenDocument.json";

describe("utils/token", () => {
  describe("getBatchMerkleRoot", () => {
    it("should get the batch merkle root", () => {
      const merkleRoot = getBatchMerkleRoot(<WrappedDocument>tokenRopstenValid);
      expect(merkleRoot).toEqual("0xfc714dc7efa164cd0261d511c51903be392c74698daf331f6f5e4c6be0203939");
    });
  });

  describe("getIssuer", () => {
    it("should get the document issuer", () => {
      const issuer = getIssuer(<WrappedDocument>tokenRopstenValid);
      const expectedIssuer = {
        identityProof: {location: "tradetrust.io", type: "DNS-TXT"},
        name: "DEMO STORE",
        tokenRegistry: "0x48399Fb88bcD031C556F53e93F690EEC07963Af3"
      };
      expect(issuer).toEqual(expectedIssuer);
    });

    it("should throw an error if there is more than 1 issuer", () => {
      expect(() => getIssuer(<WrappedDocument>tokenRopstenInvalidWithTwoIssuers)).toThrowError(
        /Token must have exactly one token registry contract/
      );
    });

    it("should throw an error if it is not a document with tokenRegistry", () => {
      expect(() => getIssuer(<WrappedDocument>nonTokenDocument)).toThrowError(/Token must have token registry in it/);
    });
  });
});
