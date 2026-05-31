# ChemCode UI

计算化学 AI Agent 平台前端界面。基于 Vite + Lit (Web Components) 构建。

## 快速开始

```bash
pnpm install
pnpm dev      # 启动开发服务器
pnpm build    # 构建生产版本
```

启动后浏览器访问 `http://localhost:5174`。

## 项目结构

```
src/
├── main.ts                 # 入口
├── chemcode-app.ts         # 主应用壳（布局+路由）
├── styles.css              # 全局样式系统
├── types.ts                # 类型定义
├── state.ts                # 状态管理（含示例数据）
├── components/
│   ├── navbar.ts           # 顶部导航栏（Logo + 用户信息）
│   ├── sidebar.ts          # 侧边栏（导航+任务列表）
│   ├── status-card.ts      # 统计卡片
│   └── code-block.ts       # 代码块
└── views/
    ├── chat-view.ts        # 对话界面（主页面）
    ├── task-detail-view.ts # 任务详情
    ├── knowledge-view.ts   # 个人知识库（Wiki风格）
    ├── skills-view.ts      # Skill管理
    └── settings-view.ts    # 设置（账户/系统/模型/帮助）
```

## 页面总览

### 1. 对话界面（默认页）
**侧边栏导航：**
- 💬 新建任务 → 对话界面
- 🧩 Skills → Skill管理
- 📚 个人知识库 → Wiki
- ⚙️ 设置

**侧边栏任务列表：**
- 按最近时间排列
- 状态标识：绿点(完成) / 黄点(等待中) / 红点(报错) / 转圈(进行中)
- 悬停显示操作按钮

**对话区域：**
- 用户消息：右对齐蓝色气泡
- Agent消息：左对齐灰色气泡，可附带生成文件块
- 系统消息：居中警告样式
- 输入区域：文本输入 + 发送 + 📎附件 + 模型选择器
- 确认弹窗：输入区域上方弹出，询问是否接受当前步骤

### 2. 任务详情
左侧Tab栏：
- 📋 任务基本信息
- ⚙️ 计算参数
- 📄 输出文件列表
- 📊 可视化（预留）

### 3. 个人知识库
- Wiki风格展示
- 搜索功能
- Markdown渲染（表格、代码块、标题）

### 4. Skills管理
- 已安装/可安装分区
- 安装/卸载切换
- 导入按钮

### 5. 设置
左侧导航 → 右侧内容：
- 👤 账户管理：用户信息 + 登入登出
- ⚙️ 系统设置：语言(cn/en) / 字体大小 / 主题(浅色/深色)
- 🤖 模型管理：列表显示 + 新增模型弹窗(url/api key/名称/上下文)
- ❓ 帮助与反馈

## 测试指南

```bash
pnpm dev
```

### 功能测试路径

1. **对话框** → 输入文字发送 → 看模拟回复 + 生成文件块
2. **对话框** → 确认弹窗出现 → 点"接受"/"拒绝"
3. **对话框** → 切换模型选择器
4. **侧边栏** → 点击任务 → 跳转任务详情
5. **侧边栏** → 搜索任务
6. **任务详情** → 切换左侧Tab → 查看内容变化
7. **任务详情** → 退出按钮 → 返回对话框
8. **知识库** → 搜索关键词 → 查看Wiki渲染
9. **Skills** → 安装/卸载切换
10. **设置-账户** → 查看用户信息
11. **设置-系统** → 切换语言/字体/主题
12. **设置-模型** → 新增模型 → 填写弹窗 → 保存 → 列表中显示
13. **设置-模型** → 删除已有模型
14. **侧边栏** → 状态标识验证（绿/黄/红/转圈）
15. **侧边栏** → 任务悬停 → 查看/删除按钮

### 状态标识对照

| 状态 | 显示 | 含义 |
|------|------|------|
| completed | 绿点 🟢 | 已完成 |
| waiting | 黄点 🟡 | 等待中/排队 |
| error | 红点 🔴 | 报错 |
| running | 转圈 🔄 | 正在进行 |

## 对接后端

对话通过 WebSocket 或 REST API 对接 AI Agent 后端，业务数据通过 REST API。

```typescript
// src/api.ts（需要手动创建）
const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export async function sendMessage(text: string) { ... }
export async function fetchTasks() { ... }
export async function fetchTaskDetail(id: string) { ... }
```

## License

MIT
