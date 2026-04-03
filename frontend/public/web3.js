// web3.js

import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.min.js";

const contractAddress = "YOUR_CONTRACT_ADDRESS";

const abi = [
  "function mintNFT(address recipient, string memory tokenURI) public returns (uint256)"
];

export async function mintNFT(tokenURI) {
  if (!window.ethereum) {
    alert("MetaMask not detected");
    return;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const contract = new ethers.Contract(contractAddress, abi, signer);

  const userAddress = await signer.getAddress();

  const tx = await contract.mintNFT(userAddress, tokenURI);
  await tx.wait();

  console.log("NFT minted!");
}