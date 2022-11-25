# solana-nfts
Here, I'm going to discuss about the three major ways to mint NFTs in solana with metadata - 

```
1. Using RUST crates with solana program.
2. Using Javascript SDK of solana with metaplex.
3. Using Metaplex Candy Machine with Sugar.
```

# NFT Minting using Anchor & Rust Cartes 

#### Example

Program-code - [mint-nft](./mint-nft/programs/mint-nft/src/lib.rs)

Client-code to mint nft - [call-from-client](./mint-nft/app/) 
- add your keypair to [guideSecret.json](./mint-nft/app/guideSecret.json) file

#### Costs & Stats 

| Command | Example Balance | Description |
| --- | --- |
| Before Deployment | `4.453909 SOL` | It's balance befor deploying above code on devnet. 
| After Deployment | `0.69303344 SOL` | It's remaining balance of account after deployment. `3.76087556 SOL`  used to create all accounts i.e. Mint , Token, Metadata etc.
| Before Minting 1 card with Metadata | `4.67086065 SOL` | It's balance of account before pusing Mint transaction on chain. 
| After Minting 1 card with Metadata | `4.64764105 SOL` | Remaining balance after minting 1 card with this approach using Metaplex account with metadata. 

#### Advantages
- It's a customisable solana program where we can make fork the actual SPL token contract for minting & setting up the metdata accounts. 
- We can add metadata update from direclty from solana program.
- It's a cost-effective and customizable development solution for NFT marketplaces. 
- We can add own secondary sales actions or functions to this program for future uses. 

#### Disadvantages
- Solana’s contract NFT is that it is difficult to tie all the NFTs in the collection together.
- Mutiple accounts & program for all things like - Mint account, Intialization mint account, metadata account, metaplex account. and difficult to manage and understand all things at time. 
- There is fixed mermory space allocation for every account that's why it little bit complicated to manage data bytes stored in CPI(CROSS PROGRAM INNOVATION) account.
- It's complicated to calcualate the program size before deployment. 

#### Rent & Transaction fee 
- average cost for solana transaction fee is - $ 0.00025 per transaction. It's depend on the size of transaction hash. 
- To get the rent per epoch & size of contract  - 

``` 
solana program show HF6Xskjab5hNuYDbyySMi2o9zr5w5mGoE7Pqh3fdWDvQ

Program Id: HF6Xskjab5hNuYDbyySMi2o9zr5w5mGoE7Pqh3fdWDvQ
Owner: BPFLoaderUpgradeab1e11111111111111111111111
ProgramData Address: 2nwP3vyVj8n5M8xgaGpzP41E8CmwQvsAoKKEA7Gm39ZH
Authority: EWsze8skNYVByeaAQ9aR5jSUkFTR3H9r44NV8j68bvBW
Last Deployed In Slot: 177704119
Data Length: 539120 (0x839f0) bytes
Balance: 3.75347928 SOL 
```
- Rent for this program - 
```
solana rent 539120
Rent per byte-year: 0.00000348 SOL
Rent per epoch: 0.010275828 SOL
Rent-exempt minimum: 3.75316608 SOL
```

