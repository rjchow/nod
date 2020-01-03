import {ethers} from "ethers";
import {TokenRegistry} from "../src/index";

const {expect} = require("chai").use(require("chai-as-promised"));

const ERC721 = artifacts.require("ERC721MintableFull");

describe("TokenRegistry", () => {
  let ERC721Instance;
  let ERC721Address;
  let provider;
  let shippingLine;
  let owner1;
  let owner2;

  const documentStub = {
    signature: {merkleRoot: "624d0d7ae6f44d41d368d8280856dbaac6aa29fb3b35f45b80a7c1c90032eeb3"}
  };

  beforeEach("", async () => {
    ERC721Instance = await ERC721.new("foo", "bar");
    ERC721Address = ERC721Instance.address;
    provider = new ethers.providers.Web3Provider(web3.currentProvider);
    shippingLine = provider.getSigner(0);
    owner1 = provider.getSigner(1);
    owner2 = provider.getSigner(2);
  });

  it("should work without a wallet for read operations", async () => {
    const tokenRegistryInstanceWithShippingLineWallet = new TokenRegistry({
      contractAddress: ERC721Address,
      web3Provider: provider,
      wallet: shippingLine
    });
    const tokenRegistryWithoutWallet = new TokenRegistry({
      contractAddress: ERC721Address,
      web3Provider: provider
    });
    const newOwner = await owner1.getAddress();
    await tokenRegistryInstanceWithShippingLineWallet.mint(documentStub, newOwner);
    const currentOwner = await tokenRegistryWithoutWallet.ownerOf(documentStub);
    expect(currentOwner).to.deep.equal(newOwner);
  });

  it("should be able to mint", async () => {
    const tokenRegistryInstance = new TokenRegistry({
      contractAddress: ERC721Address,
      web3Provider: provider,
      wallet: shippingLine
    });
    const newOwner = await owner1.getAddress();
    await tokenRegistryInstance.mint(documentStub, newOwner);
    const currentOwner = await tokenRegistryInstance.ownerOf(documentStub);
    expect(currentOwner).to.deep.equal(newOwner);
  });

  it("should be able to transfer", async () => {
    const tokenRegistryInstanceWithShippingLineWallet = new TokenRegistry({
      contractAddress: ERC721Address,
      web3Provider: provider,
      wallet: shippingLine
    });
    const newOwner = await owner1.getAddress();
    await tokenRegistryInstanceWithShippingLineWallet.mint(documentStub, newOwner);
    const currentOwner = await tokenRegistryInstanceWithShippingLineWallet.ownerOf(documentStub);
    expect(currentOwner).to.deep.equal(newOwner);

    const tokenRegistryInstanceWithOwner1Wallet = new TokenRegistry({
      contractAddress: ERC721Address,
      web3Provider: provider,
      wallet: owner1
    });
    const nextOwnerAddress = await owner2.getAddress();
    await tokenRegistryInstanceWithOwner1Wallet.transferTo(documentStub, nextOwnerAddress);
    const nextOwner = await tokenRegistryInstanceWithOwner1Wallet.ownerOf(documentStub);
    expect(nextOwner).to.deep.equal(nextOwnerAddress);
  });

  it("non-owner should not be able to initiate a transfer", async () => {
    const tokenRegistryInstanceWithShippingLineWallet = new TokenRegistry({
      contractAddress: ERC721Address,
      web3Provider: provider,
      wallet: shippingLine
    });
    const newOwner = await owner1.getAddress();
    await tokenRegistryInstanceWithShippingLineWallet.mint(documentStub, newOwner);
    const currentOwner = await tokenRegistryInstanceWithShippingLineWallet.ownerOf(documentStub);
    expect(currentOwner).to.deep.equal(newOwner);

    const tokenRegistryInstanceWithOwner2Wallet = new TokenRegistry({
      contractAddress: ERC721Address,
      web3Provider: provider,
      wallet: owner2
    });
    const nextOwnerAddress = await owner2.getAddress();
    const transferTxShouldFail = tokenRegistryInstanceWithOwner2Wallet.transferTo(documentStub, nextOwnerAddress);

    await expect(transferTxShouldFail).to.be.rejectedWith(/execution error: revert/);
  });
});
