import axios, { AxiosInstance } from 'axios';
import { RPCRequest, RPCResponse, EVMCallParams, BlockTagParameter, TransactionReceipt, Block, Transaction, Log } from './types';

export class EVMRPCClient {
  private client: AxiosInstance;
  private requestId: number = 1;

  constructor(private rpcUrl: string) {
    this.client = axios.create({
      baseURL: rpcUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  private async makeRequest<T>(method: string, params: unknown[] = []): Promise<T> {
    const request: RPCRequest = {
      jsonrpc: '2.0',
      method,
      params,
      id: this.requestId++,
    };

    try {
      const response = await this.client.post('', request);
      const rpcResponse: RPCResponse<T> = response.data;

      if (rpcResponse.error) {
        throw new Error(`RPC Error ${rpcResponse.error.code}: ${rpcResponse.error.message}`);
      }

      return rpcResponse.result as T;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Network Error: ${error.message}`);
      }
      throw error;
    }
  }

  // Get the current block number
  async getBlockNumber(): Promise<string> {
    return this.makeRequest<string>('eth_blockNumber');
  }

  // Get balance of an address
  async getBalance(address: string, blockTag: BlockTagParameter = 'latest'): Promise<string> {
    return this.makeRequest<string>('eth_getBalance', [address, blockTag]);
  }

  // Make a call to a smart contract
  async call(params: EVMCallParams, blockTag: BlockTagParameter = 'latest'): Promise<string> {
    return this.makeRequest<string>('eth_call', [params, blockTag]);
  }

  // Get transaction count (nonce) for an address
  async getTransactionCount(address: string, blockTag: BlockTagParameter = 'latest'): Promise<string> {
    return this.makeRequest<string>('eth_getTransactionCount', [address, blockTag]);
  }

  // Get code at an address
  async getCode(address: string, blockTag: BlockTagParameter = 'latest'): Promise<string> {
    return this.makeRequest<string>('eth_getCode', [address, blockTag]);
  }

  // Get storage at a position
  async getStorageAt(address: string, position: string, blockTag: BlockTagParameter = 'latest'): Promise<string> {
    return this.makeRequest<string>('eth_getStorageAt', [address, position, blockTag]);
  }

  // Get transaction by hash
  async getTransactionByHash(hash: string): Promise<Transaction | null> {
    return this.makeRequest<Transaction | null>('eth_getTransactionByHash', [hash]);
  }

  // Get transaction receipt
  async getTransactionReceipt(hash: string): Promise<TransactionReceipt | null> {
    return this.makeRequest<TransactionReceipt | null>('eth_getTransactionReceipt', [hash]);
  }

  // Get block by number
  async getBlockByNumber(blockNumber: BlockTagParameter, fullTransactions: boolean = false): Promise<Block> {
    return this.makeRequest<Block>('eth_getBlockByNumber', [blockNumber, fullTransactions]);
  }

  // Get block by hash
  async getBlockByHash(blockHash: string, fullTransactions: boolean = false): Promise<Block> {
    return this.makeRequest<Block>('eth_getBlockByHash', [blockHash, fullTransactions]);
  }

  // Get logs
  async getLogs(filter: {
    fromBlock?: BlockTagParameter;
    toBlock?: BlockTagParameter;
    address?: string | string[];
    topics?: (string | string[] | null)[];
  }): Promise<Log[]> {
    return this.makeRequest<Log[]>('eth_getLogs', [filter]);
  }

  // Get gas price
  async getGasPrice(): Promise<string> {
    return this.makeRequest<string>('eth_gasPrice');
  }

  // Estimate gas
  async estimateGas(params: EVMCallParams): Promise<string> {
    return this.makeRequest<string>('eth_estimateGas', [params]);
  }

  // Get chain ID
  async getChainId(): Promise<string> {
    return this.makeRequest<string>('eth_chainId');
  }

  // Get network version
  async getNetworkVersion(): Promise<string> {
    return this.makeRequest<string>('net_version');
  }
}
