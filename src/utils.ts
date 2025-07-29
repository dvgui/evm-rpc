import { isAddress } from 'ethers';

// Re-export isAddress directly from ethers
export { isAddress };

/**
 * Validate Ethereum address with strict formatting
 */
export function isValidAddress(address: string): boolean {
  // First check with our strict regex (must have 0x prefix and correct length)
  const isValidFormat = /^0x[a-fA-F0-9]{40}$/.test(address);
  if (!isValidFormat) {
    return false;
  }
  
  // Then use ethers for checksum validation
  return isAddress(address);
}

/**
 * Validate transaction hash
 */
export function isValidTxHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash);
}

/**
 * Format output for better readability
 */
export function formatOutput(data: unknown, format: 'json' | 'pretty' = 'pretty'): string {
  if (format === 'json') {
    return JSON.stringify(data, null, 2);
  }

  // Pretty format for common data types
  if (typeof data === 'string') {
    // Check if it's a hex number and convert to decimal for readability
    if (data.startsWith('0x') && /^0x[0-9a-fA-F]+$/.test(data)) {
      const decimal = parseInt(data, 16);
      return `${data} (${decimal})`;
    }
    return data;
  }

  return JSON.stringify(data, null, 2);
}
