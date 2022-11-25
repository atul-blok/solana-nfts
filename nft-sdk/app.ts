import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
  toMetaplexFile,
  toBigNumber,
} from "@metaplex-foundation/js";
import * as fs from "fs";
import secret from "./guideSecret.json";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const SOLANA_CONNECTION = new Connection(RPC_ENDPOINT);

const WALLET = Keypair.fromSecretKey(new Uint8Array(secret));

const METAPLEX = Metaplex.make(SOLANA_CONNECTION)
  .use(keypairIdentity(WALLET))
  .use(
    bundlrStorage({
      address: "https://devnet.bundlr.network",
      providerUrl: RPC_ENDPOINT,
      timeout: 60000,
    })
  );

const CONFIG = {
  uploadPath: "uploads/",
  imgFileName: "image.png",
  imgType: "image/png",
  imgName: "Demo NFT",
  description: "Pixel infrastructure for everyone!",
  attributes: [
    { trait_type: "Rarity", value: "Rare" },
    { trait_type: "Type", value: "Demo" },
    { trait_type: "Ability", value: "Fire" },
  ],
  sellerFeeBasisPoints: 500, //500 bp = 5%
  symbol: "DRF",
  creators: [{ address: WALLET.publicKey, share: 100 }],
};

async function uploadImage(
  filePath: string,
  fileName: string
): Promise<string> {
  console.log(`Step 1 - Uploading Image`);
  const imgBuffer = fs.readFileSync(filePath + fileName);
  const imgMetaplexFile = toMetaplexFile(imgBuffer, fileName);
  const imgUri = await METAPLEX.storage().upload(imgMetaplexFile);
  console.log(`   Image URI:`, imgUri);
  return imgUri;
}

async function uploadMetadata(
  imgUri: string,
  imgType: string,
  nftName: string,
  description: string,
  attributes: { trait_type: string; value: string }[]
) {
  console.log(`Step 2 - Uploading Metadata`);
  const data = await METAPLEX.nfts().uploadMetadata({
    name: nftName,
    description: description,
    image: imgUri,
    attributes: attributes,
    properties: {
      files: [
        {
          type: imgType,
          uri: imgUri,
        },
      ],
    },
  });
  console.log("   Metadata URI:", data);
  return data.uri;
}

async function mintNft(
  metadataUri: string,
  name: string,
  sellerFee: number,
  symbol: string,
  creators: { address: PublicKey; share: number }[]
) {
  console.log(`Step 3 - Minting NFT`);
  const mintedNft = await METAPLEX.nfts().create({
    uri: metadataUri,
    name: name,
    sellerFeeBasisPoints: sellerFee,
    symbol: symbol,
    creators: creators,
    isMutable: false,
    maxSupply: toBigNumber(1),
  });
  console.log(`   Success!🎉`, mintedNft);
  console.log(
    `   Minted NFT: https://explorer.solana.com/address/${mintedNft.nft.address}?cluster=devnet`
  );
}

async function main() {
  console.log(
    `Minting ${
      CONFIG.imgName
    } to an NFT in Wallet ${WALLET.publicKey.toBase58()}.`
  );
  //Step 1 - Upload Image
  const imgUri = await uploadImage(CONFIG.uploadPath, CONFIG.imgFileName);

  //Step 2 - Upload Metadata
  const metadataUri = await uploadMetadata(
    imgUri,
    CONFIG.imgType,
    CONFIG.imgName,
    CONFIG.description,
    CONFIG.attributes
  );

  //Step 3 - Mint NFT
  mintNft(
    metadataUri,
    CONFIG.imgName,
    CONFIG.sellerFeeBasisPoints,
    CONFIG.symbol,
    CONFIG.creators
  );
}

main();
