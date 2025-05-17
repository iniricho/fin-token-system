// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// ⚠️ Gunakan import EIP712 yang sudah final (bukan draft)
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract FinEuroToken is
    ERC20,
    ERC20Burnable,
    ERC20Pausable,
    Ownable,
    EIP712
{
    using ECDSA for bytes32;

    string private constant SIGNING_DOMAIN    = "FinEuroToken";
    string private constant SIGNATURE_VERSION = "1";

    mapping(bytes32 => bool) public usedHash;
    mapping(address => bool) public validators;

    event MintedFIN(string cid, string txCode, address indexed receiver, uint256 amount);
    event BurnedFIN(address indexed from, uint256 amount, string reason);
    event PayoutIDR(address indexed to, uint256 amountIDR, string note);

    struct FINPayload {
        string  cid;
        string  txCode;
        address receiver;
        uint256 amount;
        uint256 nonce;
    }

    bytes32 private constant TYPE_HASH = keccak256(
        "FINPayload(string cid,string txCode,address receiver,uint256 amount,uint256 nonce)"
    );

    constructor(address initialOwner)
        ERC20("FIN Euro Token", "FINEURO")
        Ownable(initialOwner)
        EIP712(SIGNING_DOMAIN, SIGNATURE_VERSION)
    {}

    // === ADMIN ===
    function pause()   external onlyOwner { _pause();   }
    function unpause() external onlyOwner { _unpause(); }

    function setValidator(address validator, bool status) external onlyOwner {
        validators[validator] = status;
    }

    // === MINT FROM FIN ===
    function mintFromFIN(
        string memory cid,
        string memory txCode,
        address receiver,
        uint256 amount
    ) external onlyOwner {
        bytes32 key = keccak256(abi.encodePacked(cid, txCode, receiver, amount));
        require(!usedHash[key], "Already minted");
        usedHash[key] = true;

        _mint(receiver, amount);
        emit MintedFIN(cid, txCode, receiver, amount);
    }

    // === MINT WITH SIGNATURE (EIP-712) ===
    function mintWithSig(FINPayload calldata payload, bytes calldata signature) external {
        bytes32 digest = _hashTypedDataV4(
            keccak256(abi.encode(
                TYPE_HASH,
                keccak256(bytes(payload.cid)),
                keccak256(bytes(payload.txCode)),
                payload.receiver,
                payload.amount,
                payload.nonce
            ))
        );

        address signer = digest.recover(signature);
        require(validators[signer], "Invalid validator sig");

        bytes32 key = keccak256(abi.encodePacked(
            payload.cid,
            payload.txCode,
            payload.receiver,
            payload.amount
        ));
        require(!usedHash[key], "Already minted");
        usedHash[key] = true;

        _mint(payload.receiver, payload.amount);
        emit MintedFIN(payload.cid, payload.txCode, payload.receiver, payload.amount);
    }

    // === BURN WITH REASON ===
    function burnWithReason(uint256 amount, string calldata reason) external whenNotPaused {
        _burn(_msgSender(), amount);
        emit BurnedFIN(_msgSender(), amount, reason);
    }

    // === PAYOUT IDR (off-chain) ===
    function payoutIDR(address to, uint256 amountIDR, string calldata note) external onlyOwner {
        emit PayoutIDR(to, amountIDR, note);
    }


    function _update(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Pausable)
    {
        super._update(from, to, amount);
    }
}
