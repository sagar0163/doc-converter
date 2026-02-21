#!/usr/bin/env node

import chalk from 'chalk';
import DocumentConverter from './index.js';
import fs from 'fs';

const args = process.argv.slice(2);
const converter = new DocumentConverter();

async function main() {
  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    showHelp();
    return;
  }
  
  if (args.includes('--version') || args.includes('-v')) {
    const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf-8'));
    console.log(`doc-converter v${pkg.version}`);
    return;
  }

  const inputFile = args[0];
  const outputFile = args[1];
  const formatIndex = args.indexOf('--format');
  const outputFormat = formatIndex !== -1 ? args[formatIndex + 1] : null;
  
  if (!inputFile) {
    console.error(chalk.red('Error: Input file required'));
    showHelp();
    process.exit(1);
  }
  
  try {
    const input = fs.readFileSync(inputFile, 'utf-8');
    const format = outputFormat || (outputFile ? outputFile.split('.').pop() : 'html');
    
    console.log(chalk.blue(`Converting ${inputFile} to ${format}...`));
    
    const result = await converter.convert(input, format);
    
    if (outputFile) {
      fs.writeFileSync(outputFile, typeof result === 'string' ? result : JSON.stringify(result, null, 2));
      console.log(chalk.green(`✓ Output written to ${outputFile}`));
    } else {
      console.log(result);
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

${chalk.yellow('Options:')}
  --format, -f     Output format (html, pdf, md)
  --help, -h       Show this help message
  --version, -v    Show version

${chalk.yellow('Examples:')}
  doc-convert input.md output.html
  doc-convert readme.md --format pdf
  `);
}

main();
