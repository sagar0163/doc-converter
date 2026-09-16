import { describe, it, expect } from 'vitest';
import { escapeHtml, unescapeHtml, sanitizeUrl } from '../../src/sanitize.js';

describe('sanitize helpers', () => {
  it('escapeHtml escapes < > & quotes', () => {
    expect(escapeHtml('1 < 2 & "q"')).toBe('1 &lt; 2 &amp; &quot;q&quot;');
  });

  it('unescapeHtml is the inverse of escapeHtml (entity round-trip)', () => {
    const original = `1 < 2 & "q" 's'`;
    expect(unescapeHtml(escapeHtml(original))).toBe(original);
  });

  it('blocks javascript:, data: and vbscript: schemes', () => {
    expect(sanitizeUrl('javascript:alert(1)')).toBe('#');
    expect(sanitizeUrl('JAVASCRIPT:alert(1)')).toBe('#');
    expect(sanitizeUrl('data:text/html,<script>alert(1)</script>')).toBe('#');
    expect(sanitizeUrl('vbscript:msgbox(1)')).toBe('#');
  });

  it('blocks scheme obfuscations: embedded whitespace, numeric and named character refs', () => {
    expect(sanitizeUrl('java\nscript:alert(1)')).toBe('#');
    expect(sanitizeUrl('java\tscript:alert(1)')).toBe('#');
    expect(sanitizeUrl('jav&#x61;script:alert(1)')).toBe('#');
    expect(sanitizeUrl('javascript&colon;alert(1)')).toBe('#');
  });

  it('keeps safe http(s)/relative URLs and data in a safe scheme untouched', () => {
    expect(sanitizeUrl('https://example.com/?a=1&b=2')).toBe('https://example.com/?a=1&b=2');
    expect(sanitizeUrl('/relative/path')).toBe('/relative/path');
    expect(sanitizeUrl('mailto:dev@example.com')).toBe('mailto:dev@example.com');
  });
});