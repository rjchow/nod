import * as ethers from "ethers";
import { contractInstance } from "./contractInstance";
import { abi as tokenRegistryAbi } from "../../../build/contracts/ERC721MintableFull.json";

jest.mock("ethers");
/* eslint-disable global-require */
jest.mock("../../util/provider", () => ({
  getProvider: require("ganache-cli").provider
}));
/* eslint-enable global-require */
it("creates a ethers.Contract instance with the right provider", () => {
  contractInstance({
    contractAddress: "0x0A"
  });

  // @ts-ignore
  expect(ethers.Contract.mock.calls[0][0]).toEqual("0x0A");
  // @ts-ignore
  expect(ethers.Contract.mock.calls[0][1]).toEqual(tokenRegistryAbi);
});
