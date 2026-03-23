import { WorkflowTemplate } from '../types/workflow.js';

/**
 * Built-in workflow templates
 */

export const templates: WorkflowTemplate[] = [
  // CI/CD Templates
  {
    id: 'nodejs-ci',
    name: 'Node.js CI',
    description: 'Build and test Node.js project',
    category: 'ci-cd',
    tags: ['nodejs', 'javascript', 'testing'],
    on: {
      push: { branches: ['main', 'develop'] },
      pull_request: { branches: ['main'] }
    },
    jobs: {
      build: {
        runsOn: 'ubuntu-latest',
        steps: [
          { name: 'Checkout', uses: 'actions/checkout@v4' },
          { name: 'Setup Node.js', uses: 'actions/setup-node@v4', with: { 'node-version': '18' } },
          { name: 'Install dependencies', run: 'npm ci' },
          { name: 'Build', run: 'npm run build' }
        ]
      },
      test: {
        runsOn: 'ubuntu-latest',
        needs: ['build'],
        steps: [
          { name: 'Checkout', uses: 'actions/checkout@v4' },
          { name: 'Setup Node.js', uses: 'actions/setup-node@v4', with: { 'node-version': '18' } },
          { name: 'Install dependencies', run: 'npm ci' },
          { name: 'Run tests', run: 'npm test' }
        ]
      }
    }
  },
  
  {
    id: 'python-ci',
    name: 'Python CI',
    description: 'Build and test Python project',
    category: 'ci-cd',
    tags: ['python', 'testing'],
    on: {
      push: { branches: ['main'] },
      pull_request: { branches: ['main'] }
    },
    jobs: {
      build: {
        runsOn: 'ubuntu-latest',
        steps: [
          { name: 'Checkout', uses: 'actions/checkout@v4' },
          { name: 'Setup Python', uses: 'actions/setup-python@v5', with: { 'python-version': '3.11' } },
          { name: 'Install dependencies', run: 'pip install -r requirements.txt' },
          { name: 'Lint', run: 'flake8 .' },
          { name: 'Test', run: 'pytest' }
        ]
      }
    }
  },
  
  // Deployment Templates
  {
    id: 'docker-build-push',
    name: 'Docker Build and Push',
    description: 'Build Docker image and push to registry',
    category: 'deployment',
    tags: ['docker', 'container', 'deployment'],
    on: {
      push: { tags: ['v*'] }
    },
    jobs: {
      docker: {
        runsOn: 'ubuntu-latest',
        steps: [
          { name: 'Checkout', uses: 'actions/checkout@v4' },
          { name: 'Set up Docker Buildx', uses: 'docker/setup-buildx-action@v3' },
          { name: 'Login to Docker Hub', uses: 'docker/login-action@v3', with: { username: '${{ secrets.DOCKER_USERNAME }}', password: '${{ secrets.DOCKER_PASSWORD }}' } },
          { name: 'Build and push', uses: 'docker/build-push-action@v5', with: { push: true, tags: 'user/app:${{ github.ref_name }}' } }
        ]
      }
    }
  },
  
  {
    id: 'vercel-deploy',
    name: 'Deploy to Vercel',
    description: 'Deploy to Vercel on push to main',
    category: 'deployment',
    tags: ['vercel', 'deployment', 'frontend'],
    on: {
      push: { branches: ['main'] }
    },
    jobs: {
      deploy: {
        runsOn: 'ubuntu-latest',
        steps: [
          { name: 'Checkout', uses: 'actions/checkout@v4' },
          { name: 'Deploy to Vercel', uses: 'amondnet/vercel-action@v25', with: { vercel-token: '${{ secrets.VERCEL_TOKEN }}', vercel-org-id: '${{ secrets.VERCEL_ORG_ID }}', vercel-project-id: '${{ secrets.VERCEL_PROJECT_ID }}' } }
        ]
      }
    }
  },
  
  // Testing Templates
  {
    id: 'jest-coverage',
    name: 'Jest Coverage Report',
    description: 'Run Jest tests with coverage',
    category: 'testing',
    tags: ['jest', 'testing', 'coverage', 'javascript'],
    on: {
      pull_request: { branches: ['main'] }
    },
    jobs: {
      test: {
        runsOn: 'ubuntu-latest',
        steps: [
          { name: 'Checkout', uses: 'actions/checkout@v4' },
          { name: 'Setup Node.js', uses: 'actions/setup-node@v4', with: { 'node-version': '18' } },
          { name: 'Install dependencies', run: 'npm ci' },
          { name: 'Run tests with coverage', run: 'npm test -- --coverage' },
          { name: 'Upload coverage', uses: 'codecov/codecov-action@v3' }
        ]
      }
    }
  },
  
  // Security Templates
  {
    id: 'security-scan',
    name: 'Security Scan',
    description: 'Run security scanning on dependencies',
    category: 'security',
    tags: ['security', 'scanning', 'dependencies'],
    on: {
      push: { branches: ['main'] },
      schedule: [{ cron: '0 0 * * 0' }] // Weekly
    },
    jobs: {
      security: {
        runsOn: 'ubuntu-latest',
        steps: [
          { name: 'Checkout', uses: 'actions/checkout@v4' },
          { name: 'Run npm audit', run: 'npm audit' },
          { name: 'Run Snyk', uses: 'snyk/actions/node@master', env: { SNYK_TOKEN: '${{ secrets.SNYK_TOKEN }}' } }
        ]
      }
    }
  }
];

/**
 * Get all templates
 */
export function getTemplates(): WorkflowTemplate[] {
  return templates;
}

/**
 * Get template by ID
 */
export function getTemplate(id: string): WorkflowTemplate | undefined {
  return templates.find(t => t.id === id);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: string): WorkflowTemplate[] {
  return templates.filter(t => t.category === category);
}

/**
 * Search templates
 */
export function searchTemplates(query: string): WorkflowTemplate[] {
  const q = query.toLowerCase();
  return templates.filter(t => 
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.tags?.some(tag => tag.toLowerCase().includes(q))
  );
}

/**
 * Get all categories
 */
export function getCategories(): string[] {
  return [...new Set(templates.map(t => t.category))];
}
