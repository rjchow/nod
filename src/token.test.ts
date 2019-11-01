import Token from ".";
import { tokenRopstenValid } from "../test/fixtures/tokenRopstenValid";
/* eslint-disable global-require */
jest.mock("./util/provider", () => {
  function getProvider() {
    return require("ganache-cli").provider();
  }
  return { getProvider };
});
/* eslint-enable global-require */
jest.mock("./util/token", () => {
  function getOwnerOf() {
    return Promise.resolve("0x37242939c5b691d0a9402b21cbd61acd287e552b");
  }
  function transferTokenOwnership() {
    return Promise.resolve(true);
  }
  return { getOwnerOf, transferTokenOwnership };
});

describe("token info", () => {
  it("should initialize the contract and set the member variable", () => {
    const instance = new Token(tokenRopstenValid);
    expect(instance.document).toEqual(tokenRopstenValid);
  });

  it("should return the owner of the token", async () => {
    const instance = new Token(tokenRopstenValid);
    const owner = await instance.ownerOf();
    expect(owner).toEqual("0x37242939c5b691d0a9402b21cbd61acd287e552b");
  });

  it("should transfer the ownership of the token", async () => {
    const instance = new Token(tokenRopstenValid);
    const res = await instance.transferOnwership("0xA");
    expect(res).toEqual(true);
  });
});
