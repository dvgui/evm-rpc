# CLI Examples

Quick examples to get started with the EVM RPC framework.

## Setup

```bash
npm install
npm run build
```

## Basic Usage

```bash
# Get blockchain info
npm run evm-rpc '--' -u https://ethereum-rpc.publicnode.com info

# Get current block number  
npm run evm-rpc '--' -u https://ethereum-rpc.publicnode.com block-number

# Get account balance
npm run evm-rpc '--' -u https://ethereum-rpc.publicnode.com balance 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045

# Make contract call (USDC total supply)
npm run evm-rpc '--' -u https://ethereum-rpc.publicnode.com call 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 -d 0x18160ddd

# Get latest block
npm run evm-rpc '--' -u https://ethereum-rpc.publicnode.com block latest

# Check if address is contract
npm run evm-rpc '--' -u https://ethereum-rpc.publicnode.com code 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
```

## Output Formats

```bash
# JSON output
npm run evm-rpc '--' -u https://ethereum-rpc.publicnode.com info --format json

# Pretty output (default)
npm run evm-rpc '--' -u https://ethereum-rpc.publicnode.com info --format pretty
```

## Available Commands

- `info` - Blockchain information
- `block-number` - Current block number
- `balance <address>` - Account balance
- `call <to> -d <data>` - Contract call
- `tx <hash>` - Transaction details
- `receipt <hash>` - Transaction receipt
- `block <number|hash>` - Block details
- `code <address>` - Contract code

For detailed usage see [CLI.md](CLI.md)
