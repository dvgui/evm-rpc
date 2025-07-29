import { EVMRPCClient } from '../src/client';
import { spawn } from 'child_process';
import path from 'path';

describe('Null Response Handling', () => {
  let client: EVMRPCClient;
  
  // Use a public RPC endpoint for tests
  const RPC_URL = process.env.RPC_URL || 'https://ethereum-rpc.publicnode.com';
  
  // Non-existent values for testing
  const NON_EXISTENT_TX_HASH = '0x1111111111111111111111111111111111111111111111111111111111111111';
  const NON_EXISTENT_BLOCK_HASH = '0x2222222222222222222222222222222222222222222222222222222222222222';
  const FUTURE_BLOCK_NUMBER = '0x999999999'; // Very high block number that likely doesn't exist

  beforeAll(() => {
    client = new EVMRPCClient(RPC_URL);
  });

  describe('Client null handling', () => {
    it('should return null for non-existent transaction', async () => {
      const result = await client.getTransactionByHash(NON_EXISTENT_TX_HASH);
      expect(result).toBeNull();
    });

    it('should return null for non-existent transaction receipt', async () => {
      const result = await client.getTransactionReceipt(NON_EXISTENT_TX_HASH);
      expect(result).toBeNull();
    });

    it('should return null for non-existent block by hash', async () => {
      const result = await client.getBlockByHash(NON_EXISTENT_BLOCK_HASH);
      expect(result).toBeNull();
    });

    it('should return null for future block number', async () => {
      const result = await client.getBlockByNumber(FUTURE_BLOCK_NUMBER);
      expect(result).toBeNull();
    });
  });

  describe('CLI error handling', () => {
    const CLI_PATH = path.resolve(__dirname, '../dist/cli.js');
    
    const runCLI = (args: string[]): Promise<{ stdout: string; stderr: string; exitCode: number }> => {
      return new Promise((resolve) => {
        const child = spawn('node', [CLI_PATH, ...args], {
          stdio: 'pipe',
          env: { ...process.env }
        });

        let stdout = '';
        let stderr = '';

        child.stdout?.on('data', (data) => {
          stdout += data.toString();
        });

        child.stderr?.on('data', (data) => {
          stderr += data.toString();
        });

        child.on('close', (code) => {
          resolve({
            stdout: stdout.trim(),
            stderr: stderr.trim(),
            exitCode: code || 0
          });
        });
      });
    };

    it('should handle non-existent block with proper error message', async () => {
      const result = await runCLI(['-u', RPC_URL, 'block', FUTURE_BLOCK_NUMBER.replace('0x', '')]);
      
      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('Block');
      expect(result.stderr).toContain('not found');
      expect(result.stderr).toContain('may not exist yet');
    });

    it('should handle non-existent block with --status flag', async () => {
      const result = await runCLI(['-u', RPC_URL, 'block', FUTURE_BLOCK_NUMBER.replace('0x', ''), '--status']);
      
      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('Block');
      expect(result.stderr).toContain('not found');
      expect(result.stderr).toContain('may not exist yet');
    });

    it('should handle non-existent block by hash', async () => {
      const result = await runCLI(['-u', RPC_URL, 'block', NON_EXISTENT_BLOCK_HASH]);
      
      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('Block');
      expect(result.stderr).toContain('not found');
    });

    it('should handle non-existent transaction', async () => {
      const result = await runCLI(['-u', RPC_URL, 'tx', NON_EXISTENT_TX_HASH]);
      
      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('Transaction');
      expect(result.stderr).toContain('not found');
    });

    it('should handle non-existent transaction receipt', async () => {
      const result = await runCLI(['-u', RPC_URL, 'receipt', NON_EXISTENT_TX_HASH]);
      
      expect(result.exitCode).toBe(1);
      expect(result.stderr).toContain('Transaction receipt');
      expect(result.stderr).toContain('not found');
    });

    it('should still work for existing blocks', async () => {
      // Test with a very early block that should exist
      const result = await runCLI(['-u', RPC_URL, 'block', '1']);
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toContain('0x1');
      expect(result.stderr).toBe('');
    });

    it('should work with block tags', async () => {
      const result = await runCLI(['-u', RPC_URL, 'block', 'latest']);
      
      expect(result.exitCode).toBe(0);
      expect(result.stdout).toMatch(/0x[0-9a-fA-F]+/);
      expect(result.stderr).toBe('');
    });
  });
});
