#!/usr/bin/env node

import chalk from 'chalk';
import DocumentConverter from './index.js';
import fs from 'fs/promises';
import { existsSync, createReadStream } from 'fs';
import path from 'path';

const converter = new DocumentConverter();

async function readStdin() {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf-8');
    process.stdin.on('data', chunk => data += chunk);
    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', reject);
  });
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }
  
  if (args.includes('--version') || args.includes('-v')) {
    const pkg = JSON.parse(await fs.readFile(new URL('../package.json', import.meta.url), 'utf-8'));
    console.log(`doc-converter v${pkg.version}`);
    return;
  }

  // Parse arguments
  let isBatch = false;
  let batchDir = null;
  let outputDir = null;
  let force = false;
  let continueOnError = false;
  let format = null;
  let positionalArgs = [];
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--batch') {
      isBatch = true;
      batchDir = args[++i];
    } else if (arg === '--output-dir') {
      outputDir = args[++i];
    } else if (arg === '--format' || arg === '-f') {
      const nextArg = args[i+1];
      if (nextArg && !nextArg.startsWith('-')) {
        format = nextArg;
        i++;
      } else {
        // If -f is used without format, treat as force.
        force = true;
      }
    } else if (arg === '--force') {
      force = true;
    } else if (arg === '--continue-on-error') {
      continueOnError = true;
    } else if (arg === '-o') {
      positionalArgs[1] = args[++i]; // Map -o to output file/destination
    } else {
      positionalArgs.push(arg);
    }
  }
  
  if (isBatch) {
    if (!batchDir) {
      console.error(chalk.red('Error: --batch requires a directory'));
      process.exit(1);
    }
    if (!outputDir) {
      console.error(chalk.red('Error: --output-dir is required for batch conversion'));
      process.exit(1);
    }
    
    try {
      await fs.access(batchDir);
    } catch (e) {
      console.error(chalk.red(`Error: Batch directory ${batchDir} does not exist`));
      process.exit(1);
    }
    
    try {
      await fs.mkdir(outputDir, { recursive: true });
    } catch (e) {
      console.error(chalk.red(`Error: Could not create output directory ${outputDir}`));
      process.exit(1);
    }
    
    let files = [];
    try {
      const allFiles = await fs.readdir(batchDir);
      files = allFiles.filter(f => f.endsWith('.md') || f.endsWith('.html') || f.endsWith('.txt')); // simple supported filter
    } catch (e) {
      console.error(chalk.red(`Error: Could not read batch directory ${batchDir}`));
      process.exit(1);
    }
    
    if (files.length === 0) {
      console.log(chalk.yellow('No supported files found in batch directory.'));
      return;
    }
    
    let hasError = false;
    for (const file of files) {
      const inputPath = path.join(batchDir, file);
      // Determine format: either passed explicitly or use html as default if we don't know? 
      // The old logic was: format = outputFormat || (outputFile ? outputFile.split('.').pop() : 'html');
      // For batch, let's use explicit format or default 'html'
      const targetFormat = format || 'html';
      const ext = `.${targetFormat}`;
      const outputFile = path.join(outputDir, path.basename(file, path.extname(file)) + ext);
      
      try {
        if (!force && existsSync(outputFile)) {
          console.warn(chalk.yellow(`Skipped ${file}: Output file ${outputFile} already exists. Use --force to overwrite.`));
          hasError = true;
          if (!continueOnError) {
            process.exit(1);
          }
          continue;
        }
        
        const input = await fs.readFile(inputPath, 'utf-8');
        const result = await converter.convert(input, targetFormat);
        await fs.writeFile(outputFile, typeof result === 'string' ? result : JSON.stringify(result, null, 2));
        console.log(chalk.green(`✓ Converted ${file} -> ${outputFile}`));
      } catch (err) {
        console.error(chalk.red(`Error converting ${file}: ${err.message}`));
        hasError = true;
        if (!continueOnError) {
          process.exit(1);
        }
      }
    }
    
    if (hasError) {
      process.exit(1);
    }
    return;
  }

  // Single file or stdin mode
  const inputFile = positionalArgs[0];
  const outputFile = positionalArgs[1];
  
  if (!inputFile) {
    console.error(chalk.red('Error: Input file required'));
    showHelp();
    process.exit(1);
  }
  
  try {
    let input;
    if (inputFile === '-') {
      input = await readStdin();
    } else {
      input = await fs.readFile(inputFile, 'utf-8');
    }
    
    const targetFormat = format || (outputFile && outputFile !== '-' ? outputFile.split('.').pop() : 'html');
    
    if (inputFile !== '-') {
      console.error(chalk.blue(`Converting ${inputFile} to ${targetFormat}...`)); // log to stderr so it doesn't pollute stdout when piping
    }
    
    const result = await converter.convert(input, targetFormat);
    const outputContent = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
    
    if (outputFile && outputFile !== '-') {
      if (!force && existsSync(outputFile)) {
        console.error(chalk.red(`Error: Output file ${outputFile} already exists. Use --force to overwrite.`));
        process.exit(1);
      }
      await fs.writeFile(outputFile, outputContent);
      console.error(chalk.green(`✓ Output written to ${outputFile}`));
    } else {
      process.stdout.write(outputContent);
    }
  } catch (err) {
    console.error(chalk.red(`Error: ${err.message}`));
    process.exit(1);
  }
}

function showHelp() {
  console.log(`
${chalk.cyan('DocConverter')} - Document Format Converter

${chalk.yellow('Usage:')}
  doc-convert <input> [output] [options]
  doc-convert --batch <dir> --output-dir <out> [options]

${chalk.yellow('Options:')}
  --format, -f     Output format (html, pdf, md)
  --force, -f      Overwrite output files if they exist
  --batch          Process all supported files in a directory
  --output-dir     Destination directory for batch conversion
  --continue-on-error Continue batch processing even if some files fail
  -o               Specify output file or - for stdout
  --help, -h       Show this help message
  --version, -v    Show version

${chalk.yellow('Examples:')}
  doc-convert input.md output.html
  doc-convert readme.md --format pdf
  cat input.md | doc-convert - -f html
  doc-convert --batch ./docs --output-dir ./dist -f html
  `);
}

main();
