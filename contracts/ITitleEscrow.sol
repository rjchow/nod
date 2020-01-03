pragma solidity ^0.5.11;

/// @title Title Escrow for Transferable Records
interface ITitleEscrow {
  /// @dev This emits when the escrow contract receives an ERC721 token.
  event TitleReceived(address indexed _tokenRegistry, address indexed _from, uint256 indexed _id);

  /// @dev This emits when the ownership is transferred out of the escrow contract.
  event TitleCeded(address indexed _tokenRegistry, address indexed _to, uint256 indexed _id);

  /// @dev This emits when the beneficiary endorsed the the holder's transfer.
  event TransferEndorsed(uint256 indexed _tokenid, address indexed _from, address indexed _to);

  /// @notice Handle the receipt of an NFT
  /// @param operator The address which called `safeTransferFrom` function
  /// @param from The address which previously owned the token
  /// @param tokenId The NFT identifier which is being transferred
  /// @param data Additional data with no specified format
  /// @return `bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"))`
  /// unless throwing
  function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data)
    external
    returns (bytes4);

  /// @notice Handle the change of holdership by current holder
  /// @param newHolder The address of the new holder
  function changeHolder(address newHolder) external;

  /// @notice Handle the transfer endorsement by the beneficiary
  /// @param newBeneficiary The address of the new holder
  function endorseTransfer(address newBeneficiary) external;

  /// @notice Handle the token transfer by the holder after beneficiary's endorsement
  /// @param newBeneficiary The address of the new holder
  function transferTo(address newBeneficiary) external;
}
