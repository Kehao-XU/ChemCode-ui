# ChemCode UI

计算化学 AI Agent 平台前端界面。基于 Vite + Lit (Web Components) 构建。

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

启动后浏览器访问 `http://localhost:5174`。

## 项目结构

```
src/
├── main.ts                 # 入口
├── chemcode-app.ts         # 主应用壳（导航+路由）
├── styles.css              # 全局样式系统
├── types.ts                # 类型定义
├── state.ts                # 状态管理（当前为 mock 数据）
├── api.ts                  # [待编写] 后端 API 层
├── components/             # 通用组件
│   ├── navbar.ts           # 顶部导航栏
│   ├── sidebar.ts          # 侧边栏导航
│   ├── status-card.ts      # 统计卡片
│   └── code-block.ts       # 代码块（语法高亮+复制）
└── views/                  # 页面视图
    ├── dashboard-view.ts   # 仪表板
    ├── tasks-view.ts       # 任务管理表格
    ├── create-task-view.ts # 创建任务表单
    ├── task-detail-view.ts # 任务详情
    ├── knowledge-view.ts   # 知识库浏览
    ├── knowledge-detail.ts # 知识条目详情
    ├── code-gen-view.ts    # 代码生成与验证
    ├── results-view.ts     # 结果可视化
    └── chat-view.ts        # AI 对话界面
```

## 页面总览

### 1. 仪表板 (`/dashboard`)
- 4 个统计卡片：活跃任务数、今日完成数、知识库条目数、系统状态
- 运行中任务卡片网格（含进度条）
- 最近任务列表

### 2. 任务管理 (`/tasks`)
- 表格视图：任务ID、名称、计算类型、状态、时间
- 按状态筛选
- 创建、查看、编辑、删除操作

### 3. 创建任务 (`/create-task`)
- 分节表单：基本信息 → 分子结构上传 → 计算参数 → 高级参数
- 支持力场选择、温控/压控方法、边界条件等专业参数

### 4. 任务详情 (`/task-detail`)
- 运行状态 + 进度条
- 基本信息、计算参数、输出文件
- 操作按钮：查看结果、编辑、停止、导出

### 5. 知识库 (`/knowledge`)
- 按分类筛选（学术规范、计算库使用指南、参数设置规则等）
- 卡片网格展示，点击查看详情
- 内置 5 条示例知识条目

### 6. 代码生成 (`/code-gen`)
- 左侧参数配置面板
- 右侧代码预览（GROMACS .mdp / Python 分析脚本）
- 语法高亮 + 复制 + 下载

### 7. 结果分析 (`/results`)
- 3D 分子结构查看器（占位区域）
- 四个图表卡片：能量、温度、压力、RMSD
- 统计指标面板

### 8. AI 对话 (`/chat`)
- 对话气泡界面（用户右对齐蓝色 / Agent 左对齐灰色）
- 底部输入框 + 快捷操作附件
- 快速问题引导按钮
- 模拟输入响应（演示用）

## 测试指南

### 本地预览测试

```bash
pnpm dev
```

打开的界面中每个页面都有内嵌的 mock 数据，可以直接测试所有交互流程：

1. **仪表板** → 点击任务卡片 → 跳转任务详情
2. **仪表板** → 最近任务 → 查看/编辑/删除操作
3. **任务管理** → 筛选下拉 → 切换状态过滤
4. **任务管理** → 创建任务 → 跳转创建页面
5. **创建任务** → 填写表单 → 提交（触发 mock 提示）
6. **知识库** → 点击分类筛选 → 切换知识条目
7. **知识库** → 点击条目卡片 → 查看详情（含代码示例）
8. **代码生成** → 切换代码类型标签 → 复制/下载代码
9. **结果分析** → 下拉选择任务 → 查看图表区域
10. **AI 对话** → 输入文字/点击快捷问题 → 模拟回复（1.5s延迟）
11. **侧边栏** → 所有导航项均可用

### 对接后端测试

将 `state.ts` 中的 mock 数据调用替换为真实的 API 请求，详见下方对接说明。

### 构建测试

```bash
pnpm build
```

产物在 `dist/` 目录，可直接部署到任意静态服务器。

## 对接后端

在 `src/api.ts` 中定义接口（需要手动创建）：

```typescript
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

export async function fetchTasks() {
  const res = await fetch(`${BASE}/tasks`)
  return res.json()
}

// ... 其他接口
```

然后修改 `state.ts`，在初始化或订阅时从 API 获取真实数据替换 mock。

## 样式定制

所有设计变量集中在 `src/styles.css` 的 `:root`：

- 颜色系统：主色、辅助色、状态色、文字色
- 字体系统：家族、大小、粗细
- 间距系统：4px ~ 32px
- 圆角系统：4px / 8px / 12px
- 过渡动画：150ms / 250ms

直接修改变量即可全局换肤。

## 技术栈

| 技术 | 用途 |
|---|---|
| [Vite](https://vitejs.dev/) | 构建工具 |
| [Lit](https://lit.dev/) | Web Components 框架 |
| [TypeScript](https://www.typescriptlang.org/) | 类型安全 |
| [highlight.js](https://highlightjs.org/) | 代码语法高亮 |
| [marked](https://marked.js.org/) | Markdown 渲染 |
| [DOMPurify](https://github.com/cure53/DOMPurify) | XSS 防护 |

## 设计参考

UI 设计需求文档：`./ui-design-requirements.md`

## License

MIT
