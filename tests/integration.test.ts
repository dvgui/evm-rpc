import { EVMRPCClient } from '../src/client';

describe('EVMRPCClient Integration Tests', () => {
  let client: EVMRPCClient;
  
  // Use a public RPC endpoint for integration tests
  const RPC_URL = process.env.RPC_URL || 'https://ethereum-rpc.publicnode.com';
  
  // Test addresses and values
  const VITALIK_ADDRESS = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
  const USDC_CONTRACT = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  beforeAll(() => {
    client = new EVMRPCClient(RPC_URL);
  });

  describe('Basic RPC calls', () => {
    it('should get current block number', async () => {
      const blockNumber = await client.getBlockNumber();
      
      expect(blockNumber).toMatch(/^0x[0-9a-fA-F]+$/);
      expect(parseInt(blockNumber, 16)).toBeGreaterThan(0);
    });

    it('should get chain ID (should be 1 for mainnet)', async () => {
      const chainId = await client.getChainId();
      
      expect(chainId).toBe('0x1'); // Ethereum mainnet
      expect(parseInt(chainId, 16)).toBe(1);
    });

    it('should get gas price', async () => {
      const gasPrice = await client.getGasPrice();
      
      expect(gasPrice).toMatch(/^0x[0-9a-fA-F]+$/);
      expect(parseInt(gasPrice, 16)).toBeGreaterThan(0);
    });

    it('should get network version', async () => {
      const networkVersion = await client.getNetworkVersion();
      
      expect(networkVersion).toBe('1'); // Ethereum mainnet
    });
  });

  describe('Account and balance queries', () => {
    it('should get balance for an address', async () => {
      const balance = await client.getBalance(VITALIK_ADDRESS);
      
      expect(balance).toMatch(/^0x[0-9a-fA-F]+$/);
      // Vitalik should have some ETH, but we won't assert exact amount
      expect(BigInt(balance)).toBeGreaterThan(0n);
    });

    it('should get transaction count (nonce)', async () => {
      const txCount = await client.getTransactionCount(VITALIK_ADDRESS);
      
      expect(txCount).toMatch(/^0x[0-9a-fA-F]+$/);
      expect(parseInt(txCount, 16)).toBeGreaterThan(0);
    });

    it('should return low balance for zero address', async () => {
      const balance = await client.getBalance(ZERO_ADDRESS);
      expect(balance).toMatch(/^0x[0-9a-fA-F]+$/);
      // Zero address might have some ETH from people sending to it accidentally
      // So we just check it's a valid hex response, not necessarily 0x0
    });
  });

  describe('Contract interactions', () => {
    it('should get contract code for USDC', async () => {
      const code = await client.getCode(USDC_CONTRACT);
      
      expect(code).toMatch(/^0x[0-9a-fA-F]+$/);
      expect(code.length).toBeGreaterThan(2); // More than just "0x"
      expect(code).not.toBe('0x');
    });

    it('should return 0x for EOA (externally owned account)', async () => {
      const code = await client.getCode(VITALIK_ADDRESS);
      expect(code).toBe('0x');
    });

    it('should make contract call to USDC totalSupply', async () => {
      const result = await client.call({
        to: USDC_CONTRACT,
        data: '0x18160ddd' // totalSupply() function selector
      });
      
      expect(result).toMatch(/^0x[0-9a-fA-F]+$/);
      expect(BigInt(result)).toBeGreaterThan(0n); // USDC should have supply
    });

    it('should get storage at position for a contract', async () => {
      const storage = await client.getStorageAt(USDC_CONTRACT, '0x0');
      
      expect(storage).toMatch(/^0x[0-9a-fA-F]+$/);
    });
  });

  describe('Block queries', () => {
    it('should get latest block', async () => {
      const block = await client.getBlockByNumber('latest', false);
      
      expect(block.hash).toMatch(/^0x[0-9a-fA-F]{64}$/);
      expect(block.number).toMatch(/^0x[0-9a-fA-F]+$/);
      expect(block.timestamp).toMatch(/^0x[0-9a-fA-F]+$/);
      expect(Array.isArray(block.transactions)).toBe(true);
      
      // Check that timestamp is reasonable (within last hour)
      const blockTime = parseInt(block.timestamp, 16) * 1000;
      const now = Date.now();
      expect(blockTime).toBeLessThanOrEqual(now);
      expect(blockTime).toBeGreaterThan(now - 3600000); // Within last hour
    });

    it('should get block by hash', async () => {
      // First get latest block to get a valid hash
      const latestBlock = await client.getBlockByNumber('latest', false);
      const block = await client.getBlockByHash(latestBlock.hash, false);
      
      expect(block.hash).toBe(latestBlock.hash);
      expect(block.number).toBe(latestBlock.number);
    });

    it('should get specific block by number', async () => {
      // Test with a known block (block 1)
      const block = await client.getBlockByNumber('0x1', false);
      
      expect(block.number).toBe('0x1');
      expect(block.hash).toMatch(/^0x[0-9a-fA-F]{64}$/);
    });

    it('should get safe block', async () => {
      const block = await client.getBlockByNumber('safe', false);
      
      expect(block.hash).toMatch(/^0x[0-9a-fA-F]{64}$/);
      expect(block.number).toMatch(/^0x[0-9a-fA-F]+$/);
      expect(block.timestamp).toMatch(/^0x[0-9a-fA-F]+$/);
      expect(Array.isArray(block.transactions)).toBe(true);
      
      // Safe block should be reasonably recent (within last 24 hours)
      const blockTime = parseInt(block.timestamp, 16) * 1000;
      const now = Date.now();
      expect(blockTime).toBeLessThanOrEqual(now);
      expect(blockTime).toBeGreaterThan(now - 24 * 3600000); // Within last 24 hours
    });

    it('should get finalized block', async () => {
      const block = await client.getBlockByNumber('finalized', false);
      
      expect(block.hash).toMatch(/^0x[0-9a-fA-F]{64}$/);
      expect(block.number).toMatch(/^0x[0-9a-fA-F]+$/);
      expect(block.timestamp).toMatch(/^0x[0-9a-fA-F]+$/);
      expect(Array.isArray(block.transactions)).toBe(true);
      
      // Finalized block should be reasonably recent (within last 24 hours)
      const blockTime = parseInt(block.timestamp, 16) * 1000;
      const now = Date.now();
      expect(blockTime).toBeLessThanOrEqual(now);
      expect(blockTime).toBeGreaterThan(now - 24 * 3600000); // Within last 24 hours
    });

    it('should verify block ordering: finalized <= safe <= latest', async () => {
      const [finalizedBlock, safeBlock, latestBlock] = await Promise.all([
        client.getBlockByNumber('finalized', false),
        client.getBlockByNumber('safe', false),
        client.getBlockByNumber('latest', false)
      ]);
      
      const finalizedNum = parseInt(finalizedBlock.number, 16);
      const safeNum = parseInt(safeBlock.number, 16);
      const latestNum = parseInt(latestBlock.number, 16);
      
      // Finalized should be <= Safe should be <= Latest
      expect(finalizedNum).toBeLessThanOrEqual(safeNum);
      expect(safeNum).toBeLessThanOrEqual(latestNum);
    });
  });

  describe('Error handling', () => {
    it('should handle invalid method calls gracefully', async () => {
      // This should fail as we're calling a non-existent method indirectly
      // by providing invalid parameters
      await expect(
        client.getBlockByNumber('invalid_block_number', false)
      ).rejects.toThrow();
    });

    it('should handle contract calls to invalid addresses', async () => {
      await expect(
        client.call({
          to: '0x0000000000000000000000000000000000000001', // Unlikely to be a valid contract
          data: '0x18160ddd'
        })
      ).resolves.toBeDefined(); // Should not throw, but may return empty result
    });
  });

  describe('Gas estimation', () => {
    it('should estimate gas for a simple transfer', async () => {
      const gasEstimate = await client.estimateGas({
        to: ZERO_ADDRESS,
        value: '0x0'
      });
      
      expect(gasEstimate).toMatch(/^0x[0-9a-fA-F]+$/);
      expect(parseInt(gasEstimate, 16)).toBeGreaterThan(0);
    });
  });
});
