import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import Web3Modal from "web3modal";
import Image from "next/image";
import { nftaddress, nftmarketaddress } from "../../config";

import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../artifacts/contracts/Market.sol/Market.json";

const Nft = () => {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadNFTs();
  }, []);

  const myLoader = ({ src, width, quality }) => {
    return `${src}?w=${width}`;
  };

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider();
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      provider
    );
    const data = await marketContract.fetchMarketItems();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          itemId: i.itemId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }

  async function buyNft(nft) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);

    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createMarketSale(
      nftaddress,
      nft.itemId,
      {
        value: price,
      }
    );
    await transaction.wait();
    loadNFTs();
  }

  return (
    <>
      {Boolean(nfts.length) ? (
        nfts.map((nft, i) => (
          <div key={i} className="border shadow rounded-xl overflow-hidden">
            <Image
              width={300}
              height={400}
              alt="nft"
              src={nft.image}
              loader={myLoader}
            />
            <div className="p-4">
              <p style={{ height: "64px" }} className="text-2xl font-semibold">
                {nft.name}
              </p>
              <div style={{ height: "70px", overflow: "hidden" }}>
                <p className="text-gray-400">{nft.description}</p>
              </div>
            </div>
            <div className="p-4 bg-black">
              <p className="text-2xl mb-4 font-bold text-white">
                {nft.price} ETH
              </p>
              <button
                className="w-full bg-pink-500 text-white font-bold py-2 px-12 rounded"
                onClick={() => buyNft(nft)}
              >
                Buy
              </button>
            </div>
          </div>
        ))
      ) : (
        <h1>No NFTS</h1>
      )}
    </>
  );
};

export default Nft;
