import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { NftAnchor } from "../target/types/nft_anchor";
const secret = require("./guideSecret.json");

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const connection = new anchor.web3.Connection(RPC_ENDPOINT);
const mintKeypair = anchor.web3.Keypair.generate();
console.log(`generate mint key pair ${mintKeypair}`)
const wallet = new anchor.Wallet(anchor.web3.Keypair.fromSecretKey(new Uint8Array(secret)));
const testNftTitle = "Test O NFT";
const testNftSymbol = "TON";
const testNftUrl =
  "https://github.com/Coding-and-Crypto/Rust-Solana-Tutorial/blob/master/nfts/mint-nft/assets/example.json";

const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

async function main() {
  anchor.setProvider(
    new anchor.AnchorProvider(
      connection,
      wallet,
      anchor.AnchorProvider.defaultOptions()
    )
  );
  const program = anchor.workspace.NftAnchor as Program<NftAnchor>;

  const tokenAddress = await anchor.utils.token.associatedAddress({
    mint: mintKeypair.publicKey,
    owner: wallet.publicKey,
  });
  console.log(`New token ${mintKeypair.publicKey} wallet ${wallet.publicKey} & token addess: ${tokenAddress}`);

  const metadataAddress = (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintKeypair.publicKey.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0];

  const masterEditionAddress = (
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintKeypair.publicKey.toBuffer(),
        Buffer.from("edition"),
      ],
      TOKEN_METADATA_PROGRAM_ID
    )
  )[0];

  const res = await program.methods
    .mint(testNftTitle, testNftSymbol, testNftUrl)
    .accounts({
      metadata: metadataAddress,
      masterEdition: masterEditionAddress,
      mint: mintKeypair.publicKey,
      tokenAccount: tokenAddress,
      mintAuthority: wallet.publicKey,
      // rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      // systemProgram: SystemProgram.programId,
      // tokenProgram: TOKEN_PROGRAM_ID,
      // associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
    })
    .signers([mintKeypair])
    .rpc();
    console.log('res', res)
}
main();
