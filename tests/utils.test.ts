import { isValidAddress, isValidTxHash, formatOutput } from '../src/utils';

describe('Utils', () => {
  describe('isValidAddress', () => {
    it('should validate correct Ethereum addresses', () => {
      expect(isValidAddress('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')).toBe(true);
      expect(isValidAddress('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48')).toBe(true);
      expect(isValidAddress('0x0000000000000000000000000000000000000000')).toBe(true);
    });

    it('should reject invalid Ethereum addresses', () => {
      expect(isValidAddress('0x123')).toBe(false);
      expect(isValidAddress('d8dA6BF26964aF9D7eEd9e03E53415D37aA96045')).toBe(false); // missing 0x
      expect(isValidAddress('0xGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG')).toBe(false); // invalid hex
      expect(isValidAddress('')).toBe(false);
      expect(isValidAddress('0x')).toBe(false);
    });
  });

  describe('isValidTxHash', () => {
    it('should validate correct transaction hashes', () => {
      expect(isValidTxHash('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef')).toBe(true);
      expect(isValidTxHash('0x0000000000000000000000000000000000000000000000000000000000000000')).toBe(true);
    });

    it('should reject invalid transaction hashes', () => {
      expect(isValidTxHash('0x123')).toBe(false);
      expect(isValidTxHash('1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef')).toBe(false); // missing 0x
      expect(isValidTxHash('0xGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG')).toBe(false); // invalid hex
      expect(isValidTxHash('')).toBe(false);
      expect(isValidTxHash('0x')).toBe(false);
    });
  });

  describe('formatOutput', () => {
    it('should format strings as pretty output by default', () => {
      const result = formatOutput('0x15f5a48');
      expect(result).toBe('0x15f5a48 (23026248)');
    });

    it('should format regular strings without conversion', () => {
      const result = formatOutput('hello world');
      expect(result).toBe('hello world');
    });

    it('should format objects as JSON in pretty mode', () => {
      const obj = { test: 'value', number: 42 };
      const result = formatOutput(obj, 'pretty');
      expect(result).toBe(JSON.stringify(obj, null, 2));
    });

    it('should format as JSON when specified', () => {
      const result = formatOutput('0x15f5a48', 'json');
      expect(result).toBe('"0x15f5a48"');
    });

    it('should handle complex objects in JSON format', () => {
      const obj = { 
        hash: '0xabc123',
        number: '0x15f5a48',
        nested: { value: 42 }
      };
      const result = formatOutput(obj, 'json');
      expect(JSON.parse(result)).toEqual(obj);
    });
  });
});
