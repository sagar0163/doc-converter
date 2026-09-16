import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);
const CLI_PATH = `"${path.resolve(__dirname, '../src/cli.js')}"`;
const TEST_DIR = path.resolve(__dirname, 'cli-test-data');
const TEST_DIR_Q = `"${TEST_DIR}"`;

describe('CLI Integration Tests', () => {
  beforeAll(async () => {
    await fs.mkdir(TEST_DIR, { recursive: true });
    await fs.writeFile(path.join(TEST_DIR, 'test1.md'), '# Hello World');
    await fs.writeFile(path.join(TEST_DIR, 'test2.md'), '## Second File');
  });

  afterAll(async () => {
    await fs.rm(TEST_DIR, { recursive: true, force: true });
  });

  it('batch success: converts all files in directory', async () => {
    const outDir = path.join(TEST_DIR, 'out-batch');
    const outDirQ = `"${outDir}"`;
    const { stdout } = await execAsync(`node ${CLI_PATH} --batch ${TEST_DIR_Q} --output-dir ${outDirQ} -f html`);
    
    const files = await fs.readdir(outDir);
    expect(files).toContain('test1.html');
    expect(files).toContain('test2.html');
    expect(stdout).toMatch(/Converted test1.md/);
    expect(stdout).toMatch(/Converted test2.md/);
  });

  it('no-overwrite guard: fails if file exists without force', async () => {
    const outDir = path.join(TEST_DIR, 'out-overwrite');
    const outDirQ = `"${outDir}"`;
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(path.join(outDir, 'test1.html'), 'existing');
    
    try {
      await execAsync(`node ${CLI_PATH} --batch ${TEST_DIR_Q} --output-dir ${outDirQ} -f html`);
      expect.fail('Should have thrown an error');
    } catch (err) {
      expect(err.code).toBe(1);
    }
  });

  it('force flag: overwrites if file exists', async () => {
    const outDir = path.join(TEST_DIR, 'out-force');
    const outDirQ = `"${outDir}"`;
    await fs.mkdir(outDir, { recursive: true });
    await fs.writeFile(path.join(outDir, 'test1.html'), 'existing');
    
    const { stdout } = await execAsync(`node ${CLI_PATH} --batch ${TEST_DIR_Q} --output-dir ${outDirQ} --force -f html`);
    const files = await fs.readdir(outDir);
    expect(files).toContain('test1.html');
    
    const content = await fs.readFile(path.join(outDir, 'test1.html'), 'utf-8');
    expect(content).not.toBe('existing');
  });

  it('stdin/stdout: supports - for stdin and stdout', async () => {
    const { stdout } = await execAsync(`echo "# Title" | node ${CLI_PATH} - -f html`);
    expect(stdout).toContain('<h1>Title</h1>');
  });
});
