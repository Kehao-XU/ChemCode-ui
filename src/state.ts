import type { DashboardStats, Task, KnowledgeEntry, ChatMessage, PageView } from './types';

export interface AppState {
  currentView: PageView;
  selectedTaskId: string | null;
  selectedKnowledgeId: string | null;
  sidebarCollapsed: boolean;
  searchQuery: string;

  dashboard: DashboardStats;
  tasks: Task[];
  knowledge: KnowledgeEntry[];
  chatMessages: ChatMessage[];
}

type Listener = () => void;

const listeners = new Set<Listener>();

let state: AppState = {
  currentView: 'dashboard',
  selectedTaskId: null,
  selectedKnowledgeId: null,
  sidebarCollapsed: false,
  searchQuery: '',

  dashboard: {
    activeTasks: 3,
    completedToday: 12,
    knowledgeEntries: 48,
    systemStatus: 'online',
  },

  tasks: [
    {
      id: 'T-001',
      name: '蛋白酶A分子动力学模拟',
      calcType: 'molecular_dynamics',
      status: 'running',
      description: '对蛋白酶A进行50ns分子动力学模拟',
      progress: 65,
      eta: '约2小时',
      createdAt: '2026-05-31 09:15',
      forceField: 'AMBER',
      temperature: 310,
      pressure: 1,
      timeStep: 2,
      totalSteps: 25000000,
    },
    {
      id: 'T-002',
      name: '高分子聚合物DPD模拟',
      calcType: 'dpd',
      status: 'queued',
      description: '嵌段共聚物自组装行为模拟',
      progress: 0,
      eta: '等待中',
      createdAt: '2026-05-31 10:30',
      forceField: 'COMPASS',
      temperature: 298,
    },
    {
      id: 'T-003',
      name: '过渡态能垒计算',
      calcType: 'quantum_chemistry',
      status: 'completed',
      description: 'SN2反应过渡态结构优化与能垒计算',
      progress: 100,
      eta: '已完成',
      createdAt: '2026-05-30 14:00',
      completedAt: '2026-05-30 18:23',
    },
    {
      id: 'T-004',
      name: 'MOF材料气体吸附DFT计算',
      calcType: 'dft',
      status: 'failed',
      description: 'CO2在ZIF-8中的吸附能计算',
      progress: 23,
      eta: '计算错误',
      createdAt: '2026-05-30 11:20',
    },
    {
      id: 'T-005',
      name: '配体结合自由能计算',
      calcType: 'monte_carlo',
      status: 'running',
      description: '药物分子与靶点蛋白结合自由能评估',
      progress: 42,
      eta: '约4小时',
      createdAt: '2026-05-31 08:00',
    },
  ],

  knowledge: [
    {
      id: 'K-001',
      title: '分子动力学模拟力场选择指南',
      category: '参数设置规则',
      tags: ['力场', 'MD', '参数选择'],
      content: '力场选择是分子动力学模拟的关键步骤。不同体系需要选择不同的力场：\n\n- **蛋白质/核酸**：推荐AMBER或CHARMM力场\n- **脂质膜**：推荐CHARMM36\n- **聚合物**：推荐OPLS或COMPASS\n- **小分子**：推荐GAFF或CGenFF\n\n力场的选择直接影响模拟结果的准确性，建议根据文献和验证结果确定。',
      codeExample: '# GROMACS力场选择示例\n; 选择AMBER99SB-ILDN力场\n[ defaults ]\nnbfunc        = 1\ncomb-rule     = 2\ngen-pairs     = yes\nfudgeLJ       = 0.5\nfudgeQQ       = 0.5\n',
      notes: '力场参数文件需与模拟体系匹配，避免混用不同力场',
      createdAt: '2026-05-15',
    },
    {
      id: 'K-002',
      title: '计算库调用规范 - GROMACS',
      category: '计算库使用指南',
      tags: ['GROMACS', 'MD模拟', '命令行'],
      content: 'GROMACS是最常用的分子动力学软件之一。基本调用流程：\n\n1. **预处理**：`gmx pdb2gmx -f input.pdb -o processed.gro`\n2. **定义盒子**：`gmx editconf -f processed.gro -o box.gro -c -d 1.0`\n3. **溶剂化**：`gmx solvate -cp box.gro -cs spc216.gro -o solvated.gro`\n4. **离子中和**：`gmx genion`\n5. **能量最小化**：`gmx mdrun -deffnm em`\n6. **平衡**：NVT和NPT平衡\n7. **生产模拟**：`gmx mdrun -deffnm md`',
      codeExample: '# GROMACS完整运行脚本示例\n#!/bin/bash\n# 预处理\ngmx pdb2gmx -f protein.pdb -o protein.gro -ff amber99sb-ildn -water tip3p\n# 定义盒子\ngmx editconf -f protein.gro -o box.gro -c -d 1.0 -bt cubic\n# 溶剂化\ngmx solvate -cp box.gro -cs spc216.gro -o solvated.gro -p topol.top\n# 能量最小化\ngmx grompp -f em.mdp -c solvated.gro -p topol.top -o em.tpr\ngmx mdrun -deffnm em\n',
      createdAt: '2026-05-10',
    },
    {
      id: 'K-003',
      title: '常见计算参数设置规则',
      category: '参数设置规则',
      tags: ['参数', '温度', '压力', '时间步长'],
      content: '分子动力学模拟的关键参数设置：\n\n### 温度设置\n- 蛋白质体系：310K（人体温度）\n- 室温体系：298K\n- 聚合物体系：根据Tg设定\n\n### 压力设置\n- 标准大气压：1 bar\n- 高压模拟：100-1000 bar\n\n### 时间步长\n- 刚性键约束：2 fs\n- 柔性键：0.5-1 fs\n- 粗粒化：5-10 fs\n\n### 总模拟时间\n- 蛋白质折叠：μs级\n- 配体结合：ns-μs级\n- 聚合物平衡：10-100 ns',
      createdAt: '2026-05-12',
    },
    {
      id: 'K-004',
      title: '学术论文中模拟部分的写作规范',
      category: '学术规范',
      tags: ['论文写作', '学术规范', '数据报告'],
      content: '计算化学论文中模拟部分应包含以下信息：\n\n1. **软件版本**：注明使用的模拟软件及版本号\n2. **力场参数**：详细说明力场选择及参数来源\n3. **模拟条件**：温度、压力、时间步长等\n4. **平衡过程**：能量最小化和平衡模拟步骤\n5. **统计分析**：误差分析和置信区间\n6. **数据可用性**：原始数据和参数文件存放位置',
      codeExample: '## 计算方法\n分子动力学模拟使用 GROMACS 2024.3 软件包进行。\n体系采用 AMBER99SB-ILDN 力场描述，水分子模型使用 TIP3P。\n在 NPT 系综下进行 100 ns 生产模拟，温度控制在 310 K（使用 V-rescale 控温器），\n压力控制在 1 bar（使用 Parrinello-Rahman 控压器）。\n时间步长设置为 2 fs，每 10 ps 保存一次轨迹。',
      createdAt: '2026-05-08',
    },
    {
      id: 'K-005',
      title: 'Python MDAnalysis轨迹分析示例',
      category: '示例代码',
      tags: ['Python', '轨迹分析', 'MDAnalysis', '代码'],
      content: '使用MDAnalysis库进行分子动力学轨迹分析的基本模板：',
      codeExample: 'import MDAnalysis as mda\nimport numpy as np\nimport matplotlib.pyplot as plt\n\n# 加载轨迹\nu = mda.Universe("topol.tpr", "traj.xtc")\n\n# 计算RMSD\nfrom MDAnalysis.analysis import rms\n\nrmsd_analysis = rms.RMSD(u, select="backbone")\nrmsd_analysis.run()\n\n# 绘制RMSD\nplt.plot(rmsd_analysis.results.rmsd[:, 1], rmsd_analysis.results.rmsd[:, 2])\nplt.xlabel("Time (ps)")\nplt.ylabel("RMSD (nm)")\nplt.title("Backbone RMSD")\nplt.show()\n\n# 计算氢键\nfrom MDAnalysis.analysis import hbonds\n\nhb = hbonds.HydrogenBondAnalysis(\n    universe=u,\n    donors_sel="protein",\n    hydrogens_sel="protein",\n    acceptors_sel="protein",\n)\nhb.run()\nprint(f"Average hydrogen bonds: {hb.results.counts.mean():.1f}")',
      createdAt: '2026-05-20',
    },
  ],

  chatMessages: [
    {
      id: 'sys-1',
      type: 'system',
      content: '欢迎使用 ChemCode 计算化学AI Agent！您可以提问计算化学相关问题，或直接描述您需要的模拟任务。',
      timestamp: '09:00',
    },
  ],
};

export function getState(): AppState {
  return state;
}

export function updateState(partial: Partial<AppState>): void {
  state = { ...state, ...partial };
  listeners.forEach((fn) => fn());
}

export function setView(view: PageView): void {
  updateState({ currentView: view, selectedTaskId: null, selectedKnowledgeId: null });
}

export function selectTask(id: string): void {
  updateState({ currentView: 'task-detail', selectedTaskId: id });
}

export function selectKnowledge(id: string): void {
  updateState({ currentView: 'knowledge-detail', selectedKnowledgeId: id });
}

export function toggleSidebar(): void {
  updateState({ sidebarCollapsed: !state.sidebarCollapsed });
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getTask(id: string): Task | undefined {
  return state.tasks.find((t) => t.id === id);
}

export function getKnowledge(id: string): KnowledgeEntry | undefined {
  return state.knowledge.find((k) => k.id === id);
}

export function addChatMessage(msg: ChatMessage): void {
  updateState({ chatMessages: [...state.chatMessages, msg] });
}
