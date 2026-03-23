import chalk from 'chalk';
import { getTemplates, getCategories, searchTemplates } from '../templates/index.js';

interface TemplateOptions {
  category?: string;
  search?: string;
}

/**
 * List available templates
 */
export async function listTemplates(options: TemplateOptions): Promise<void> {
  console.log(chalk.cyan('\n📦 Available Templates\n'));
  
  let templates = getTemplates();
  
  // Filter by category
  if (options.category) {
    templates = templates.filter(t => t.category === options.category);
  }
  
  // Search
  if (options.search) {
    templates = searchTemplates(options.search);
  }
  
  if (templates.length === 0) {
    console.log(chalk.yellow('No templates found.'));
    return;
  }
  
  // Group by category
  const byCategory = templates.reduce((acc, t) => {
    if (!acc[t.category]) acc[t.category] = [];
    acc[t.category].push(t);
    return acc;
  }, {} as Record<string, typeof templates>);
  
  // Display
  for (const [category, categoryTemplates] of Object.entries(byCategory)) {
    console.log(chalk.green(`\n${category.toUpperCase()}`));
    console.log(chalk.gray('─'.repeat(50)));
    
    for (const template of categoryTemplates) {
      console.log(chalk.white(`  ${template.id}`));
      console.log(chalk.gray(`    ${template.description}`));
      console.log(chalk.gray(`    Tags: ${template.tags?.join(', ') || 'none'}`));
      console.log();
    }
  }
  
  console.log(chalk.yellow('\n💡 Usage:'));
  console.log(chalk.white('   actionflow init <name> --template <template-id>'));
  console.log(chalk.white('   actionflow templates --category ci-cd'));
  console.log(chalk.white('   actionflow templates --search node'));
  console.log();
}
