/**
 * DOCX to Markdown converter
 * Uses the mammoth library.
 */

import mammoth from 'mammoth';

export async function convertDocxToMarkdown(docxBuffer, options = {}) {
  const input =
    typeof docxBuffer === 'string' || Buffer.isBuffer(docxBuffer)
      ? { buffer: Buffer.isBuffer(docxBuffer) ? docxBuffer : Buffer.from(docxBuffer, 'base64') }
      : { buffer: docxBuffer };

  const result = await mammoth.convertToMarkdown(input, options);
  return result.value;
}