#!/usr/bin/env node

// Example usage of the EVM RPC Framework
// This demonstrates how to use the framework programmatically

import { EVMRPCClient } from './client';
import { formatEther } from 'ethers';

async function examples(): Promise<void> {
  // Replace with your RPC URL
  const RPC_URL = 'https://ethereum-rpc.publicnode.com';
  // For production, use a dedicated RPC provider like Alchemy or Infura
  
  const client = new EVMRPCClient(RPC_URL);

  try {
    console.log('🔗 EVM RPC Framework Examples\n');

    // Example 1: Get current block number
    console.log('📊 Getting current block number...');
    const blockNumber = await client.getBlockNumber();
    console.log(`Current block: ${blockNumber} (${parseInt(blockNumber, 16)})\n`);

    // Example 2: Get balance of Ethereum Foundation address
    const ethFoundationAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'; // Vitalik's address
    console.log(`💰 Getting balance for ${ethFoundationAddress}...`);
    const balance = await client.getBalance(ethFoundationAddress);
    console.log(`Balance: ${balance} wei (${formatEther(balance)} ETH)\n`);

    // Example 3: Get chain information
    console.log('🌐 Getting chain information...');
    const [chainId, gasPrice] = await Promise.all([
      client.getChainId(),
      client.getGasPrice()
    ]);
    console.log(`Chain ID: ${chainId} (${parseInt(chainId, 16)})`);
    console.log(`Gas Price: ${gasPrice} (${parseInt(gasPrice, 16)} gwei)\n`);

    // Example 4: Get latest block details
    console.log('📦 Getting latest block details...');
    const latestBlock = await client.getBlockByNumber('latest', false);
    console.log(`Block Hash: ${latestBlock.hash}`);
    console.log(`Block Number: ${latestBlock.number} (${parseInt(latestBlock.number, 16)})`);
    console.log(`Timestamp: ${latestBlock.timestamp} (${new Date(parseInt(latestBlock.timestamp, 16) * 1000).toISOString()})`);
    console.log(`Gas Used: ${latestBlock.gasUsed} / ${latestBlock.gasLimit}\n`);

    // Example 5: Check if address has contract code
    console.log('🔍 Checking if address has contract code...');
    const usdcAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'; // USDC contract
    const code = await client.getCode(usdcAddress);
    console.log(`Contract code length: ${code.length} characters`);
    console.log(`Is contract: ${code !== '0x' ? 'Yes' : 'No'}\n`);

    console.log('✅ All examples completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    
    if (error instanceof Error && error.message.includes('Network Error')) {
      console.log('\n💡 Tip: Make sure to replace the RPC_URL with a valid endpoint.');
      console.log('   You can get free API keys from:');
      console.log('   - Alchemy: https://www.alchemy.com/');
      console.log('   - Infura: https://infura.io/');
      console.log('   - Or use public RPCs like https://cloudflare-eth.com');
    }
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  examples();
}
