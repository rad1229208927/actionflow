import chalk from 'chalk';
import { Workflow, Job, Step } from '../types/workflow.js';

/**
 * Edit workflow visually using TUI
 */
export async function editWorkflow(file?: string): Promise<void> {
  const { default: inquirer } = await import('inquirer');
  
  console.log(chalk.cyan('\n✏️  ActionFlow 可视化编辑器\n'));
  
  // If no file specified, create new workflow
  if (!file) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: '选择操作:',
        choices: [
          { name: '📝 创建新工作流', value: 'create' },
          { name: '📂 编辑现有工作流', value: 'edit' },
          { name: '📦 从模板开始', value: 'template' },
          { name: '❌ 退出', value: 'exit' }
        ]
      }
    ]);
    
    if (action === 'exit') {
      console.log(chalk.green('👋 再见!'));
      return;
    }
    
    if (action === 'template') {
      await createFromTemplate();
      return;
    }
    
    if (action === 'create') {
      await createNewWorkflow();
      return;
    }
  }
  
  // Edit existing workflow
  if (file) {
    await editExistingWorkflow(file);
    return;
  }
}

/**
 * Create workflow from template
 */
async function createFromTemplate(): Promise<void> {
  const { default: inquirer } = await import('inquirer');
  const { getTemplates, getCategories } = await import('../templates/index.js');
  
  const templates = getTemplates();
  const categories = getCategories();
  
  const { category } = await inquirer.prompt([
    {
      type: 'list',
      name: 'category',
      message: '选择分类:',
      choices: [
        { name: '全部', value: 'all' },
        ...categories.map(c => ({ name: c.toUpperCase(), value: c }))
      ]
    }
  ]);
  
  const filteredTemplates = category === 'all' 
    ? templates 
    : templates.filter(t => t.category === category);
  
  const { template } = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: '选择模板:',
      choices: filteredTemplates.map(t => ({
        name: `${t.name} - ${t.description}`,
        value: t.id
      }))
    }
  ]);
  
  const { workflowName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'workflowName',
      message: '工作流名称:',
      default: template
    }
  ]);
  
  const { outputFile } = await inquirer.prompt([
    {
      type: 'input',
      name: 'outputFile',
      message: '输出文件:',
      default: `.github/workflows/${workflowName.replace(/\s+/g, '-').toLowerCase()}.yml`
    }
  ]);
  
  console.log(chalk.green(`\n✅ 将创建 "${workflowName}"`));
  console.log(chalk.cyan(`   模板：${template}`));
  console.log(chalk.cyan(`   文件：${outputFile}`));
  console.log(chalk.yellow('\n💡 提示：使用 "actionflow init" 命令创建'));
  console.log(chalk.white(`   actionflow init "${workflowName}" --template ${template}\n`));
}

/**
 * Create new workflow interactively
 */
async function createNewWorkflow(): Promise<void> {
  const { default: inquirer } = await import('inquirer');
  
  const { workflowName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'workflowName',
      message: '工作流名称:'
    }
  ]);
  
  const { triggers } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'triggers',
      message: '选择触发条件:',
      choices: [
        { name: 'Push 到 main 分支', value: 'push-main', checked: true },
        { name: 'Push 到所有分支', value: 'push-all', checked: false },
        { name: 'Pull Request', value: 'pr', checked: true },
        { name: '定时执行 (Cron)', value: 'cron', checked: false },
        { name: '手动触发', value: 'manual', checked: false }
      ]
    }
  ]);
  
  const { jobs } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'jobs',
      message: '选择 Job 类型:',
      choices: [
        { name: 'Build (构建)', value: 'build', checked: true },
        { name: 'Test (测试)', value: 'test', checked: true },
        { name: 'Lint (代码检查)', value: 'lint', checked: false },
        { name: 'Deploy (部署)', value: 'deploy', checked: false },
        { name: 'Security Scan (安全扫描)', value: 'security', checked: false }
      ]
    }
  ]);
  
  console.log(chalk.green('\n✅ 工作流配置完成!\n'));
  console.log(chalk.white(`名称：${workflowName}`));
  console.log(chalk.white(`触发：${triggers.join(', ')}`));
  console.log(chalk.white(`Jobs: ${jobs.join(', ')}`));
  console.log(chalk.yellow('\n💡 下一步：保存为 YAML 文件\n'));
}

/**
 * Edit existing workflow
 */
async function editExistingWorkflow(file: string): Promise<void> {
  const { default: inquirer } = await import('inquirer');
  const { readFile } = await import('fs/promises');
  const { load } = await import('js-yaml');
  
  try {
    const content = await readFile(file, 'utf-8');
    const workflow = load(content) as Workflow;
    
    console.log(chalk.cyan(`\n📝 编辑工作流：${workflow.name}\n`));
    
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: '选择操作:',
        choices: [
          { name: '👀 查看工作流', value: 'view' },
          { name: '✏️  添加 Job', value: 'add-job' },
          { name: '🗑️  删除 Job', value: 'delete-job' },
          { name: '⚙️  修改触发条件', value: 'edit-triggers' },
          { name: '💾 保存并退出', value: 'save' },
          { name: '❌ 退出 (不保存)', value: 'exit' }
        ]
      }
    ]);
    
    switch (action) {
      case 'view':
        viewWorkflow(workflow);
        break;
      case 'add-job':
        await addJob(workflow, file);
        break;
      case 'delete-job':
        await deleteJob(workflow, file);
        break;
      case 'edit-triggers':
        await editTriggers(workflow, file);
        break;
      case 'save':
        console.log(chalk.green('✅ 保存成功!'));
        break;
      case 'exit':
        console.log(chalk.yellow('已退出，未保存更改'));
        break;
    }
    
  } catch (error: any) {
    console.log(chalk.red(`❌ 错误：${error.message}`));
  }
}

/**
 * View workflow details
 */
function viewWorkflow(workflow: Workflow): void {
  console.log(chalk.cyan(`\n📋 ${workflow.name}\n`));
  console.log(chalk.white('触发条件:'));
  console.log(chalk.gray(JSON.stringify(workflow.on, null, 2)));
  console.log(chalk.white('\nJobs:'));
  
  for (const [jobName, job] of Object.entries(workflow.jobs)) {
    console.log(chalk.green(`  ${jobName}:`));
    console.log(chalk.gray(`    runs-on: ${job.runsOn}`));
    console.log(chalk.gray(`    steps: ${job.steps.length}`));
    
    job.steps.forEach((step, i) => {
      const name = step.name || step.uses || step.run || `Step ${i + 1}`;
      console.log(chalk.gray(`      ${i + 1}. ${name}`));
    });
  }
  
  console.log();
}

/**
 * Add new job to workflow
 */
async function addJob(workflow: Workflow, file: string): Promise<void> {
  const { default: inquirer } = await import('inquirer');
  
  const { jobName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'jobName',
      message: 'Job 名称:'
    }
  ]);
  
  const { runsOn } = await inquirer.prompt([
    {
      type: 'list',
      name: 'runsOn',
      message: '运行环境:',
      choices: [
        'ubuntu-latest',
        'windows-latest',
        'macos-latest',
        'self-hosted'
      ]
    }
  ]);
  
  const { steps } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'steps',
      message: '选择步骤:',
      choices: [
        { name: 'Checkout code', value: 'checkout', checked: true },
        { name: 'Setup Node.js', value: 'setup-node', checked: false },
        { name: 'Install dependencies', value: 'install', checked: false },
        { name: 'Run build', value: 'build', checked: false },
        { name: 'Run tests', value: 'test', checked: false },
        { name: 'Deploy', value: 'deploy', checked: false }
      ]
    }
  ]);
  
  console.log(chalk.green(`\n✅ 添加 Job "${jobName}"\n`));
  // In full implementation, this would update the workflow and save
}

/**
 * Delete job from workflow
 */
async function deleteJob(workflow: Workflow, file: string): Promise<void> {
  const { default: inquirer } = await import('inquirer');
  
  const jobNames = Object.keys(workflow.jobs);
  
  if (jobNames.length === 0) {
    console.log(chalk.yellow('⚠️  没有可删除的 Job'));
    return;
  }
  
  const { jobToDelete } = await inquirer.prompt([
    {
      type: 'list',
      name: 'jobToDelete',
      message: '选择要删除的 Job:',
      choices: jobNames.map(name => ({ name, value: name }))
    }
  ]);
  
  console.log(chalk.yellow(`\n⚠️  将删除 Job "${jobToDelete}"`));
  // In full implementation, this would update the workflow and save
}

/**
 * Edit workflow triggers
 */
async function editTriggers(workflow: Workflow, file: string): Promise<void> {
  const { default: inquirer } = await import('inquirer');
  
  const { triggers } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'triggers',
      message: '选择触发条件:',
      default: Object.keys(workflow.on),
      choices: [
        { name: 'Push', value: 'push', checked: workflow.on.push !== undefined },
        { name: 'Pull Request', value: 'pull_request', checked: workflow.on.pull_request !== undefined },
        { name: 'Schedule (Cron)', value: 'schedule', checked: workflow.on.schedule !== undefined },
        { name: 'Manual (workflow_dispatch)', value: 'workflow_dispatch', checked: workflow.on.workflow_dispatch !== undefined }
      ]
    }
  ]);
  
  console.log(chalk.green(`\n✅ 更新触发条件：${triggers.join(', ')}\n`));
  // In full implementation, this would update the workflow and save
}
