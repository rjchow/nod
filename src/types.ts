export interface Issuer {
  tokenRegistry: string;
}

export interface TransferOwnership {
  txHash: string;
  token: string;
  owner: string;
}
