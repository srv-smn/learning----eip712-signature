// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

interface INFT{
    function safeMint(address to) external ;
}

contract MintOnSale {
    INFT artOfficial;

    struct EIP712Domain {
        string  name;
        string  version;
        uint256 chainId;
        address verifyingContract;
    }

    struct Maker {
        address signer;
        address nft;
        uint nftId;
        uint price;
        address currency;
        uint startTime;
        uint endTime;

    }

    struct Taker {
        address taker;
        uint nftId;
        uint price;
    }

    bytes32 constant EIP712DOMAIN_TYPEHASH = keccak256(
        "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
    );

    bytes32 constant MAKER_TYPEHASH = keccak256(
        "Maker(address signer,address nft,uint256 nftId,uint256 price,address currency,uint256 startTime,uint256 endTime)"
    );

    bytes32 constant TAKER_TYPEHASH = keccak256(
        "Taker(address taker,uint256 nftId,uint256 price)"
    );

    bytes32 DOMAIN_SEPARATOR;

    constructor(address _artOfficial) {
        artOfficial = INFT(_artOfficial);
        DOMAIN_SEPARATOR = hash(EIP712Domain({
            name: "Art Official",
            version: '1',
            chainId: 1,
            verifyingContract: address(this)
        }));
    }

    function hash(EIP712Domain memory eip712Domain) internal pure returns (bytes32) {
        return keccak256(abi.encode(
            EIP712DOMAIN_TYPEHASH,
            keccak256(bytes(eip712Domain.name)),
            keccak256(bytes(eip712Domain.version)),
            eip712Domain.chainId,
            eip712Domain.verifyingContract
        ));
    }

    function hash(Maker memory maker) internal pure returns (bytes32) {
        return keccak256(abi.encode(
            MAKER_TYPEHASH,
            maker.signer,
            maker.nft,
            maker.nftId,
            maker.price,
            maker.currency,
            maker.startTime,
            maker.endTime
        ));
    }

    function hash(Taker memory taker) internal pure returns (bytes32) {
        return keccak256(abi.encode(
            TAKER_TYPEHASH,
            taker.taker,
            taker.nftId,
            taker.price
        ));
    }

    function mintOnSale(Maker memory maker, Taker memory taker, uint8 v, bytes32 r, bytes32 s) public payable {

        bytes32 digest = keccak256(abi.encodePacked(
            "\x19\x01",
            DOMAIN_SEPARATOR,
            hash(maker)
        ));

        require(ecrecover(digest, v, r, s) == maker.signer, "Maker has not signed this message");
        require(maker.nftId == taker.nftId,"NFT ID's mismatch");
        require(block.timestamp <= maker.endTime && block.timestamp >= maker.startTime,"Nft can only be minted within specified time range");
        require(maker.price == msg.value,"please provide sufficient amount to buy");
        artOfficial.safeMint(msg.sender);
    }
    

}