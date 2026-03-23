import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * Detect project type and suggest workflows
 */
export async function suggestWorkflow(): Promise<void> {
  console.log(chalk.cyan('\n💡 Analyzing project...\n'));
  
  const suggestions: Array<{ name: string; template: string; reason: string }> = [];
  
  // Detect project type
  const hasPackageJson = await fs.pathExists('package.json');
  const hasRequirementsTxt = await fs.pathExists('requirements.txt');
  const hasDockerfile = await fs.pathExists('Dockerfile');
  const hasGithubDir = await fs.pathExists('.github');
  
  if (hasPackageJson) {
    const pkg = JSON.parse(await fs.readFile('package.json', 'utf-8'));
    
    if (pkg.scripts?.test) {
      suggestions.push({
        name: 'Node.js CI',
        template: 'nodejs-ci',
        reason: 'Detected Node.js project with test script'
      });
    }
    
    if (pkg.scripts?.build) {
      suggestions.push({
        name: 'Build & Deploy',
        template: 'vercel-deploy',
        reason: 'Detected build script, likely a frontend project'
      });
    }
  }
  
  if (hasRequirementsTxt) {
    suggestions.push({
      name: 'Python CI',
      template: 'python-ci',
      reason: 'Detected Python project (requirements.txt)'
    });
  }
  
  if (hasDockerfile) {
    suggestions.push({
      name: 'Docker Build',
      template: 'docker-build-push',
      reason: 'Detected Dockerfile'
    });
  }
  
  if (!hasGithubDir) {
    suggestions.push({
      name: 'GitHub Actions Setup',
      template: 'nodejs-ci',
      reason: 'No .github directory found, good time to start!'
    });
  }
  
  // Display suggestions
  if (suggestions.length === 0) {
    console.log(chalk.yellow('No specific suggestions for this project.'));
    console.log(chalk.white('\nRun "actionflow templates" to see all available templates.'));
    return;
  }
  
  console.log(chalk.green('Recommended workflows:\n'));
  
  suggestions.forEach((s, i) => {
    console.log(chalk.white(`${i + 1}. ${chalk.cyan(s.name)}`));
    console.log(chalk.gray(`   ${s.reason}`));
    console.log(chalk.gray(`   Template: ${s.template}`));
    console.log(chalk.yellow(`   → actionflow init ${s.name.toLowerCase().replace(/ /g, '-')} --template ${s.template}`));
    console.log();
  });
}
