import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execFile, exec } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, writeFile, readFile, rm, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const execFileP = promisify(execFile);
const execP = promisify(exec);
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

describe('CLI new features', () => {
  let dir;

  beforeAll(async () => {
    dir = await mkdtemp(join(tmpdir(), 'doc-conv-new-'));
    await writeFile(join(dir, 'in.md'), '# Hello\n');
    await writeFile(join(dir, 'existing.html'), '<p>Old</p>');
    await mkdir(join(dir, 'batch-in'));
    await writeFile(join(dir, 'batch-in', '1.md'), '# One\n');
    await writeFile(join(dir, 'batch-in', '2.md'), '# Two\n');
    await mkdir(join(dir, 'batch-out'));
    await mkdir(join(dir, 'batch-err-in'));
    await writeFile(join(dir, 'batch-err-in', '3.md'), '# Three\n');
    await writeFile(join(dir, 'batch-err-in', '4.docx'), await DOCX_FIXTURE());
    await mkdir(join(dir, 'batch-err-out'));
  });

  afterAll(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('fails to overwrite without --force', async () => {
    await expect(
      execFileP(process.execPath, [CLI, join(dir, 'in.md'), join(dir, 'existing.html')])
    ).rejects.toThrow();
  });

  it('overwrites with --force', async () => {
    await execFileP(process.execPath, [CLI, join(dir, 'in.md'), join(dir, 'existing.html'), '--force']);
    const html = await readFile(join(dir, 'existing.html'), 'utf-8');
    expect(html).toContain('<h1>Hello</h1>');
  });

  it('supports stdin to stdout', async () => {
    const { stdout } = await execP(`echo "# Hello Stdin" | node src/cli.js - -f html`, {
      cwd: join(CLI, '../..')
    });
    expect(stdout).toContain('<h1>Hello Stdin</h1>');
  });

  it('supports batch conversion', async () => {
    await execFileP(process.execPath, [
      CLI, '--batch', join(dir, 'batch-in'), '--output-dir', join(dir, 'batch-out'), '--format', 'html'
    ]);
    const out1 = await readFile(join(dir, 'batch-out', '1.html'), 'utf-8');
    expect(out1).toContain('<h1>One</h1>');
    const out2 = await readFile(join(dir, 'batch-out', '2.html'), 'utf-8');
    expect(out2).toContain('<h1>Two</h1>');
  });

  it('batch partial failure exit codes', async () => {
    // 4.docx fails because docx -> html is not supported
    await expect(
      execFileP(process.execPath, [
        CLI, '--batch', join(dir, 'batch-err-in'), '--output-dir', join(dir, 'batch-err-out'), '--format', 'html'
      ])
    ).rejects.toThrow();

    // With continue on error
    await expect(
      execFileP(process.execPath, [
        CLI, '--batch', join(dir, 'batch-err-in'), '--output-dir', join(dir, 'batch-err-out'), '--format', 'html', '--continue-on-error'
      ])
    ).rejects.toThrow(); // Should still exit with 1 at the end, but process others
    
    // Check if 3.md was processed due to continue-on-error
    const out3 = await readFile(join(dir, 'batch-err-out', '3.html'), 'utf-8');
    expect(out3).toContain('<h1>Three</h1>');
  });
});
