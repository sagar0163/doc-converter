/**
 * Output sanitizers for conversion results.
 *
 * Markdown (and plain text) is treated as untrusted input: any consumer that
 * serves or opens a converted document is exposed to stored XSS if raw HTML or
 * dangerous URL schemes survive into the output. These helpers guarantee the
 * generated HTML is well-formed and free of script-bearing constructs.
 */

const htmlEscapeMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
};

const BLOCKED_URL_SCHEMES = ['javascript:', 'data:', 'vbscript:'];

// Named character references that can smuggle characters into a URL scheme
// (letters for the scheme itself can be smuggled via numeric refs).
const NAMED_ENTITIES = {
  tab: '\t',
  newline: '\n',
  nbsp: '\u00a0',
  colon: ':',
  lpar: '(',
  rpar: ')',
  sol: '/',
  quest: '?',
  num: '#',
  dollar: '$',
  comma: ',',
  period: '.',
  excl: '!',
  plus: '+',
  equals: '=',
  lsqb: '[',
  rsqb: ']',
  lcub: '{',
  rcub: '}',
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
};

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => htmlEscapeMap[ch]);
}

export function unescapeHtml(value) {
  return String(value).replace(/&amp;|&lt;|&gt;|&quot;|&#x27;/g, (entity) => {
    switch (entity) {
      case '&amp;':
        return '&';
      case '&lt;':
        return '<';
      case '&gt;':
        return '>';
      case '&quot;':
        return '"';
      default:
        return "'";
    }
  });
}

function decodeCharacterReferences(value) {
  return value.replace(
    /&(?:#(\d{1,7})|#x([0-9a-f]{1,6})|([a-z][a-z0-9]{1,31}));/gi,
    (match, dec, hex, named) => {
      if (named) {
        const decoded = NAMED_ENTITIES[named.toLowerCase()];
        return decoded !== undefined ? decoded : match;
      }
      const codePoint = dec !== undefined ? Number(dec) : Number.parseInt(hex, 16);
      if (!Number.isInteger(codePoint) || codePoint <= 0 || codePoint > 0x10ffff) {
        return match;
      }
      return String.fromCodePoint(codePoint);
    },
  );
}

/**
 * Return the URL with all entity/character references decoded and any control
 * or whitespace characters (which browsers tolerate inside schemes) stripped.
 * Used only for validating the scheme; the original value is re-escaped on
 * output, never the normalized form.
 */
function normalizeUrlForInspection(rawUrl) {
  const decoded = decodeCharacterReferences(String(rawUrl));
  let normalized = '';
  for (const char of decoded) {
    const code = char.codePointAt(0);
    if (code > 0x20 && code !== 0x7f && (code < 0x80 || code > 0x9f)) {
      normalized += char;
    }
  }
  return normalized;
}

/**
 * Block schemes that can execute script when a link is followed or an image is
 * loaded: javascript:, data:, vbscript:. Handles case variants, embedded
 * whitespace/control characters, decimal/hex character references, and named
 * references (e.g. `jav&#x61;script:`, `java\nscript:`, `javascript&colon;`).
 *
 * Returns a safe replacement value when the scheme is blocked and the
 * (unescaped) original URL otherwise. Callers escape the returned value
 * before embedding it in an attribute.
 */
export function sanitizeUrl(rawUrl) {
  const normalized = normalizeUrlForInspection(rawUrl);
  const schemeMatch = /^[a-z][a-z0-9+.-]*:/i.exec(normalized);
  if (!schemeMatch) return String(rawUrl);
  const scheme = schemeMatch[0].toLowerCase();
  if (BLOCKED_URL_SCHEMES.includes(scheme)) return '#';
  return String(rawUrl);
}