# EVM RPC Framework

A TypeScript framework for interacting with EVM-compatible blockchain RPC endpoints in read-only mode.

## Features

- 🔗 Connect to any EVM RPC endpoint
- 📖 Read-only operations (no private key required)
- 🛠 Comprehensive CLI interface
- 📦 TypeScript support with full type definitions
- 🚀 Easy to use and extend

## Installation

```bash
npm install
npm run build
```

## Usage

### CLI Usage

```bash
# Using npm run (for local development)
npm run evm-rpc '--' -u <RPC_URL> <command> [arguments] [options]

# Example with public node
npm run evm-rpc '--' -u https://ethereum-rpc.publicnode.com info

# Using npx (when published to npm)
npx evm-rpc -u <RPC_URL> <command> [arguments] [options]
```

### Available Commands

- `block-number` - Get current block number
- `balance <address>` - Get balance of an address
- `call <to> [options]` - Make a contract call
- `tx <hash>` - Get transaction by hash
- `receipt <hash>` - Get transaction receipt
- `block <identifier>` - Get block by number or hash
- `code <address>` - Get contract code
- `info` - Get blockchain information

### Options

- `-u, --url <url>` - RPC URL endpoint (required)
- `-f, --format <format>` - Output format: `json` or `pretty` (default: pretty)

### Programmatic Usage

```typescript
import { EVMRPCClient } from './src/client';

const client = new EVMRPCClient('https://ethereum-rpc.publicnode.com');

// Get current block number
const blockNumber = await client.getBlockNumber();
console.log('Current block:', blockNumber);

// Get balance
const balance = await client.getBalance('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');
console.log('Balance:', balance);

// Make a contract call
const result = await client.call({
  to: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  data: '0x18160ddd' // totalSupply function selector
});
```

## Supported RPC Methods

- `eth_blockNumber` - Get current block number
- `eth_getBalance` - Get account balance
- `eth_call` - Execute a message call
- `eth_getTransactionCount` - Get transaction count
- `eth_getCode` - Get contract code
- `eth_getStorageAt` - Get storage value
- `eth_getTransactionByHash` - Get transaction by hash
- `eth_getTransactionReceipt` - Get transaction receipt
- `eth_getBlockByNumber` - Get block by number
- `eth_getBlockByHash` - Get block by hash
- `eth_getLogs` - Get logs
- `eth_gasPrice` - Get current gas price
- `eth_estimateGas` - Estimate gas usage
- `eth_chainId` - Get chain ID
- `net_version` - Get network version

## CLI Examples

```bash
# Get blockchain info
npm run evm-rpc '--' -u https://ethereum-rpc.publicnode.com info

# Get current block number
npm run evm-rpc '--' -u https://ethereum-rpc.publicnode.com block-number

# Get account balance
npm run evm-rpc '--' -u https://ethereum-rpc.publicnode.com balance 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045

# Make contract call (USDC totalSupply)
npm run evm-rpc '--' -u https://ethereum-rpc.publicnode.com call 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 -d 0x18160ddd
```

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev -- -u YOUR_RPC_URL info

# Clean build artifacts
npm run clean
```

## License

MIT
