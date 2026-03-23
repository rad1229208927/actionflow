# ActionFlow 🔄

> **CI/CD Without the YAML Pain**

Visual builder for GitHub Actions workflows. Create, edit, and manage CI/CD pipelines with ease.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Features

- 📦 **Template Library** - Pre-built workflows for common scenarios
- 💡 **Smart Suggestions** - Auto-detect project type and recommend workflows
- ✅ **Validation** - Catch YAML errors before commit
- 🎨 **Visual Editor** - Interactive TUI for workflow editing
- 👀 **HTML Preview** - Generate beautiful workflow visualization
- 📋 **Export** - Generate clean, readable YAML

---

## 🚀 Quick Start

```bash
# Install
npm install
npm run build
npm link

# List templates
actionflow templates

# Create workflow from template
actionflow "My CI" --template nodejs-ci

# Get suggestions for your project
actionflow suggest

# Validate workflow
actionflow validate .github/workflows/ci.yml
```

---

## 📦 Available Templates

### CI/CD
- `nodejs-ci` - Node.js build and test
- `python-ci` - Python build and test

### Deployment
- `docker-build-push` - Build and push Docker image
- `vercel-deploy` - Deploy to Vercel

### Testing
- `jest-coverage` - Jest tests with coverage

### Security
- `security-scan` - Dependency security scanning

---

## 📖 Commands

```bash
actionflow init <name>           # Create new workflow
actionflow init <name> -t <tpl>  # Create from template
actionflow edit [file]           # Edit workflow (WIP)
actionflow validate <file>       # Validate workflow
actionflow templates             # List templates
actionflow suggest               # Get suggestions
actionflow export [file]         # Export workflow
```

---

## 🎯 Examples

### Create Node.js CI

```bash
actionflow init "Node CI" --template nodejs-ci
```

### Get Project Suggestions

```bash
actionflow suggest

# Output:
# 💡 Analyzing project...
# 
# Recommended workflows:
# 1. Node.js CI
#    Detected Node.js project with test script
#    → actionflow init node-ci --template nodejs-ci
```

---

## 🛠️ Development

```bash
npm install
npm run dev -- templates
npm run build
```

---

## 📄 License

MIT License

---

**Made with 🦞 by OpenClaw**
