#!/usr/bin/env node

import chalk from 'chalk';
import DocumentConverter from './index.js';
import { readFile, writeFile, readdir, stat, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, basename, dirname } from 'node:path';

const args = process.argv.slice(2);
const converter = new DocumentConverter();

function parseArgs(argv) {
  const options = {
    batch: null,
    outputDir: null,
    continueOnError: false,
    recursive: false,
    format: null,
    force: false,
    help: false,
    version: false,
    positional: []
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') options.help = true;
    else if (arg === '--version' || arg === '-v') options.version = true;
    else if (arg === '--continue-on-error') options.continueOnError = true;
    else if (arg === '--recursive') options.recursive = true;
    else if (arg === '--force') options.force = true;
    else if (arg === '--batch') options.batch = argv[++i];
    else if (arg === '--output-dir') options.outputDir = argv[++i];
    else if (arg === '--format' || arg === '-f') options.format = argv[++i];
    else options.positional.push(arg);
  }
  
  return options;
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function processFile(inputFile, outputFile, format, options) {
  const isDocx = inputFile.endsWith('.docx') && inputFile !== '-';
  const isStdin = inputFile === '-';
  const isStdout = outputFile === '-' || !outputFile;

  if (outputFile && !isStdout && !options.force && existsSync(outputFile)) {
    throw new Error(`Output file already exists: ${outputFile}. Use --force to overwrite.`);
  }

  const input = isStdin 
    ? await readStdin() 
    : (isDocx ? await readFile(inputFile) : await readFile(inputFile, 'utf-8'));
    
  const parsedInput = isStdin && format !== 'docx' ? input.toString('utf-8') : input;

  const result = await converter.convert(parsedInput, format);

  if (typeof result !== 'string' && !Buffer.isBuffer(result)) {
    throw new Error(`Unexpected conversion result for ${format}: expected string or Buffer, got ${typeof result}`);
  }

  if (isStdout) {
    process.stdout.write(result);
  } else {
    await mkdir(dirname(outputFile), { recursive: true });
    await writeFile(outputFile, result);
    if (!options.batch) {
      console.log(chalk.green(`✓ Output written to ${outputFile}`));
    }
  }
}

async function findFiles(dir, recursive) {
  let results = [];
  const list = await readdir(dir);
  for (const file of list) {
    const filePath = join(dir, file);
    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) {
      if (recursive) {
        results = results.concat(await findFiles(filePath, recursive));
      }
    } else {
      if (['.md', '.html', '.docx'].includes(extname(filePath))) {
        results.push(filePath);
      }
    }
  }
  return results;
}

async function main() {
  const options = parseArgs(args);

  if (args.length === 0 || options.help) {
    showHelp();
    return;
  }

  if (options.version) {
    const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf-8'));
    console.log(`doc-converter v${pkg.version}`);
    return;
  }

  if (options.batch) {
    if (!options.outputDir) {
      console.error(chalk.red('Error: --output-dir is required when using --batch'));
      process.exit(1);
    }
    
    if (!options.format) {
      console.error(chalk.red('Error: --format is required when using --batch'));
      process.exit(1);
    }
    
    if (!existsSync(options.batch)) {
      console.error(chalk.red(`Error: Batch directory not found: ${options.batch}`));
      process.exit(1);
    }

    try {
      const files = await findFiles(options.batch, options.recursive);
      let hasError = false;
      
      for (const file of files) {
        try {
          const relativePath = file.substring(options.batch.length).replace(/^[/\\]/, '');
          const outputExt = options.format === 'pdf' ? '.pdf' : (options.format === 'html' ? '.html' : '.md');
          const outputFileName = basename(file, extname(file)) + outputExt;
          const outPath = join(options.outputDir, dirname(relativePath), outputFileName);
          
          await processFile(file, outPath, options.format, options);
          console.log(chalk.green(`✓ Converted ${file} -> ${outPath}`));
        } catch (err) {
          console.error(chalk.red(`Error processing ${file}: ${err.message}`));
          hasError = true;
          if (!options.continueOnError) {
            process.exit(1);
          }
        }
      }
      
      if (hasError) {
        process.exit(1);
      }
      return;
    } catch (err) {
      console.error(chalk.red(`Batch Error: ${err.message}`));
      process.exit(1);
    }
  }

  const inputFile = options.positional[0];
  const outputFile = options.positional[1];
  
  if (!inputFile) {
    console.error(chalk.red('Error: Input file required'));
    showHelp();
    process.exit(1);
  }

  if (inputFile !== '-' && !existsSync(inputFile)) {
    console.error(chalk.red(`Error: Input file not found: ${inputFile}`));
    process.exit(1);
  }

  try {
    const format = options.format || (outputFile && outputFile !== '-' ? outputFile.split('.').pop() : 'html');
    
    if (inputFile !== '-' && outputFile !== '-') {
      console.log(chalk.blue(`Converting ${inputFile} to ${format}...`));
    }

    await processFile(inputFile, outputFile, format, options);
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

${chalk.yellow('Options:')}
  --format, -f     Output format (html, pdf, md)
  --force           Overwrite existing output file
  --batch <dir>    Batch convert files in directory
  --output-dir <d> Output directory for batch conversion
  --recursive      Recursively search for files in batch mode
  --continue-on-error Continue batch conversion on error
  --help, -h       Show this help message
  --version, -v    Show version

${chalk.yellow('Examples:')}
  doc-convert input.md output.html
  doc-convert readme.md --format pdf
  doc-convert document.docx output.md
  doc-convert - -f html < in.md > out.html
  doc-convert --batch ./docs --output-dir ./dist --format pdf
  `);
}

main();
