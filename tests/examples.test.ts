import { EVMRPCClient } from '../src/client';
import { formatEther } from 'ethers';

describe('Examples Test Suite', () => {
  let client: EVMRPCClient;
  
  const RPC_URL = process.env.RPC_URL || 'https://ethereum-rpc.publicnode.com';
  const VITALIK_ADDRESS = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
  const USDC_CONTRACT = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

  beforeAll(() => {
    client = new EVMRPCClient(RPC_URL);
  });

  it('should run the complete example workflow', async () => {
    console.log('🔗 Running EVM RPC Framework Test Examples\n');

    // Example 1: Get current block number
    console.log('📊 Getting current block number...');
    const blockNumber = await client.getBlockNumber();
    expect(blockNumber).toMatch(/^0x[0-9a-fA-F]+$/);
    console.log(`Current block: ${blockNumber} (${parseInt(blockNumber, 16)})\n`);

    // Example 2: Get balance
    console.log(`💰 Getting balance for ${VITALIK_ADDRESS}...`);
    const balance = await client.getBalance(VITALIK_ADDRESS);
    expect(balance).toMatch(/^0x[0-9a-fA-F]+$/);
    expect(BigInt(balance)).toBeGreaterThan(0n);
    console.log(`Balance: ${balance} wei (${formatEther(balance)} ETH)\n`);

    // Example 3: Get chain information
    console.log('🌐 Getting chain information...');
    const [chainId, gasPrice] = await Promise.all([
      client.getChainId(),
      client.getGasPrice()
    ]);
    expect(chainId).toBe('0x1');
    expect(gasPrice).toMatch(/^0x[0-9a-fA-F]+$/);
    console.log(`Chain ID: ${chainId} (${parseInt(chainId, 16)})`);
    console.log(`Gas Price: ${gasPrice} (${parseInt(gasPrice, 16)} gwei)\n`);

    // Example 4: Get latest block details
    console.log('📦 Getting latest block details...');
    const latestBlock = await client.getBlockByNumber('latest', false);
    expect(latestBlock.hash).toMatch(/^0x[0-9a-fA-F]{64}$/);
    expect(latestBlock.number).toMatch(/^0x[0-9a-fA-F]+$/);
    console.log(`Block Hash: ${latestBlock.hash}`);
    console.log(`Block Number: ${latestBlock.number} (${parseInt(latestBlock.number, 16)})`);
    console.log(`Timestamp: ${latestBlock.timestamp} (${new Date(parseInt(latestBlock.timestamp, 16) * 1000).toISOString()})`);
    console.log(`Gas Used: ${latestBlock.gasUsed} / ${latestBlock.gasLimit}\n`);

    // Example 5: Check contract code
    console.log('🔍 Checking if address has contract code...');
    const code = await client.getCode(USDC_CONTRACT);
    expect(code).toMatch(/^0x[0-9a-fA-F]+$/);
    expect(code).not.toBe('0x');
    console.log(`Contract code length: ${code.length} characters`);
    console.log(`Is contract: ${code !== '0x' ? 'Yes' : 'No'}\n`);

    // Example 6: Make a contract call
    console.log('📞 Making contract call to USDC totalSupply...');
    const totalSupply = await client.call({
      to: USDC_CONTRACT,
      data: '0x18160ddd' // totalSupply() function selector
    });
    expect(totalSupply).toMatch(/^0x[0-9a-fA-F]+$/);
    expect(BigInt(totalSupply)).toBeGreaterThan(0n);
    console.log(`USDC Total Supply: ${totalSupply} (${parseInt(totalSupply, 16)} units)\n`);

    console.log('✅ All example tests completed successfully!');
  });

  it('should handle various block number formats', async () => {
    // Test different block number formats
    const latest = await client.getBlockByNumber('latest', false);
    const earliest = await client.getBlockByNumber('earliest', false);
    const pending = await client.getBlockByNumber('pending', false);
    
    expect(latest.number).toMatch(/^0x[0-9a-fA-F]+$/);
    expect(earliest.number).toBe('0x0');
    expect(pending.number).toMatch(/^0x[0-9a-fA-F]+$/);
  });

  it('should handle balance queries for different scenarios', async () => {
    // Test balance for contract vs EOA
    const eoaBalance = await client.getBalance(VITALIK_ADDRESS);
    const contractBalance = await client.getBalance(USDC_CONTRACT);
    
    expect(eoaBalance).toMatch(/^0x[0-9a-fA-F]+$/);
    expect(contractBalance).toMatch(/^0x[0-9a-fA-F]+$/);
    
    // Vitalik should have more ETH than the USDC contract typically holds
    expect(BigInt(eoaBalance)).toBeGreaterThan(0n);
  });

  it('should handle transaction count queries', async () => {
    const nonce = await client.getTransactionCount(VITALIK_ADDRESS);
    expect(nonce).toMatch(/^0x[0-9a-fA-F]+$/);
    expect(parseInt(nonce, 16)).toBeGreaterThan(100); // Vitalik has made many transactions
  });

  it('should demonstrate logs query capability', async () => {
    // Query recent logs from USDC contract (Transfer events)
    const logs = await client.getLogs({
      address: USDC_CONTRACT,
      fromBlock: 'latest',
      toBlock: 'latest',
      topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'] // Transfer event signature
    });
    
    expect(Array.isArray(logs)).toBe(true);
    // Note: logs might be empty if no transfers in the latest block, which is fine
  });
});
