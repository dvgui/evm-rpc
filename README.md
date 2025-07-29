# EVM RPC Framework

A TypeScript framework for interacting with EVM-compatible blockchain RPC endpoints with full type safety and modern tooling.

## Features

- 🔗 Connect to any EVM RPC endpoint
- 📖 Read-only operations (no private key required)
- 🛠 Comprehensive CLI interface
- 📦 Full TypeScript support with type definitions
- 🚀 Modern build system with esbuild
- ✅ Comprehensive test coverage (34 tests)
- 🏷️ Support for all Ethereum block tags (`latest`, `earliest`, `pending`, `safe`, `finalized`)
- 📊 Block finalization status checking

## Quick Start

```bash
yarn install
yarn build

# Get blockchain info
yarn evm-rpc -u https://ethereum-rpc.publicnode.com info

# Get latest/safe/finalized blocks
yarn evm-rpc -u https://ethereum-rpc.publicnode.com block latest
yarn evm-rpc -u https://ethereum-rpc.publicnode.com block safe
yarn evm-rpc -u https://ethereum-rpc.publicnode.com block finalized

# Check block finalization status
yarn evm-rpc -u https://ethereum-rpc.publicnode.com block 23026700 --status

# Get account balance
yarn evm-rpc -u https://ethereum-rpc.publicnode.com balance 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
```

## CLI Commands

| Command | Description | Example |
|---------|-------------|---------|
| `info` | Get blockchain information | `yarn evm-rpc -u URL info` |
| `block-number` | Get current block number | `yarn evm-rpc -u URL block-number` |
| `balance <address>` | Get account balance | `yarn evm-rpc -u URL balance 0x...` |
| `block <identifier>` | Get block by number/hash/tag | `yarn evm-rpc -u URL block latest` |
| `call <to>` | Make contract call | `yarn evm-rpc -u URL call 0x... -d 0x...` |
| `code <address>` | Get contract code | `yarn evm-rpc -u URL code 0x...` |
| `tx <hash>` | Get transaction details | `yarn evm-rpc -u URL tx 0x...` |
| `receipt <hash>` | Get transaction receipt | `yarn evm-rpc -u URL receipt 0x...` |

### Block Command Options

- `--status` - Show finalization status for block numbers (finalized/safe/pending)
- `--full` - Show complete block data (default for non-tag identifiers)
- `-t, --transactions` - Include full transaction details

```bash
# Concise block tag output
yarn evm-rpc -u URL block safe
# Output: 0x15f5c1f (23026719)

# Block finalization status
yarn evm-rpc -u URL block 23026700 --status
# Output: Block 0x15f5c0c (23026700) - Status: safe
#         Finalized: 0x15f5bff (23026687)
#         Safe: 0x15f5c1f (23026719)

# Full block data
yarn evm-rpc -u URL block safe --full
# Output: Complete JSON block data
```

## Programmatic Usage

```typescript
import { EVMRPCClient } from './src/client';

const client = new EVMRPCClient('https://ethereum-rpc.publicnode.com');

// Get blocks with different confirmation levels
const latestBlock = await client.getBlockByNumber('latest');
const safeBlock = await client.getBlockByNumber('safe');
const finalizedBlock = await client.getBlockByNumber('finalized');

// Get account balance
const balance = await client.getBalance('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045');

// Make contract call (USDC totalSupply)
const result = await client.call({
  to: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  data: '0x18160ddd'
});
```

## Block Confirmation Levels

| Tag | Description | Use Case |
|-----|-------------|----------|
| `finalized` | ~64 blocks behind latest (irreversible) | High-value transactions, final settlement |
| `safe` | ~32 blocks behind latest (very unlikely to change) | Most DeFi applications |
| `latest` | Most recent block | Real-time data, may be reorganized |
| `pending` | Unconfirmed transactions | Live transaction monitoring |

## Development

```bash
# Install dependencies
yarn install

# Build the project
yarn build

# Run tests
yarn test

# Development mode with auto-rebuild
yarn dev -u YOUR_RPC_URL info
```

## Technical Stack

- **TypeScript 5.0** - Full type safety
- **esbuild 0.25.8** - Lightning-fast builds  
- **Jest 30.0.5** - Comprehensive testing
- **Commander 14.0.0** - CLI interface
- **Node.js 22.x** - Modern runtime features

## License

MIT
