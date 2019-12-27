import { get } from "lodash";
import Token from ".";
import { tokenRopstenValid } from "../fixtures/tokenRopstenValid";
import { tokenRopstenInvalid } from "../fixtures/tokenRopstenInvalid";

/* eslint-disable global-require */
jest.mock("./util/provider", () => ({
  getProvider: require("ganache-cli").provider
}));
/* eslint-enable global-require */
jest.mock("./util/token", () => {
  function getOwnerOf() {
    return Promise.resolve("0x37242939c5b691d0a9402b21cbd61acd287e552b");
  }
  function transferTokenOwnership(_from: string, _to: string, _token: string) {
    return Promise.resolve({ owner: _to, token: _token });
  }
  return { getOwnerOf, transferTokenOwnership };
});

describe("token info", () => {
  it("should initialize the contract and set the member variable", () => {
    const instance = new Token(tokenRopstenValid);
    expect(instance.document).toEqual(tokenRopstenValid);
  });

  it("should throw error if more than 1 issuers", async () => {
    const instance = new Token(tokenRopstenInvalid);
    expect(instance.getOwner()).rejects.toEqual(new Error("Token must have exactly one token registry contract"));
  });

  it("should return the owner of the token", async () => {
    const instance = new Token(tokenRopstenValid);
    const owner = await instance.getOwner();
    expect(owner).toEqual("0x37242939c5b691d0a9402b21cbd61acd287e552b");
  });

  it("should transfer the ownership of the token", async () => {
    const instance = new Token(tokenRopstenValid);
    const web3Provider = jest.spyOn(instance, "getSigner");
    web3Provider.mockImplementationOnce(() => Promise.resolve("0xA"));
    const res = await instance.transferOwnership("0xA");
    const tokenId = `0x${get(instance.document, "signature.targetHash")}`;
    expect(res).toEqual({ token: tokenId, owner: "0xA" });
  });
});
