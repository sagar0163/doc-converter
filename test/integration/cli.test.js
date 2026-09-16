import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const execFileP = promisify(execFile);
const CLI = fileURLToPath(new URL('../../src/cli.js', import.meta.url));
const DOCX_FIXTURE = () =>
  readFile(fileURLToPath(new URL('../fixtures/minimal.docx', import.meta.url)));

describe('CLI round-trip conversions', () => {
  let dir;

  beforeAll(async () => {
    dir = await mkdtemp(join(tmpdir(), 'doc-conv-'));
    await writeFile(join(dir, 'in.md'), '# Hello\n\nThis is **bold** text.\n');
    await writeFile(join(dir, 'in.html'), '<h1>Html Title</h1><p>Direct html.</p>');
    await writeFile(join(dir, 'in.docx'), await DOCX_FIXTURE());
  });

  afterAll(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('md -> pdf writes a real PDF file, not JSON', async () => {
    await execFileP(process.execPath, [CLI, join(dir, 'in.md'), join(dir, 'out.pdf')]);
    const pdf = await readFile(join(dir, 'out.pdf'));
    expect(pdf.slice(0, 5).toString('ascii')).toBe('%PDF-');
    expect(pdf.toString('utf-8')).not.toContain('"message"');
  });

  it('html -> pdf writes a real PDF file, not JSON', async () => {
    await execFileP(process.execPath, [CLI, join(dir, 'in.html'), join(dir, 'out2.pdf')]);
    const pdf = await readFile(join(dir, 'out2.pdf'));
    expect(pdf.slice(0, 5).toString('ascii')).toBe('%PDF-');
  });

  it('docx -> md writes real markdown, not JSON', async () => {
    await execFileP(process.execPath, [CLI, join(dir, 'in.docx'), join(dir, 'out.md')]);
    const md = await readFile(join(dir, 'out.md'), 'utf-8');
    expect(md).toContain('# Docx Fixture Title');
    expect(md).not.toContain('"message"');
  });

  it('unsupported pair (docx -> html) fails with a clear error', async () => {
    await expect(
      execFileP(process.execPath, [CLI, join(dir, 'in.docx'), '--format', 'html']),
    ).rejects.toThrow(/Unsupported conversion: docx -> html/);
  });
});