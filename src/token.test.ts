import Token from ".";
import { tokenRopstenValid } from "../test/fixtures/tokenRopstenValid";

jest.mock("ethers");

it("should initialize the contract and set the member variable", () => {
  const instance = new Token(tokenRopstenValid);
  expect(instance.document).toEqual(tokenRopstenValid);
});
