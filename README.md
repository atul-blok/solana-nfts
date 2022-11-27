# solana-nfts
Here, I'm going to discuss about the three major ways to mint NFTs in solana with metadata - 

```
1. Using RUST crates with solana program.
2. Using Javascript SDK of solana with metaplex.
3. Using Metaplex Candy Machine with Sugar.
```

# NFT Minting using Anchor & Rust Cartes 

## Approach 

- In this approach of minting NFT on Solana blockchain (devnet) , we are creating a simple anchor (a development framework on Solana) project using - 
``anchor init mint-nft``
- After creating Minting we are updating [Anchor.toml](./mint-nft/Anchor.toml) with **devnet** and **keypair** path. 
- In [lib.rs](./mint-nft/programs/mint-nft/src/lib.rs) program file , we are creating these account to start minting - 
    - First, we need to create a mint account that is used to store the supply of token and used as a token for example - [above-minted-nft](https://explorer.solana.com/address/8oSTEMhuRdXW7hSoC1AfW8maQYYZ3PiaMUo8FYozW4Nw?cluster=devnet)
    - Second , we create token account that contain about minter , owner and total token balance for example -[above-token-acc](https://explorer.solana.com/address/ELy8bXN6zV4Lvp9eMG1L93GcVDvxzAi7eiKzJKfUkmZW?cluster=devnet)
    - Third, Metaplex Metadata account that is used to store token URI and data for NFT with metaplex - 
    [metadata-acc](https://explorer.solana.com/address/7GvqzemwNkWRHWMxcBZhxZGSiBaH5tDWohBSqNoUSsW1?cluster=devnet)  
    - Fourth, Metaplex MasterEdition account that don't contain any data but create [print](https://docs.metaplex.com/resources/definitions#print) to make the copy of NFT to owner. 

- After program build & deploy using ``` anchor build && anchor deploy```, we can use a [anchor-client](https://github.com/coral-xyz/anchor) to call actions to mint the program , we can mint multiple NFTs from a single program.  

- This approach would work with a lots of development of solana program. 

#### Example

Program-code - [mint-nft](./mint-nft/programs/mint-nft/src/lib.rs)

Client-code to mint nft - [call-from-client](./mint-nft/app/) 
- add your keypair to [guideSecret.json](./mint-nft/app/guideSecret.json) file

#### Costs & Stats 

| Command | Example Balance | Description |
| --- | --- | --- |
| Before Deployment | `4.453909 SOL` | It's balance befor deploying above code on devnet. |
| After Deployment | `0.69303344 SOL` | It's remaining balance of account after deployment. `3.76087556 SOL`  used to create all accounts i.e. Mint , Token, Metadata etc.|
| Before Minting 1 card with Metadata | `4.67086065 SOL` | It's balance of account before pusing Mint transaction on chain. |
| After Minting 1 card with Metadata | `4.64764105 SOL` | Remaining balance after minting 1 card with this approach using Metaplex account with metadata. |

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


# NFT Minting using Javascript SDK 

## Approach 
- In this approach we are going to mint an NFT with metadata to Solana's devnet using the [Solana Web3](https://www.npmjs.com/package/@solana/web3.js) library and [Metaplex JS SDKs](https://www.npmjs.com/package/@metaplex-foundation/js)
- We are uploading image/off-chain (stored [here](./nft-sdk/uploads/image.png)) data to Arweavez(bundlrStorage) and fetch its URI.
- In this approach we uploading all metaplex [metadata](https://docs.metaplex.com/programs/token-metadata/token-standard#the-non-fungible-standard) & Token Uri to NFT using Metaplex SDK. 
- After setting all these functions we are Mint NFT using Metaplex SDK.

#### Example
- SDK functions - [Minting NFT with SDK](./nft-sdk/app.ts)

#### Costs & Stats 

| Setps | Example Balance | Description |
| --- | --- | --- |
| Before start mining & uploading | `4.623570034 SOL` | It's balance befor minting and uploading metadata script on devnet. |
| Step 1 - Uploading Image & metadata on Arweave | `4.623570034 SOL` | It's remaining balance of account after uploading image , metadata etc. Current cost to store the 1KB file is 0.0000014908690623249299 SOL or 0.000002233957 AR |
| Before Minting 1 card with Metadata | `4.623570034 SOL` | It's balance of account before pusing Mint transaction on chain. |
| After Minting 1 card with Metadata | `4.611553239 SOL` | Remaining balance after minting 1 card with this approach using Metaplex account with metadata. It's use almost `0.012016795 SOL` to mint a nft with metadata.|

#### Advantages
1. This approach is very easy to use and not need too much knowledge about rust and solana network. 
2. This approach is easy to integrate with client and good to upload , update the metadata easily using SDK only. 
3. Cost of avg. minting 1 NFT using this is very cheap and effective to launch. 
4. No need to pay your own program deployment cost and setup all accounts for minting. It's use already deployed program to create and mint NFT. 

#### Disadvantages
1. Hard to customize our functionality on chain. 
2. Depend only SDK library, may be not work if any major changes in SDK occure. 
3. It's hard to calculated the all space , rent and fee using this. 
4. Not able to mint multiple NFTS in a collection.

#### Rent & Transaction fee 
- The average cost of Minting an NFT in Solana is 0.00001 SOL.
- Cost for above example to mint 1 NFT is `0.012016795 SOL` with include transaction fee. 

# NFT Minting using Metaplex Candy Machine with Sugar

## Approach 
- In this approach we are using Candy Machine V2 and Sugar-cli to mint and deploy the Collection to choose a random NFT from that collection with specific  `#number` and minting address.
- This approach well defined for all multiple NFT grouping and bunching in single Candy machine and able to mint a NFT from that Candy so there is no need to pay the same NFT metadata Cost to upload it's already integrated Arweave service to upload the tokenURI and local images with a very low SOL fee.

#### Example
- For the above [example](./nft-sugar/) we are using [sugar-cli](https://docs.metaplex.com/developer-tools/sugar/) for the deploy a Candy Machine and minting the NFTs.
- We are setting up the config file already in a given pattern provided by Candy Machine Docs.
- [Assets](./nft-sugar/assets/) this folder contain the all images according to crrosponding `.json` file with specific collection.
- [Config.json](./nft-sugar/config.json) this file is used to the setting up the all configuration of colleciton for above assets provided in a collection.
- Some important doc to integrate this approach and minting NFT given [here](https://www.quicknode.com/guides/solana-development/how-to-deploy-an-nft-collection-on-solana-using-sugar-candy-machine)  

#### Costs & Stats 
| Setps | Example Balance | Description |
| --- | --- | --- |
| Before start mining & uploading | `4.611503335 SOL` | It's balance befor minting and uploading metadata script on devnet. |
| Step 1 - Uploading Image & metadata on Arweave | `4.611445527 SOL` | It's remaining balance of account after uploading image , metadata etc. Current cost to store the 1KB file is 0.0000014908690623249299 SOL or 0.000002233957 AR. Sugar used all collection NFT's metadata for above collection is `0.000057808 SOL` |
| Deployment of Candy machine with collection | `4.574254127 SOL` | It's balance of account after deploying candy machine on chain. |
| Before Minting 1 card with Metadata | `4.574254127 SOL` | It's balance of account before pusing Mint transaction on chain. |
| After Minting 1 card with Metadata | `4.562272927 SOL` | Remaining balance after minting 1 card with this approach using Candy Machine with Random NFT from whole collection. It's use almost `0.01198120 SOL` to mint a nft with metadata.|

#### Advantages
1. this Approach is useful work multiple colleciton and bunch of NFT minting and metadata updation.
2. Here we can filtering nft using mint-address from a whole colleciton.
3. In this approach we fix the supply and make the copeis of same collection nft and check the metadtata for the same collection.
4. In this approach , collection can upldated for the all NFT and get all nft with a sepecific condtion and it's easy and secure choose a random nft from bunch of NFTs. 
5. It can be helpful make our own marketplace and listing more nfts with same pattern.

#### Disadvantages
1. Not able customize core functions and features of NFT. 
2. Not able to increase NFT supply for a candy machine or collection to mint.
3. Rent and balance calculation for each nft consumption to minting that NFT. 

#### Rent & Transaction fee 
It's take almost  `0.000057808 SOL` to deploy a simple collection Candy Machine. 
And take `0.01198120 SOL` to mint a NFT using this approach with all NFT minting. 

> **_NOTE:_**  We are figuring out the solution for deployment Candy Machine & Minting NFT direct from Node Js/ Typescript. 

Thank You for all these approach ..

