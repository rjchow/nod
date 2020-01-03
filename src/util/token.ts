import {get} from "lodash";
import {WrappedDocument, getData} from "@govtechsg/open-attestation";

import {Issuer} from "../types";

export const getBatchMerkleRoot = (document: WrappedDocument) => {
  return `0x${get(document, "signature.merkleRoot")}`;
};

export const getIssuer = (document: WrappedDocument): Issuer => {
  const data = getData(document);
  if (!(data.issuers.length === 1)) throw new Error("Token must have exactly one token registry contract");
  if (!data.issuers[0].tokenRegistry) throw new Error("Token must have token registry in it");
  return data.issuers[0];
};
