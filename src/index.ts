#!/usr/bin/env node

/**
 * ActionFlow - GitHub Actions Visual Builder
 * 
 * CI/CD without the YAML pain
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { initWorkflow } from './commands/init.js';
import { editWorkflow } from './commands/edit.js';
import { validateWorkflow } from './commands/validate.js';
import { listTemplates } from './commands/templates.js';
import { suggestWorkflow } from './commands/suggest.js';
import { exportWorkflow } from './commands/export.js';

const program = new Command();

program
  .name('actionflow')
  .description(chalk.cyan('🔄 GitHub Actions Visual Builder - CI/CD without the YAML pain'))
  .version('0.1.0');

// Init command
program
  .command('init')
  .description('📝 Initialize a new workflow')
  .argument('<name>', 'Workflow name')
  .option('-t, --template <template>', 'Use a template')
  .option('-o, --output <file>', 'Output file', '.github/workflows/workflow.yml')
  .action(async (name, options) => {
    try {
      await initWorkflow(name, options);
    } catch (error) {
      console.error(chalk.red(`❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

// Edit command
program
  .command('edit')
  .description('✏️  Edit workflow visually')
  .argument('[file]', 'Workflow file to edit')
  .action(async (file) => {
    try {
      await editWorkflow(file);
    } catch (error) {
      console.error(chalk.red(`❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

// Validate command
program
  .command('validate')
  .description('✅ Validate workflow syntax')
  .argument('<file>', 'Workflow file to validate')
  .action(async (file) => {
    try {
      await validateWorkflow(file);
    } catch (error) {
      console.error(chalk.red(`❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

// Templates command
program
  .command('templates')
  .description('📦 List available templates')
  .option('-c, --category <category>', 'Filter by category')
  .option('-s, --search <query>', 'Search templates')
  .action(async (options) => {
    try {
      await listTemplates(options);
    } catch (error) {
      console.error(chalk.red(`❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

// Suggest command
program
  .command('suggest')
  .description('💡 Get workflow suggestions based on project')
  .action(async () => {
    try {
      await suggestWorkflow();
    } catch (error) {
      console.error(chalk.red(`❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

// Export command
program
  .command('export')
  .description('💾 Export workflow to YAML')
  .argument('[file]', 'Workflow file')
  .option('-o, --output <file>', 'Output file')
  .action(async (file, options) => {
    try {
      await exportWorkflow(file, options);
    } catch (error) {
      console.error(chalk.red(`❌ Error: ${error.message}`));
      process.exit(1);
    }
  });

// Parse and run
await program.parseAsync(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp((text) => {
    return chalk.white(text)
      .replace(/(Usage:)/, chalk.cyan('$1'))
      .replace(/(Commands:)/, chalk.cyan('$1'))
      .replace(/(Options:)/, chalk.cyan('$1'))
      .replace(/(actionflow)/, chalk.green('$1'));
  });
}
