/**
 * Workflow type definitions
 */

export interface Workflow {
  name: string;
  on: WorkflowTriggers;
  jobs: Record<string, Job>;
  env?: Record<string, string>;
  concurrency?: Concurrency;
}

export interface WorkflowTriggers {
  push?: PushTrigger;
  pull_request?: PullRequestTrigger;
  schedule?: ScheduleTrigger[];
  workflow_dispatch?: WorkflowDispatchTrigger;
  [key: string]: any;
}

export interface PushTrigger {
  branches?: string[];
  tags?: string[];
  paths?: string[];
}

export interface PullRequestTrigger {
  branches?: string[];
  types?: string[];
}

export interface ScheduleTrigger {
  cron: string;
}

export interface WorkflowDispatchTrigger {
  inputs?: Record<string, WorkflowInput>;
}

export interface WorkflowInput {
  description?: string;
  required?: boolean;
  default?: string;
  type?: string;
}

export interface Concurrency {
  group: string;
  cancelInProgress?: boolean;
}

export interface Job {
  name?: string;
  runsOn: string | string[];
  needs?: string[];
  if?: string;
  steps: Step[];
  env?: Record<string, string>;
  outputs?: Record<string, string>;
}

export interface Step {
  id?: string;
  name?: string;
  uses?: string;
  run?: string;
  with?: Record<string, any>;
  env?: Record<string, string>;
  if?: string;
  continueOnError?: boolean;
  timeoutMinutes?: number;
}

/**
 * Template type definitions
 */

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags?: string[];
  on: WorkflowTriggers;
  jobs: Record<string, Job>;
  inputs?: Record<string, WorkflowInput>;
}

/**
 * Template categories
 */

export type TemplateCategory = 
  | 'ci-cd'
  | 'testing'
  | 'deployment'
  | 'security'
  | 'monitoring'
  | 'custom';
