
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");
const { fromRpcSig, ethUtil } = require("ethereumjs-util");
const ethSigUtil = require("eth-sig-util");

describe("Signature contract test cases : ", async function () {

  let firstUser, secondUser, example, nft, domainData;

  before(async () => {
    [firstUser, secondUser] = await ethers.getSigners();
    
  });

  it("Deploy the contract", async function () {
    const Example = await ethers.getContractFactory("MintOnSale");
    const NFT = await ethers.getContractFactory("MyToken");
    
    nft = await NFT.deploy();
    await nft.deployed();

    example = await Example.deploy(nft.address);
    await example.deployed();
    
    
    const ct = Math.floor(Date.now() / 1000)
   
     domainData =  {
          name: "Art Official",
          version: "1",
          chainId: 1,
          verifyingContract: example.address,
        };

        const typedData = {
          types:{
            Maker: [
                      { name: "signer", type: "address" },
                      { name: "nft", type: "address" },
                      { name: "nftId", type: "uint256" },
                      { name: "price", type: "uint256" },
                      { name: "currency", type: "address" },
                      { name: "startTime", type: "uint256" },
                      { name: "endTime", type: "uint256" },
                    ],
          },
          primaryType: "Maker",
          domain: domainData,
          message: {
            signer: firstUser.address,
            nft: nft.address,
            nftId:1,
            price:1000000,
            currency: nft.address,
            startTime:ct,
            endTime:ct+100
          }
        }
        
        const signature = await firstUser._signTypedData(
              typedData.domain,
              typedData.types,
              typedData.message
            );
       
        const { v, r, s } = fromRpcSig(signature);
      
          
          let m = {
            signer: firstUser.address,
            nft: nft.address,
            nftId:1,
            price:1000000,
            currency: nft.address,
            startTime:ct,
            endTime:ct+100
          }
          let n = {
            taker: secondUser.address,
            nftId: 1,
            price: 5666
          }
      const temp =  await example.connect(secondUser).mintOnSale(m,n, v, r, s,{
        value:1000000,
      });
      await temp.wait();

      const val = await nft.totalSupply();
      
      await expect(val).to.equal(1);

  });
  
  it("sign with other user", async function () {
    const Example = await ethers.getContractFactory("MintOnSale");
    const NFT = await ethers.getContractFactory("MyToken");
    
    nft = await NFT.deploy();
    await nft.deployed();

    example = await Example.deploy(nft.address);
    await example.deployed();
    
    const ct = Math.floor(Date.now() / 1000)
     domainData =  {
          name: "Art Official",
          version: "1",
          chainId: 1,
          verifyingContract: example.address,
        };

        const typedData = {
          types:{
            Maker: [
                      { name: "signer", type: "address" },
                      { name: "nft", type: "address" },
                      { name: "nftId", type: "uint256" },
                      { name: "price", type: "uint256" },
                      { name: "currency", type: "address" },
                      { name: "startTime", type: "uint256" },
                      { name: "endTime", type: "uint256" },
                    ],
          },
          primaryType: "Maker",
          domain: domainData,
          message: {
            signer: firstUser.address,
            nft: nft.address,
            nftId:1,
            price:1000000,
            currency: nft.address,
            startTime:ct,
            endTime:ct+100
          }
        }
        
        const signature = await secondUser._signTypedData(
              typedData.domain,
              typedData.types,
              typedData.message
            );
        
        const { v, r, s } = fromRpcSig(signature);
      
          
          let m = {
            signer: firstUser.address,
            nft: nft.address,
            nftId:1,
            price:1000000,
            currency: nft.address,
            startTime:ct,
            endTime:ct+100
          }
          let n = {
            taker: secondUser.address,
            nftId: 1,
            price: 5666
          }

      await expect(example.connect(secondUser).mintOnSale(m,n, v, r, s,{
        value:1000000,
      })).to.be.revertedWith("Maker has not signed this message");
      

  });

  it("NFT ID Mismatch", async function () {
    const Example = await ethers.getContractFactory("MintOnSale");
    const NFT = await ethers.getContractFactory("MyToken");
    
    nft = await NFT.deploy();
    await nft.deployed();

    example = await Example.deploy(nft.address);
    await example.deployed();
    
    const ct = Math.floor(Date.now() / 1000)
     domainData =  {
          name: "Art Official",
          version: "1",
          chainId: 1,
          verifyingContract: example.address,
        };

        const typedData = {
          types:{
            Maker: [
                      { name: "signer", type: "address" },
                      { name: "nft", type: "address" },
                      { name: "nftId", type: "uint256" },
                      { name: "price", type: "uint256" },
                      { name: "currency", type: "address" },
                      { name: "startTime", type: "uint256" },
                      { name: "endTime", type: "uint256" },
                    ],
          },
          primaryType: "Maker",
          domain: domainData,
          message: {
            signer: firstUser.address,
            nft: nft.address,
            nftId:10,
            price:1000000,
            currency: nft.address,
            startTime:ct,
            endTime:ct+100
          }
        }
        
        const signature = await firstUser._signTypedData(
              typedData.domain,
              typedData.types,
              typedData.message
            );
        const { v, r, s } = fromRpcSig(signature);
      
          
          let m = {
            signer: firstUser.address,
            nft: nft.address,
            nftId:10,
            price:1000000,
            currency: nft.address,
            startTime:ct,
            endTime:ct+100
          }
          let n = {
            taker: secondUser.address,
            nftId: 1,
            price: 1000000
          }

      await expect(example.connect(secondUser).mintOnSale(m,n, v, r, s,{
        value:1000000,
      })).to.be.revertedWith("NFT ID's mismatch");
      

  });

  it("time not in range", async function () {
    const Example = await ethers.getContractFactory("MintOnSale");
    const NFT = await ethers.getContractFactory("MyToken");
    
    nft = await NFT.deploy();
    await nft.deployed();

    example = await Example.deploy(nft.address);
    await example.deployed();
    
    const ct = Math.floor(Date.now() / 1000)
     domainData =  {
          name: "Art Official",
          version: "1",
          chainId: 1,
          verifyingContract: example.address,
        };

        const typedData = {
          types:{
            Maker: [
                      { name: "signer", type: "address" },
                      { name: "nft", type: "address" },
                      { name: "nftId", type: "uint256" },
                      { name: "price", type: "uint256" },
                      { name: "currency", type: "address" },
                      { name: "startTime", type: "uint256" },
                      { name: "endTime", type: "uint256" },
                    ],
          },
          primaryType: "Maker",
          domain: domainData,
          message: {
            signer: firstUser.address,
            nft: nft.address,
            nftId:10,
            price:1000000,
            currency: nft.address,
            startTime:ct,
            endTime:ct-100
          }
        }
        
        const signature = await firstUser._signTypedData(
              typedData.domain,
              typedData.types,
              typedData.message
            );
        const { v, r, s } = fromRpcSig(signature);
      
          
          let m = {
            signer: firstUser.address,
            nft: nft.address,
            nftId:10,
            price:1000000,
            currency: nft.address,
            startTime:ct,
            endTime:ct-100
          }
          let n = {
            taker: secondUser.address,
            nftId: 10,
            price: 1000000
          }

      await expect(example.connect(secondUser).mintOnSale(m,n, v, r, s,{
        value:1000000,
      })).to.be.revertedWith("Nft can only be minted within specified time range");
      

  });

  it("amount mismatch", async function () {
    const Example = await ethers.getContractFactory("MintOnSale");
    const NFT = await ethers.getContractFactory("MyToken");
    
    nft = await NFT.deploy();
    await nft.deployed();

    example = await Example.deploy(nft.address);
    await example.deployed();
    
    const ct = Math.floor(Date.now() / 1000)
     domainData =  {
          name: "Art Official",
          version: "1",
          chainId: 1,
          verifyingContract: example.address,
        };

        const typedData = {
          types:{
            Maker: [
                      { name: "signer", type: "address" },
                      { name: "nft", type: "address" },
                      { name: "nftId", type: "uint256" },
                      { name: "price", type: "uint256" },
                      { name: "currency", type: "address" },
                      { name: "startTime", type: "uint256" },
                      { name: "endTime", type: "uint256" },
                    ],
          },
          primaryType: "Maker",
          domain: domainData,
          message: {
            signer: firstUser.address,
            nft: nft.address,
            nftId:10,
            price:1000000,
            currency: nft.address,
            startTime:ct,
            endTime:ct+100
          }
        }
        
        const signature = await firstUser._signTypedData(
              typedData.domain,
              typedData.types,
              typedData.message
            );
        const { v, r, s } = fromRpcSig(signature);
      
          
          let m = {
            signer: firstUser.address,
            nft: nft.address,
            nftId:10,
            price:1000000,
            currency: nft.address,
            startTime:ct,
            endTime:ct+100
          }
          let n = {
            taker: secondUser.address,
            nftId: 10,
            price: 5666
          }

      await expect(example.connect(secondUser).mintOnSale(m,n, v, r, s,{
        value:5666,
      })).to.be.revertedWith("please provide sufficient amount to buy");
      

  });
  
});