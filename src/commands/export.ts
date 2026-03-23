import chalk from 'chalk';
import * as fs from 'fs-extra';

interface ExportOptions {
  output?: string;
}

/**
 * Export workflow to YAML file
 */
export async function exportWorkflow(file?: string, options?: ExportOptions): Promise<void> {
  console.log(chalk.cyan('\n💾 Exporting workflow...\n'));
  
  // For now, just copy to output if specified
  if (file && options?.output) {
    await fs.copy(file, options.output);
    console.log(chalk.green(`✅ Exported to ${options.output}`));
  } else if (file) {
    const content = await fs.readFile(file, 'utf-8');
    console.log(chalk.white(content));
  } else {
    console.log(chalk.yellow('Please specify a workflow file to export.'));
  }
}
