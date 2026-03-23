# ActionFlow 🔄

> **告别 YAML 痛苦，可视化构建 CI/CD**

[![Version](https://img.shields.io/badge/version-0.1.0-blue)](https://github.com/rad1229208927/actionflow)
[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/rad1229208927/actionflow/blob/main/LICENSE)
[![Stars](https://img.shields.io/github/stars/rad1229208927/actionflow)](https://github.com/rad1229208927/actionflow)

---

## 📖 目录

- [简介](#-简介)
- [功能特性](#-功能特性)
- [快速开始](#-快速开始)
- [内置模板](#-内置模板)
- [使用示例](#-使用示例)
- [命令行参考](#-命令行参考)
- [开发计划](#-开发计划)
- [贡献](#-贡献)

---

## 🎯 简介

ActionFlow 是一个 GitHub Actions 可视化构建工具，让你无需手写 YAML 就能创建专业的 CI/CD 工作流。

### 解决什么问题？

```
❌ 传统方式：
   - 查 YAML 语法花 30 分钟
   - 调试工作流花 2 小时
   - 复制粘贴网上模板

✅ 使用 ActionFlow：
   - actionflow init "My CI" -t nodejs-ci
   - 3 秒搞定！
   - 继续 coding
```

### 工作流程

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  选择模板   │ ──→ │  自动配置    │ ──→ │  YAML 文件   │
│  或建议     │     │  项目感知    │     │  立即可用   │
└─────────────┘     └──────────────┘     └─────────────┘
```

---

## ✨ 功能特性

### 📦 模板库

内置 6 个常用模板，覆盖主流场景。

```bash
$ actionflow templates

📦 Available Templates

CI/CD
──────────────────────────────────────────
  nodejs-ci
    Build and test Node.js project
    Tags: nodejs, javascript, testing

  python-ci
    Build and test Python project
    Tags: python, testing

DEPLOYMENT
──────────────────────────────────────────
  docker-build-push
    Build Docker image and push to registry
    Tags: docker, container, deployment

  vercel-deploy
    Deploy to Vercel on push to main
    Tags: vercel, deployment, frontend

TESTING
──────────────────────────────────────────
  jest-coverage
    Run Jest tests with coverage
    Tags: jest, testing, coverage

SECURITY
──────────────────────────────────────────
  security-scan
    Run security scanning on dependencies
    Tags: security, scanning, dependencies
```

### 💡 智能建议

自动检测项目类型，推荐合适的工作流。

```bash
$ actionflow suggest

💡 Analyzing project...

Recommended workflows:

1. Node.js CI
   Detected Node.js project with test script
   Template: nodejs-ci
   → actionflow init node-ci --template nodejs-ci

2. Jest Coverage
   Detected Jest testing framework
   Template: jest-coverage
   → actionflow init jest --template jest-coverage
```

### ✅ YAML 验证

在提交前捕获语法错误。

```bash
$ actionflow validate .github/workflows/ci.yml

✅ Workflow is valid!
   Name: Node.js CI
   Jobs: build, test
```

### 🎨 可视化编辑器 (开发中)

拖拽式工作流设计界面。

```
┌─────────────────────────────────────────────┐
│  Workflow: CI/CD Pipeline              [▶] │
├─────────────────────────────────────────────┤
│  Triggers                                   │
│  ┌─────────────┐  ┌─────────────┐          │
│  │ Push        │  │ Pull Request│          │
│  │ main branch │  │ any branch  │          │
│  └─────────────┘  └─────────────┘          │
├─────────────────────────────────────────────┤
│  Jobs                                       │
│  ┌─────────────────────────────────────┐   │
│  │ build                               │   │
│  │ ┌────────┐ ┌────────┐ ┌────────┐   │   │
│  │ │Checkout│→│Install │→│ Build  │   │   │
│  │ └────────┘ └────────┘ └────────┘   │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

## 🚀 快速开始

### 1️⃣ 安装

```bash
# 克隆项目
git clone https://github.com/rad1229208927/actionflow.git
cd actionflow

# 安装依赖
npm install

# 构建
npm run build

# 全局安装（推荐）
npm link
```

### 2️⃣ 第一次使用

```bash
# 查看帮助
actionflow --help

# 查看可用模板
actionflow templates

# 获取项目建议
actionflow suggest
```

---

## 📦 内置模板

### CI/CD 模板

#### Node.js CI

```bash
actionflow init "Node CI" --template nodejs-ci
```

生成的工作流：
- ✅ 自动安装依赖
- ✅ 运行构建
- ✅ 执行测试
- ✅ 支持多 Node 版本

#### Python CI

```bash
actionflow init "Python CI" --template python-ci
```

生成的工作流：
- ✅ 自动安装依赖
- ✅ 运行 flake8 检查
- ✅ 执行 pytest 测试

### 部署模板

#### Docker Build & Push

```bash
actionflow init "Docker" --template docker-build-push
```

生成的工作流：
- ✅ 构建 Docker 镜像
- ✅ 推送到 Docker Hub
- ✅ 支持多标签

#### Vercel Deploy

```bash
actionflow init "Vercel" --template vercel-deploy
```

生成的工作流：
- ✅ 自动部署到 Vercel
- ✅ 支持 Preview 部署
- ✅ 环境变量配置

### 测试模板

#### Jest Coverage

```bash
actionflow init "Jest" --template jest-coverage
```

生成的工作流：
- ✅ 运行 Jest 测试
- ✅ 生成覆盖率报告
- ✅ 上传到 Codecov

### 安全模板

#### Security Scan

```bash
actionflow init "Security" --template security-scan
```

生成的工作流：
- ✅ npm audit 检查
- ✅ Snyk 安全扫描
- ✅ 每周自动运行

---

## 📖 使用示例

### 为 Node.js 项目添加 CI

```bash
# 1. 获取建议
actionflow suggest

# 2. 创建 workflow
actionflow init "Node CI" --template nodejs-ci

# 3. 验证
actionflow validate .github/workflows/node-ci.yml

# 4. 提交
git add .github/workflows/
git commit -m "ci: add GitHub Actions workflow"
```

### 创建自定义工作流

```bash
# 1. 从模板开始
actionflow init "Custom" --template nodejs-ci

# 2. 编辑 YAML
vim .github/workflows/custom.yml

# 3. 验证
actionflow validate .github/workflows/custom.yml
```

### 团队标准化

```bash
# 创建团队模板库
actionflow templates --category ci-cd

# 分享给团队成员
# 统一使用相同的工作流模板
```

---

## 🛠️ 命令行参考

### 基本命令

```bash
actionflow                    # 显示帮助
actionflow --version          # 显示版本
```

### 工作流管理

```bash
actionflow init <name>        # 创建新工作流
actionflow init <name> -t <模板>  # 从模板创建
actionflow edit [文件]        # 编辑工作流 (WIP)
actionflow validate <文件>    # 验证工作流
actionflow export [文件]      # 导出工作流
```

### 模板管理

```bash
actionflow templates          # 列出所有模板
actionflow templates -c <分类>   # 按分类筛选
actionflow templates -s <搜索>   # 搜索模板
actionflow suggest            # 获取项目建议
```

### 常用选项

| 选项 | 简写 | 说明 |
|------|------|------|
| `--template` | `-t` | 使用模板 |
| `--output` | `-o` | 输出文件 |
| `--category` | `-c` | 分类筛选 |
| `--search` | `-s` | 搜索 |

---

## 📊 项目结构

```
actionflow/
├── src/
│   ├── index.ts           # CLI 入口
│   ├── commands/
│   │   ├── init.ts        # 初始化命令
│   │   ├── edit.ts        # 编辑命令
│   │   ├── validate.ts    # 验证命令
│   │   ├── templates.ts   # 模板命令
│   │   ├── suggest.ts     # 建议命令
│   │   └── export.ts      # 导出命令
│   ├── templates/
│   │   └── index.ts       # 内置模板
│   └── types/
│       └── workflow.ts    # 类型定义
├── README.md
├── README_CN.md           # 中文文档
├── package.json
└── tsconfig.json
```

---

## 🗺️ 开发计划

### Phase 1: MVP ✅ (已完成)

- [x] CLI 框架
- [x] 模板系统
- [x] YAML 生成
- [x] 项目建议
- [x] 基础验证

### Phase 2: Core (进行中)

- [ ] 可视化编辑器
- [ ] 拖拽式界面
- [ ] 实时预览
- [ ] 更多模板

### Phase 3: Advanced (计划中)

- [ ] 本地测试运行器
- [ ] 模板市场
- [ ] 团队协作
- [ ] CI/CD 集成

---

## 🙏 致谢

使用以下优秀开源项目：

- [Commander.js](https://github.com/tj/commander.js) - CLI 框架
- [Chalk](https://github.com/chalk/chalk) - 终端颜色
- [Ora](https://github.com/sindresorhus/ora) - 加载动画
- [js-yaml](https://github.com/nodeca/js-yaml) - YAML 解析

---

## 📬 问题与贡献

- 报告 Bug: [GitHub Issues](https://github.com/rad1229208927/actionflow/issues)
- 功能建议: [Discussions](https://github.com/rad1229208927/actionflow/discussions)
- 贡献代码: 请先阅读贡献指南

---

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE)

---

## 🔗 相关链接

- [GitHub 仓库](https://github.com/rad1229208927/actionflow)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Workflow 语法参考](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)

---

<div align="center">

**Made with 🦞 by OpenClaw**

如果这个项目对你有帮助，请给一个 ⭐ Star！

</div>
