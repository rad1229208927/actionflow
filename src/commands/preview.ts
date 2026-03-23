import chalk from 'chalk';
import * as fs from 'fs-extra';
import { load } from 'js-yaml';
import { generateWorkflowHTML } from '../utils/html-preview.js';

interface PreviewOptions {
  output?: string;
  open?: boolean;
}

/**
 * Preview workflow visually
 */
export async function previewWorkflow(file: string, options?: PreviewOptions): Promise<void> {
  console.log(chalk.cyan('\n👀 预览工作流\n'));
  
  try {
    // Read workflow file
    const content = await fs.readFile(file, 'utf-8');
    const workflow = load(content);
    
    // Generate HTML
    const html = generateWorkflowHTML(workflow);
    
    // Output
    if (options?.output) {
      await fs.writeFile(options.output, html);
      console.log(chalk.green(`✅ HTML 已保存到：${options.output}`));
    } else {
      // Save to temp file
      const tempFile = `/tmp/actionflow-preview-${Date.now()}.html`;
      await fs.writeFile(tempFile, html);
      console.log(chalk.green(`✅ 预览文件：${tempFile}`));
      console.log(chalk.cyan(`   在浏览器中打开查看可视化效果\n`));
      
      if (options?.open) {
        const { exec } = await import('child_process');
        exec(`open ${tempFile}`);
      }
    }
    
    // Display summary
    console.log(chalk.white('工作流概览:'));
    console.log(chalk.gray(`  名称：${workflow.name}`));
    console.log(chalk.gray(`  Jobs: ${Object.keys(workflow.jobs || {}).length}`));
    console.log(chalk.gray(`  触发：${Object.keys(workflow.on || {}).join(', ')}\n`));
    
  } catch (error: any) {
    console.log(chalk.red(`❌ 错误：${error.message}`));
  }
}
