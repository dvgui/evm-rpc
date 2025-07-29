# CLI Reference

## Usage

```bash
node dist/cli.js -u <RPC_URL> <command> [arguments] [options]
```

## Global Options

- `-u, --url <url>` - RPC URL endpoint (required)
- `-f, --format <format>` - Output format: `json` or `pretty` (default: pretty)

## Commands

### info
Get blockchain information (chain ID, network version, gas price, block number)
```bash
node dist/cli.js -u https://ethereum-rpc.publicnode.com info
```

### block-number
Get current block number
```bash
node dist/cli.js -u https://ethereum-rpc.publicnode.com block-number
```

### balance \<address>
Get balance of an address
```bash
node dist/cli.js -u https://ethereum-rpc.publicnode.com balance 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
```

### call \<to> [options]
Make a contract call
- `-d, --data <data>` - Call data (hex)
- `-f, --from <address>` - From address
- `-v, --value <value>` - Value to send
- `-g, --gas <gas>` - Gas limit

```bash
# Get USDC total supply
node dist/cli.js -u https://ethereum-rpc.publicnode.com call 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 -d 0x18160ddd
```

### tx \<hash>
Get transaction by hash
```bash
node dist/cli.js -u https://ethereum-rpc.publicnode.com tx 0x123...
```

### receipt \<hash>
Get transaction receipt
```bash
node dist/cli.js -u https://ethereum-rpc.publicnode.com receipt 0x123...
```

### block \<identifier>
Get block by number or hash
```bash
node dist/cli.js -u https://ethereum-rpc.publicnode.com block latest
node dist/cli.js -u https://ethereum-rpc.publicnode.com block 18000000
```

### code \<address>
Get contract code
```bash
node dist/cli.js -u https://ethereum-rpc.publicnode.com code 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
```

## Output Formats

### Pretty (default)
Human-readable output with formatting and colors

### JSON
Raw JSON output for scripting
```bash
node dist/cli.js -u https://ethereum-rpc.publicnode.com info --format json
```

## Examples

```bash
# Check if address is a contract
node dist/cli.js -u https://ethereum-rpc.publicnode.com code 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48

# Get latest block details
node dist/cli.js -u https://ethereum-rpc.publicnode.com block latest

# Check balance and format as JSON
node dist/cli.js -u https://ethereum-rpc.publicnode.com balance 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045 -f json
```
