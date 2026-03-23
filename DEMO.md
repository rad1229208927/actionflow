# ActionFlow 可视化编辑器演示脚本

## 🎬 演示流程

### 1. 启动编辑器

```bash
$ actionflow edit

✏️  ActionFlow 可视化编辑器

选择操作:
❯ 📝 创建新工作流
  📂 编辑现有工作流
  📦 从模板开始
  ❌ 退出
```

---

### 2. 从模板创建

```bash
选择分类:
  all
❯ CI/CD
  DEPLOYMENT
  TESTING
  SECURITY

选择模板:
❯ nodejs-ci - Build and test Node.js project
  python-ci - Build and test Python project
  docker-build-push - Build Docker image and push to registry
  vercel-deploy - Deploy to Vercel on push to main

工作流名称:
> My CI Pipeline

输出文件:
> .github/workflows/my-ci.yml

✅ 将创建 "My CI Pipeline"
   模板：nodejs-ci
   文件：.github/workflows/my-ci.yml

💡 提示：使用 "actionflow init" 命令创建
   actionflow init "My CI Pipeline" --template nodejs-ci
```

---

### 3. 创建新工作流

```bash
工作流名称:
> Custom Workflow

选择触发条件:
❯◉ Push 到 main 分支
 ◉ Push 到所有分支
 ◉ Pull Request
 ◯ 定时执行 (Cron)
 ◯ 手动触发

选择 Job 类型:
❯◉ Build (构建)
 ◉ Test (测试)
 ◯ Lint (代码检查)
 ◯ Deploy (部署)
 ◯ Security Scan (安全扫描)

✅ 工作流配置完成!

名称：Custom Workflow
触发：push-main, pr
Jobs: build, test

💡 下一步：保存为 YAML 文件
```

---

### 4. 编辑现有工作流

```bash
$ actionflow edit .github/workflows/ci.yml

📝 编辑工作流：Node.js CI

选择操作:
❯ 👀 查看工作流
  ✏️  添加 Job
  🗑️  删除 Job
  ⚙️  修改触发条件
  💾 保存并退出
  ❌ 退出 (不保存)
```

---

### 5. 查看工作流

```bash
📋 Node.js CI

触发条件:
{
  "push": {
    "branches": ["main", "develop"]
  },
  "pull_request": {
    "branches": ["main"]
  }
}

Jobs:
  build:
    runs-on: ubuntu-latest
    steps: 4
      1. Checkout code
      2. Setup Node.js
      3. Install dependencies
      4. Run build
  test:
    runs-on: ubuntu-latest
    steps: 4
      1. Checkout code
      2. Setup Node.js
      3. Install dependencies
      4. Run tests
```

---

### 6. 添加 Job

```bash
Job 名称:
> deploy

运行环境:
  ubuntu-latest
❯ windows-latest
  macos-latest
  self-hosted

选择步骤:
❯◉ Checkout code
 ◉ Setup Node.js
 ◉ Install dependencies
 ◉ Run build
 ◉ Run tests
 ◉ Deploy

✅ 添加 Job "deploy"
```

---

### 7. HTML 预览

```bash
$ actionflow preview .github/workflows/ci.yml

👀 预览工作流

✅ 预览文件：/tmp/actionflow-preview-1234567890.html
   在浏览器中打开查看可视化效果

工作流概览:
  名称：Node.js CI
  Jobs: 2
  触发：push, pull_request
```

**HTML 效果**:
- 渐变色背景
- 白色卡片式布局
- 触发条件标签
- Job 卡片展示
- 步骤流程可视化
- 响应式设计

---

### 8. 实际使用场景

#### 场景 1: 新项目快速配置

```bash
# 1. 获取建议
actionflow suggest

# 2. 从模板创建
actionflow edit
# → 选择 "从模板开始"
# → 选择 "nodejs-ci"
# → 输入名称

# 3. 验证
actionflow validate .github/workflows/nodejs-ci.yml

# 4. 提交
git add .github/workflows/
git commit -m "ci: add GitHub Actions workflow"
```

#### 场景 2: 修改现有工作流

```bash
# 1. 打开编辑器
actionflow edit .github/workflows/ci.yml

# 2. 选择 "添加 Job"
# → 输入 "deploy"
# → 选择步骤

# 3. 保存并验证
actionflow validate .github/workflows/ci.yml
```

#### 场景 3: 可视化预览

```bash
# 1. 生成预览
actionflow preview .github/workflows/ci.yml --open

# 2. 在浏览器查看

# 3. 分享给团队
# → 发送 HTML 文件
# → 或截图
```

---

## 🎯 关键特性展示

### 易用性
- ✅ 菜单式操作
- ✅ 清晰的提示
- ✅ 默认值合理
- ✅ 实时反馈

### 可视化
- ✅ 工作流概览
- ✅ Job 依赖关系
- ✅ 步骤详细展示
- ✅ HTML 美观预览

### 灵活性
- ✅ 支持模板
- ✅ 支持自定义
- ✅ 可编辑现有
- ✅ 多种输出格式

---

## 📊 对比展示

### 手写 YAML
```
❌ 需要记住语法
❌ 容易出错
❌ 调试困难
❌ 耗时耗力
```

### 使用 ActionFlow
```
✅ 可视化操作
✅ 实时验证
✅ 模板丰富
✅ 3 秒完成
```

---

**演示结束**

Made with 🦞 by ActionFlow
