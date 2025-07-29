#!/usr/bin/env node

import { Command } from 'commander';
import { formatEther } from 'ethers';
import { EVMRPCClient } from './client';
import { formatOutput, isValidAddress, isValidTxHash } from './utils';

const program = new Command();

program
  .name('evm-rpc')
  .description('EVM RPC Framework CLI')
  .version('1.0.0')
  .requiredOption('-u, --url <url>', 'RPC URL endpoint')
  .option('-f, --format <format>', 'Output format (json|pretty)', 'pretty');

// Get block number
program
  .command('block-number')
  .description('Get the current block number')
  .action(async (options, command) => {
    try {
      const client = new EVMRPCClient(command.parent.opts().url);
      const result = await client.getBlockNumber();
      console.log(formatOutput(result, command.parent.opts().format));
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Get balance
program
  .command('balance')
  .description('Get balance of an address')
  .argument('<address>', 'Ethereum address')
  .option('-b, --block <block>', 'Block tag (latest, earliest, pending, or block number)', 'latest')
  .action(async (address, options, command) => {
    try {
      if (!isValidAddress(address)) {
        throw new Error('Invalid Ethereum address');
      }

      const client = new EVMRPCClient(command.parent.opts().url);
      const result = await client.getBalance(address, options.block);
      
      if (command.parent.opts().format === 'pretty') {
        const ether = formatEther(result);
        console.log(`Balance: ${result} wei (${ether} ETH)`);
      } else {
        console.log(formatOutput(result, command.parent.opts().format));
      }
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Call contract
program
  .command('call')
  .description('Make a call to a smart contract')
  .argument('<to>', 'Contract address')
  .option('-d, --data <data>', 'Call data (hex)', '0x')
  .option('-f, --from <from>', 'From address')
  .option('-g, --gas <gas>', 'Gas limit')
  .option('-p, --gas-price <gasPrice>', 'Gas price')
  .option('-v, --value <value>', 'Value to send')
  .option('-b, --block <block>', 'Block tag', 'latest')
  .action(async (to, options, command) => {
    try {
      if (!isValidAddress(to)) {
        throw new Error('Invalid contract address');
      }

      const callParams: any = { to };
      if (options.data) callParams.data = options.data;
      if (options.from) callParams.from = options.from;
      if (options.gas) callParams.gas = options.gas;
      if (options.gasPrice) callParams.gasPrice = options.gasPrice;
      if (options.value) callParams.value = options.value;

      const client = new EVMRPCClient(command.parent.opts().url);
      const result = await client.call(callParams, options.block);
      console.log(formatOutput(result, command.parent.opts().format));
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Get transaction
program
  .command('tx')
  .description('Get transaction details by hash')
  .argument('<hash>', 'Transaction hash')
  .action(async (hash, options, command) => {
    try {
      if (!isValidTxHash(hash)) {
        throw new Error('Invalid transaction hash');
      }

      const client = new EVMRPCClient(command.parent.opts().url);
      const result = await client.getTransactionByHash(hash);
      console.log(formatOutput(result, command.parent.opts().format));
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Get transaction receipt
program
  .command('receipt')
  .description('Get transaction receipt by hash')
  .argument('<hash>', 'Transaction hash')
  .action(async (hash, options, command) => {
    try {
      if (!isValidTxHash(hash)) {
        throw new Error('Invalid transaction hash');
      }

      const client = new EVMRPCClient(command.parent.opts().url);
      const result = await client.getTransactionReceipt(hash);
      console.log(formatOutput(result, command.parent.opts().format));
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Get block
program
  .command('block')
  .description('Get block by number or hash')
  .argument('<identifier>', 'Block number (hex/decimal) or block hash')
  .option('-t, --transactions', 'Include full transaction details', false)
  .action(async (identifier, options, command) => {
    try {
      const client = new EVMRPCClient(command.parent.opts().url);
      let result;

      if (identifier.startsWith('0x') && identifier.length === 66) {
        // Block hash
        result = await client.getBlockByHash(identifier, options.transactions);
      } else {
        // Block number (convert to hex if decimal)
        const blockNumber = identifier.startsWith('0x') ? identifier : '0x' + parseInt(identifier).toString(16);
        result = await client.getBlockByNumber(blockNumber, options.transactions);
      }

      console.log(formatOutput(result, command.parent.opts().format));
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Get code
program
  .command('code')
  .description('Get code at an address')
  .argument('<address>', 'Contract address')
  .option('-b, --block <block>', 'Block tag', 'latest')
  .action(async (address, options, command) => {
    try {
      if (!isValidAddress(address)) {
        throw new Error('Invalid Ethereum address');
      }

      const client = new EVMRPCClient(command.parent.opts().url);
      const result = await client.getCode(address, options.block);
      console.log(formatOutput(result, command.parent.opts().format));
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

// Get chain info
program
  .command('info')
  .description('Get blockchain information')
  .action(async (options, command) => {
    try {
      const client = new EVMRPCClient(command.parent.opts().url);
      
      const [blockNumber, chainId, gasPrice] = await Promise.all([
        client.getBlockNumber(),
        client.getChainId(),
        client.getGasPrice()
      ]);

      const info = {
        blockNumber: `${blockNumber} (${parseInt(blockNumber, 16)})`,
        chainId: `${chainId} (${parseInt(chainId, 16)})`,
        gasPrice: `${gasPrice} (${parseInt(gasPrice, 16)} gwei)`
      };

      console.log(formatOutput(info, command.parent.opts().format));
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program.parse();
