import { WorkflowTemplate } from '../types/workflow.js';

/**
 * Additional workflow templates
 */

export const additionalTemplates: WorkflowTemplate[] = [
  // Go CI/CD
  {
    id: 'go-ci',
    name: 'Go CI',
    description: 'Build and test Go project',
    category: 'ci-cd',
    tags: ['go', 'golang', 'testing'],
    on: {
      push: { branches: ['main', 'develop'] },
      pull_request: { branches: ['main'] }
    },
    jobs: {
      build: {
        runsOn: 'ubuntu-latest',
        steps: [
          { name: 'Checkout', uses: 'actions/checkout@v4' },
          { name: 'Setup Go', uses: 'actions/setup-go@v5', with: { 'go-version': '1.21' } },
          { name: 'Build', run: 'go build -v ./...' },
          { name: 'Test', run: 'go test -v ./...' }
        ]
      }
    }
  },
  
  // Rust CI/CD
  {
    id: 'rust-ci',
    name: 'Rust CI',
    description: 'Build and test Rust project',
    category: 'ci-cd',
    tags: ['rust', 'testing'],
    on: {
      push: { branches: ['main'] },
      pull_request: { branches: ['main'] }
    },
    jobs: {
      build: {
        runsOn: 'ubuntu-latest',
        steps: [
          { name: 'Checkout', uses: 'actions/checkout@v4' },
          { name: 'Setup Rust', uses: 'dtolnay/rust-toolchain@stable' },
          { name: 'Build', run: 'cargo build --verbose' },
          { name: 'Test', run: 'cargo test --verbose' },
          { name: 'Clippy', run: 'cargo clippy -- -D warnings' }
        ]
      }
    }
  },
  
  // Java/Maven CI
  {
    id: 'java-maven',
    name: 'Java Maven CI',
    description: 'Build and test Java project with Maven',
    category: 'ci-cd',
    tags: ['java', 'maven', 'testing'],
    on: {
      push: { branches: ['main'] },
      pull_request: { branches: ['main'] }
    },
    jobs: {
      build: {
        runsOn: 'ubuntu-latest',
        steps: [
          { name: 'Checkout', uses: 'actions/checkout@v4' },
          { name: 'Setup Java', uses: 'actions/setup-java@v4', with: { 'distribution': 'temurin', 'java-version': '17' } },
          { name: 'Build with Maven', run: 'mvn -B package --file pom.xml' },
          { name: 'Test', run: 'mvn test' }
        ]
      }
    }
  },
  
  // PHP CI
  {
    id: 'php-ci',
    name: 'PHP CI',
    description: 'Build and test PHP project',
    category: 'ci-cd',
    tags: ['php', 'testing'],
    on: {
      push: { branches: ['main'] },
      pull_request: { branches: ['main'] }
    },
    jobs: {
      build: {
        runsOn: 'ubuntu-latest',
        steps: [
          { name: 'Checkout', uses: 'actions/checkout@v4' },
          { name: 'Setup PHP', uses: 'shivammathur/setup-php@v2', with: { 'php-version': '8.2' } },
          { name: 'Install dependencies', run: 'composer install' },
          { name: 'Run tests', run: 'vendor/bin/phpunit' }
        ]
      }
    }
  },
  
  // AWS Deploy
  {
    id: 'aws-deploy',
    name: 'Deploy to AWS',
    description: 'Deploy to AWS using GitHub Actions',
    category: 'deployment',
    tags: ['aws', 'deployment', 'cloud'],
    on: {
      push: { branches: ['main'] }
    },
    jobs: {
      deploy: {
        runsOn: 'ubuntu-latest',
        steps: [
          { name: 'Checkout', uses: 'actions/checkout@v4' },
          { name: 'Configure AWS credentials', uses: 'aws-actions/configure-aws-credentials@v4', with: { 'aws-access-key-id': '${{ secrets.AWS_ACCESS_KEY_ID }}', 'aws-secret-access-key': '${{ secrets.AWS_SECRET_ACCESS_KEY }}', 'aws-region': 'us-east-1' } },
          { name: 'Deploy to S3', run: 'aws s3 sync ./dist s3://${{ secrets.S3_BUCKET }}' },
          { name: 'Invalidate CloudFront', run: 'aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_ID }} --paths "/*"' }
        ]
      }
    }
  },
  
  // GitHub Pages Deploy
  {
    id: 'github-pages',
    name: 'Deploy to GitHub Pages',
    description: 'Deploy static site to GitHub Pages',
    category: 'deployment',
    tags: ['github-pages', 'deployment', 'static'],
    on: {
      push: { branches: ['main'] }
    },
    jobs: {
      deploy: {
        runsOn: 'ubuntu-latest',
        steps: [
          { name: 'Checkout', uses: 'actions/checkout@v4' },
          { name: 'Setup Node.js', uses: 'actions/setup-node@v4', with: { 'node-version': '18' } },
          { name: 'Install dependencies', run: 'npm ci' },
          { name: 'Build', run: 'npm run build' },
          { name: 'Deploy to GitHub Pages', uses: 'peaceiris/actions-gh-pages@v4', with: { 'github_token': '${{ secrets.GITHUB_TOKEN }}', 'publish_dir': './dist' } }
        ]
      }
    }
  },
  
  // Release Drafter
  {
    id: 'release-drafter',
    name: 'Release Drafter',
    description: 'Automatically draft releases based on merged PRs',
    category: 'ci-cd',
    tags: ['release', 'automation'],
    on: {
      push: { branches: ['main'] }
    },
    jobs: {
      update_release_draft: {
        runsOn: 'ubuntu-latest',
        steps: [
          { name: 'Draft release', uses: 'release-drafter/release-drafter@v5', env: { 'GITHUB_TOKEN': '${{ secrets.GITHUB_TOKEN }}' } }
        ]
      }
    }
  },
  
  // Dependency Review
  {
    id: 'dependency-review',
    name: 'Dependency Review',
    description: 'Review dependency changes in PRs',
    category: 'security',
    tags: ['security', 'dependencies', 'review'],
    on: {
      pull_request: { branches: ['main'] }
    },
    jobs: {
      dependency_review: {
        runsOn: 'ubuntu-latest',
        steps: [
          { name: 'Checkout', uses: 'actions/checkout@v4' },
          { name: 'Dependency Review', uses: 'actions/dependency-review-action@v3' }
        ]
      }
    }
  },
  
  // CodeQL Analysis
  {
    id: 'codeql',
    name: 'CodeQL Analysis',
    description: 'Security analysis with GitHub CodeQL',
    category: 'security',
    tags: ['security', 'codeql', 'analysis'],
    on: {
      push: { branches: ['main'] },
      schedule: [{ cron: '0 0 * * 0' }]
    },
    jobs: {
      analyze: {
        runsOn: 'ubuntu-latest',
        steps: [
          { name: 'Checkout', uses: 'actions/checkout@v4' },
          { name: 'Initialize CodeQL', uses: 'github/codeql-action/init@v3' },
          { name: 'Autobuild', uses: 'github/codeql-action/autobuild@v3' },
          { name: 'Perform CodeQL Analysis', uses: 'github/codeql-action/analyze@v3' }
        ]
      }
    }
  },
  
  // Slack Notification
  {
    id: 'slack-notify',
    name: 'Slack Notification',
    description: 'Send Slack notifications on deployment',
    category: 'monitoring',
    tags: ['slack', 'notification', 'monitoring'],
    on: {
      deployment: { types: ['created'] }
    },
    jobs: {
      notify: {
        runsOn: 'ubuntu-latest',
        steps: [
          { name: 'Send Slack notification', uses: 'slackapi/slack-github-action@v1', with: { 'payload': '{"text":"Deployment completed!"}' }, env: { 'SLACK_WEBHOOK_URL': '${{ secrets.SLACK_WEBHOOK_URL }}' } }
        ]
      }
    }
  }
];

/**
 * Merge additional templates with base templates
 */
export function getAllTemplates(): WorkflowTemplate[] {
  const { templates } = require('./index.js');
  return [...templates, ...additionalTemplates];
}

/**
 * Get template by ID from all templates
 */
export function getTemplateById(id: string): WorkflowTemplate | undefined {
  const all = getAllTemplates();
  return all.find(t => t.id === id);
}

/**
 * Get templates by category from all templates
 */
export function getTemplatesByCategory(category: string): WorkflowTemplate[] {
  const all = getAllTemplates();
  return all.filter(t => t.category === category);
}

/**
 * Search all templates
 */
export function searchAllTemplates(query: string): WorkflowTemplate[] {
  const all = getAllTemplates();
  const q = query.toLowerCase();
  return all.filter(t => 
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.tags?.some(tag => tag.toLowerCase().includes(q))
  );
}

/**
 * Get template count
 */
export function getTemplateCount(): number {
  return getAllTemplates().length;
}
