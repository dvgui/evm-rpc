export interface RPCRequest {
  jsonrpc: string;
  method: string;
  params: any[];
  id: number | string;
}

export interface RPCResponse<T = any> {
  jsonrpc: string;
  id: number | string;
  result?: T;
  error?: RPCError;
}

export interface RPCError {
  code: number;
  message: string;
  data?: any;
}

export interface EVMCallParams {
  to: string;
  data?: string;
  from?: string;
  gas?: string;
  gasPrice?: string;
  value?: string;
}

export interface BlockTag {
  blockNumber?: string;
  blockHash?: string;
  tag?: 'latest' | 'earliest' | 'pending';
}

export interface TransactionReceipt {
  transactionHash: string;
  transactionIndex: string;
  blockHash: string;
  blockNumber: string;
  from: string;
  to: string | null;
  cumulativeGasUsed: string;
  gasUsed: string;
  contractAddress: string | null;
  logs: any[];
  status: string;
}

export interface Block {
  number: string;
  hash: string;
  parentHash: string;
  timestamp: string;
  gasLimit: string;
  gasUsed: string;
  miner: string;
  transactions: string[] | any[];
}
