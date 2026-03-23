import chalk from 'chalk';
import { Workflow, Job, Step } from '../types/workflow.js';

/**
 * Interactive workflow generator wizard
 */
export async function generateWorkflowWizard(): Promise<Workflow> {
  const { default: inquirer } = await import('inquirer');
  
  console.log(chalk.cyan('\n🎨 ActionFlow 工作流生成器\n'));
  console.log(chalk.gray('回答几个问题，我将为你创建定制的工作流\n'));
  
  // Step 1: Basic info
  const { workflowName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'workflowName',
      message: '工作流名称:',
      default: 'My Workflow'
    }
  ]);
  
  // Step 2: Project type
  const { projectType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'projectType',
      message: '项目类型:',
      choices: [
        { name: '🟨 Node.js / JavaScript', value: 'nodejs' },
        { name: '🐍 Python', value: 'python' },
        { name: '☕ Java / Maven', value: 'java' },
        { name: '🦀 Rust', value: 'rust' },
        { name: '🐹 Go', value: 'go' },
        { name: '🐘 PHP', value: 'php' },
        { name: '🐳 Docker', value: 'docker' },
        { name: '🌐 Frontend (React/Vue)', value: 'frontend' },
        { name: '⚙️ 其他', value: 'other' }
      ]
    }
  ]);
  
  // Step 3: Triggers
  const { triggers } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'triggers',
      message: '触发条件:',
      choices: [
        { name: '📤 Push 到 main 分支', value: 'push-main', checked: true },
        { name: '📤 Push 到所有分支', value: 'push-all', checked: false },
        { name: '🔀 Pull Request', value: 'pr', checked: true },
        { name: '🏷️ Release', value: 'release', checked: false },
        { name: '⏰ 定时执行 (Cron)', value: 'cron', checked: false },
        { name: '👆 手动触发', value: 'manual', checked: false }
      ]
    }
  ]);
  
  // Step 4: Jobs
  const { jobs } = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'jobs',
      message: '需要哪些 Job:',
      choices: [
        { name: '🔨 Build (构建)', value: 'build', checked: true },
        { name: '🧪 Test (测试)', value: 'test', checked: true },
        { name: '📝 Lint (代码检查)', value: 'lint', checked: false },
        { name: '🔒 Security Scan (安全扫描)', value: 'security', checked: false },
        { name: '📦 Docker Build', value: 'docker-build', checked: false },
        { name: '🚀 Deploy (部署)', value: 'deploy', checked: false },
        { name: '📊 Coverage (覆盖率)', value: 'coverage', checked: false }
      ]
    }
  ]);
  
  // Step 5: Environment
  const { environment } = await inquirer.prompt([
    {
      type: 'list',
      name: 'environment',
      message: '运行环境:',
      choices: [
        { name: '🐧 Ubuntu Linux', value: 'ubuntu-latest' },
        { name: '🍎 macOS', value: 'macos-latest' },
        { name: '🪟 Windows', value: 'windows-latest' },
        { name: '🖥️ Self-hosted', value: 'self-hosted' }
      ],
      default: 'ubuntu-latest'
    }
  ]);
  
  // Step 6: Node version (if applicable)
  let nodeVersion = '18';
  if (['nodejs', 'frontend'].includes(projectType)) {
    const { nodeVer } = await inquirer.prompt([
      {
        type: 'list',
        name: 'nodeVer',
        message: 'Node.js 版本:',
        choices: ['14', '16', '18', '20'],
        default: '18'
      }
    ]);
    nodeVersion = nodeVer;
  }
  
  // Generate workflow
  const workflow = createWorkflow({
    name: workflowName,
    projectType,
    triggers,
    jobs,
    environment,
    nodeVersion
  });
  
  console.log(chalk.green('\n✅ 工作流生成完成!\n'));
  console.log(chalk.white(`名称：${workflow.name}`));
  console.log(chalk.white(`Jobs: ${Object.keys(workflow.jobs).length}`));
  console.log(chalk.white(`触发：${Object.keys(workflow.on).join(', ')}\n`));
  
  return workflow;
}

/**
 * Create workflow from wizard responses
 */
function createWorkflow(config: any): Workflow {
  const workflow: Workflow = {
    name: config.name,
    on: {},
    jobs: {}
  };
  
  // Setup triggers
  if (config.triggers.includes('push-main')) {
    workflow.on.push = { branches: ['main'] };
  }
  if (config.triggers.includes('push-all')) {
    workflow.on.push = { branches: ['**'] };
  }
  if (config.triggers.includes('pr')) {
    workflow.on.pull_request = { branches: ['main'] };
  }
  if (config.triggers.includes('release')) {
    workflow.on.release = { types: ['published'] };
  }
  if (config.triggers.includes('cron')) {
    workflow.on.schedule = [{ cron: '0 0 * * 0' }];
  }
  if (config.triggers.includes('manual')) {
    workflow.on.workflow_dispatch = {};
  }
  
  // Setup jobs
  if (config.jobs.includes('build')) {
    workflow.jobs.build = createBuildJob(config);
  }
  if (config.jobs.includes('test')) {
    workflow.jobs.test = createTestJob(config);
  }
  if (config.jobs.includes('lint')) {
    workflow.jobs.lint = createLintJob(config);
  }
  if (config.jobs.includes('security')) {
    workflow.jobs.security = createSecurityJob(config);
  }
  if (config.jobs.includes('docker-build')) {
    workflow.jobs['docker-build'] = createDockerJob(config);
  }
  if (config.jobs.includes('deploy')) {
    workflow.jobs.deploy = createDeployJob(config);
  }
  if (config.jobs.includes('coverage')) {
    workflow.jobs.coverage = createCoverageJob(config);
  }
  
  return workflow;
}

/**
 * Create build job
 */
function createBuildJob(config: any): Job {
  const steps: Step[] = [
    { name: 'Checkout code', uses: 'actions/checkout@v4' }
  ];
  
  // Add language setup
  if (config.projectType === 'nodejs' || config.projectType === 'frontend') {
    steps.push({
      name: 'Setup Node.js',
      uses: 'actions/setup-node@v4',
      with: { 'node-version': config.nodeVersion }
    });
    steps.push({ name: 'Install dependencies', run: 'npm ci' });
    steps.push({ name: 'Run build', run: 'npm run build' });
  } else if (config.projectType === 'python') {
    steps.push({
      name: 'Setup Python',
      uses: 'actions/setup-python@v5',
      with: { 'python-version': '3.11' }
    });
    steps.push({ name: 'Install dependencies', run: 'pip install -r requirements.txt' });
  } else if (config.projectType === 'java') {
    steps.push({
      name: 'Setup Java',
      uses: 'actions/setup-java@v4',
      with: { 'distribution': 'temurin', 'java-version': '17' }
    });
    steps.push({ name: 'Build with Maven', run: 'mvn -B package' });
  }
  
  return {
    runsOn: config.environment,
    steps
  };
}

/**
 * Create test job
 */
function createTestJob(config: any): Job {
  const steps: Step[] = [
    { name: 'Checkout code', uses: 'actions/checkout@v4' }
  ];
  
  if (config.projectType === 'nodejs' || config.projectType === 'frontend') {
    steps.push({
      name: 'Setup Node.js',
      uses: 'actions/setup-node@v4',
      with: { 'node-version': config.nodeVersion }
    });
    steps.push({ name: 'Install dependencies', run: 'npm ci' });
    steps.push({ name: 'Run tests', run: 'npm test' });
  } else if (config.projectType === 'python') {
    steps.push({
      name: 'Setup Python',
      uses: 'actions/setup-python@v5',
      with: { 'python-version': '3.11' }
    });
    steps.push({ name: 'Install dependencies', run: 'pip install -r requirements.txt' });
    steps.push({ name: 'Run tests', run: 'pytest' });
  }
  
  return {
    runsOn: config.environment,
    needs: config.jobs.includes('build') ? ['build'] : undefined,
    steps
  };
}

/**
 * Create lint job
 */
function createLintJob(config: any): Job {
  const steps: Step[] = [
    { name: 'Checkout code', uses: 'actions/checkout@v4' }
  ];
  
  if (config.projectType === 'nodejs' || config.projectType === 'frontend') {
    steps.push({
      name: 'Setup Node.js',
      uses: 'actions/setup-node@v4',
      with: { 'node-version': config.nodeVersion }
    });
    steps.push({ name: 'Install dependencies', run: 'npm ci' });
    steps.push({ name: 'Run lint', run: 'npm run lint' });
  }
  
  return {
    runsOn: config.environment,
    steps
  };
}

/**
 * Create security job
 */
function createSecurityJob(config: any): Job {
  const steps: Step[] = [
    { name: 'Checkout code', uses: 'actions/checkout@v4' },
    { name: 'Run security scan', uses: 'snyk/actions/node@master', env: { SNYK_TOKEN: '${{ secrets.SNYK_TOKEN }}' } }
  ];
  
  return {
    runsOn: config.environment,
    steps
  };
}

/**
 * Create Docker job
 */
function createDockerJob(config: any): Job {
  const steps: Step[] = [
    { name: 'Checkout code', uses: 'actions/checkout@v4' },
    { name: 'Set up Docker Buildx', uses: 'docker/setup-buildx-action@v3' },
    { name: 'Login to Docker Hub', uses: 'docker/login-action@v3', with: { username: '${{ secrets.DOCKER_USERNAME }}', password: '${{ secrets.DOCKER_PASSWORD }}' } },
    { name: 'Build and push', uses: 'docker/build-push-action@v5', with: { push: true, tags: 'user/app:latest' } }
  ];
  
  return {
    runsOn: config.environment,
    steps
  };
}

/**
 * Create deploy job
 */
function createDeployJob(config: any): Job {
  const steps: Step[] = [
    { name: 'Checkout code', uses: 'actions/checkout@v4' }
  ];
  
  if (config.projectType === 'frontend') {
    steps.push({
      name: 'Setup Node.js',
      uses: 'actions/setup-node@v4',
      with: { 'node-version': config.nodeVersion }
    });
    steps.push({ name: 'Install dependencies', run: 'npm ci' });
    steps.push({ name: 'Build', run: 'npm run build' });
    steps.push({ name: 'Deploy to Vercel', uses: 'amondnet/vercel-action@v25' });
  }
  
  return {
    runsOn: config.environment,
    needs: config.jobs.includes('build') ? ['build'] : undefined,
    steps
  };
}

/**
 * Create coverage job
 */
function createCoverageJob(config: any): Job {
  const steps: Step[] = [
    { name: 'Checkout code', uses: 'actions/checkout@v4' }
  ];
  
  if (config.projectType === 'nodejs' || config.projectType === 'frontend') {
    steps.push({
      name: 'Setup Node.js',
      uses: 'actions/setup-node@v4',
      with: { 'node-version': config.nodeVersion }
    });
    steps.push({ name: 'Install dependencies', run: 'npm ci' });
    steps.push({ name: 'Run tests with coverage', run: 'npm test -- --coverage' });
    steps.push({ name: 'Upload coverage', uses: 'codecov/codecov-action@v3' });
  }
  
  return {
    runsOn: config.environment,
    steps
  };
}
