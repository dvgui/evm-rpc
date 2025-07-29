import { isAddress } from 'ethers';

/**
 * Validate Ethereum address
 */
export function isValidAddress(address: string): boolean {
  // First check with our strict regex
  const isValidFormat = /^0x[a-fA-F0-9]{40}$/.test(address);
  if (!isValidFormat) {
    return false;
  }
  
  // Then use ethers for additional validation (checksum, etc.)
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
