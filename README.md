# solana-token-trade
Project from my undergraduate research. This project aims to use the solana blockchain to create a stock  exchange, with the shares being a solana token.

# How to use

here will be all the instructions you need to run the program and use it.

## Requirements

  - NodeJs (>= 18.04.0) and NPM (>=9.3.1)
  - Rust (Cargo)
  - [Solana](https://docs.solana.com/cli/install-solana-cli-tools)
  - [Anchor](https://www.anchor-lang.com/docs/installation)
  
## Building

To build the Solana smart contract use `anchor build` in the directory root.

This command will download and build all dependencies and build the project.

## Running

Instructions to run the on-chain and the client side.

### On-chain

After using the ´anchor build´ command, make sure you're connected to one of the Solana's clusters (see Solana's docs) and run `anchor deploy`.

### Client side

Go to the app/ directory (`cd app/`) inside the root and run `npm start`, this command will download react and others dependencies. After that your client side made in react will be running.

This program was built to be used with the [rust-web3 API](https://github.com/CaioBonani/rust-web3), see the instructions in the project's README.
