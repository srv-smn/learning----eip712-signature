const { expect, use } = require("chai");
const { ethers } = require("hardhat");
const { fromRpcSig, ethUtil } = require("ethereumjs-util");
const ethSigUtil = require("eth-sig-util");

let example, domainData, typedData;
let admin, user1, user2, user3, user4;

async function getAddresses() {
  [admin, user1, user2, user3, user4] = await ethers.getSigners();
}

async function deploy() {
  const Example = await ethers.getContractFactory("Example");
  example = await Example.deploy();
  await example.deployed();
  console.log("LNQ deployed to:", example.address);
  domainData = {
    name: "Ether Mail",
    version: "1",
    chainId: 1,
    verifyingContract: example.address,
  };
}

describe("permit", async function () {
  await getAddresses();
  await deploy();
  typedData = {
    types: {
      Person: [
        { name: "name", type: "string" },
        { name: "wallet", type: "address" },
      ],
      Mail: [
        { name: "from", type: "Person" },
        { name: "to", type: "Person" },
        { name: "contents", type: "string" },
      ],
    },
    primaryType: "Mail",
    domain: domainData,
    message: {
      from: {
        name: "Cow",
        wallet: admin.address,
      },
      to: {
        name: "Bob",
        wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
      },
      contents: "Hello, Bob!",
    },
  };
  const signature = await admin._signTypedData(
    typedData.domain,
    typedData.types,
    typedData.message
  );
  console.log(signature);
  const { v, r, s } = fromRpcSig(signature);

  let m = {
    from: {
      name: "Cow",
      wallet: admin.address,
    },
    to: {
      name: "Bob",
      wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
    },
    contents: "Hello, Bob!",
  };

  await expect(await example.connect(user1).verify(m, v, r, s)).to.equal(true);
});

function signHash() {
  return ethUtil.keccak256(
    Buffer.concat([
      Buffer.from("1901", "hex"),
      structHash("EIP712Domain", typedData.domain),
      structHash(typedData.primaryType, typedData.message),
    ])
  );
}
