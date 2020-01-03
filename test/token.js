import {ethers} from "ethers";
import {wrapDocument, getData} from "@govtechsg/open-attestation";
import {WriteableToken, ReadOnlyToken} from "../src/index";
import {getBatchMerkleRoot} from "../src/util/token";
import ropstenTokenDocument from "../fixtures/tokenRopstenValid.json";

const {expect} = require("chai").use(require("chai-as-promised"));

const ERC721 = artifacts.require("ERC721MintableFull");

describe("Token", () => {
  let ERC721Instance;
  let ERC721Address;
  let provider;
  let owner1;
  let owner2;
  let sampleDocument;

  const replaceTokenRegistry = (document, newTokenRegistryAddress) => {
    const unwrappedDocument = getData(document);
    unwrappedDocument.issuers[0].tokenRegistry = newTokenRegistryAddress;
    return wrapDocument(unwrappedDocument);
  };

  beforeEach("", async () => {
    ERC721Instance = await ERC721.new("foo", "bar");
    ERC721Address = ERC721Instance.address;
    provider = new ethers.providers.Web3Provider(web3.currentProvider);
    owner1 = provider.getSigner(1);
    owner2 = provider.getSigner(2);
    sampleDocument = replaceTokenRegistry(ropstenTokenDocument, ERC721Address);
    await ERC721Instance.safeMint(await owner1.getAddress(), getBatchMerkleRoot(sampleDocument));
  });

  describe("ReadOnlyToken", () => {
    it("should work without a wallet for read operations", async () => {
      const token = new ReadOnlyToken({document: sampleDocument, web3Provider: provider});
      expect(await token.getOwner()).to.deep.equal(await owner1.getAddress());
    });
  });

  describe("WriteableToken", () => {
    it("should be able to transfer ownership with a wallet", async () => {
      const token = new WriteableToken({document: sampleDocument, web3Provider: provider, wallet: owner1});

      expect(await token.getOwner()).to.deep.equal(await owner1.getAddress());
      await token.transferOwnership(await owner2.getAddress());

      expect(await token.getOwner()).to.deep.equal(await owner2.getAddress());
    });
  });
});
