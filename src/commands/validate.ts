import chalk from 'chalk';
import ora from 'ora';
import * as fs from 'fs-extra';
import { load } from 'js-yaml';

/**
 * Validate workflow syntax
 */
export async function validateWorkflow(file: string): Promise<void> {
  const spinner = ora('Validating workflow...').start();
  
  try {
    // Check file exists
    if (!await fs.pathExists(file)) {
      spinner.stop();
      console.log(chalk.red(`❌ File not found: ${file}`));
      return;
    }
    
    // Read and parse YAML
    const content = await fs.readFile(file, 'utf-8');
    const workflow = load(content);
    
    // Basic validation
    const errors: string[] = [];
    
    if (!workflow.name) {
      errors.push('Missing required field: name');
    }
    
    if (!workflow.on) {
      errors.push('Missing required field: on (triggers)');
    }
    
    if (!workflow.jobs || Object.keys(workflow.jobs).length === 0) {
      errors.push('Missing required field: jobs');
    } else {
      // Validate jobs
      for (const [jobName, job] of Object.entries(workflow.jobs as any)) {
        if (!job.runsOn) {
          errors.push(`Job "${jobName}": missing runs-on`);
        }
        if (!job.steps || job.steps.length === 0) {
          errors.push(`Job "${jobName}": missing steps`);
        }
      }
    }
    
    spinner.stop();
    
    if (errors.length > 0) {
      console.log(chalk.red('❌ Validation failed:\n'));
      errors.forEach(err => console.log(chalk.yellow(`  • ${err}`)));
      process.exit(1);
    } else {
      console.log(chalk.green('✅ Workflow is valid!'));
      console.log(chalk.cyan(`   Name: ${workflow.name}`));
      console.log(chalk.cyan(`   Jobs: ${Object.keys(workflow.jobs).join(', ')}`));
    }
    
  } catch (error: any) {
    spinner.stop();
    console.log(chalk.red(`❌ Validation error: ${error.message}`));
    process.exit(1);
  }
}
