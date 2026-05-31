import type {
  ChatMessage, Task, KnowledgeEntry, SkillEntry,
  ConfiguredModel, PageView, SettingsTab, ThemeMode, Lang
} from './types';

export interface AppState {
  currentView: PageView;
  selectedTaskId: string | null;
  sidebarCollapsed: boolean;
  settingsTab: SettingsTab;

  tasks: Task[];
  knowledge: KnowledgeEntry[];
  skills: SkillEntry[];
  chatMessages: ChatMessage[];
  configuredModels: ConfiguredModel[];

  // Settings
  theme: ThemeMode;
  language: Lang;
  fontSize: number;
}

type Listener = () => void;
const listeners = new Set<Listener>();

let state: AppState = {
  currentView: 'chat',
  selectedTaskId: null,
  sidebarCollapsed: false,
  settingsTab: 'account',

  tasks: [
    {
      id: 'T-001',
      name: '蛋白酶A分子动力学',
      calcType: 'molecular_dynamics',
      status: 'running',
      description: '50ns MD模拟',
      progress: 65,
      createdAt: '09:15',
      forceField: 'AMBER',
      temperature: 310,
      pressure: 1,
      jobs: [
        { name: '能量最小化', status: 'completed' },
        { name: 'NVT平衡', status: 'completed' },
        { name: 'NPT平衡', status: 'completed' },
        { name: '生产模拟', status: 'running', detail: '65% · 预计2h' },
      ],
    },
    {
      id: 'T-002',
      name: '聚合物DPD模拟',
      calcType: 'dpd',
      status: 'waiting',
      description: '嵌段共聚物自组装',
      createdAt: '10:30',
      jobs: [
        { name: '预处理', status: 'waiting' },
      ],
    },
    {
      id: 'T-003',
      name: '过渡态能垒计算',
      calcType: 'quantum_chemistry',
      status: 'completed',
      description: 'SN2过渡态优化',
      createdAt: '14:00',
      completedAt: '18:23',
      outputFiles: ['transition_state.xyz', 'energy_profile.txt'],
    },
    {
      id: 'T-004',
      name: 'MOF吸附能计算',
      calcType: 'dft',
      status: 'error',
      description: 'CO₂在ZIF-8吸附',
      createdAt: '11:20',
      jobs: [
        { name: '结构优化', status: 'completed' },
        { name: 'SCF计算', status: 'error', detail: '收敛失败 - SCF不收敛' },
      ],
    },
    {
      id: 'T-005',
      name: '配体结合自由能',
      calcType: 'monte_carlo',
      status: 'running',
      description: '药物-靶点结合评估',
      progress: 42,
      createdAt: '08:00',
      jobs: [
        { name: '准备配体', status: 'completed' },
        { name: '准备受体', status: 'completed' },
        { name: '采样计算', status: 'running', detail: '42% · 预计4h' },
      ],
    },
  ],

  knowledge: [
    {
      id: 'K-001',
      title: 'GROMACS 入门指南',
      category: '计算库',
      tags: ['GROMACS', '入门'],
      content: '## 安装\n```bash\nwget http://ftp.gromacs.org/gromacs/gromacs-2024.3.tar.gz\ntar xf gromacs-2024.3.tar.gz\ncd gromacs-2024.3\nmkdir build && cd build\ncmake .. -DGMX_BUILD_OWN_FFTW=ON\nmake -j4\nmake install\n```\n\n## 运行\n`gmx mdrun -deffnm md`',
      updatedAt: '2026-05-20',
    },
    {
      id: 'K-002',
      title: '力场选择指南',
      category: '参数设置',
      tags: ['力场', 'AMBER', 'CHARMM'],
      content: '| 体系类型 | 推荐力场 |\n|---------|--------|\n| 蛋白质 | AMBER99SB-ILDN / CHARMM36 |\n| 脂质膜 | CHARMM36 |\n| 聚合物 | OPLS / COMPASS |\n| 小分子 | GAFF / CGenFF |',
      updatedAt: '2026-05-15',
    },
    {
      id: 'K-003',
      title: '常见错误解决',
      category: 'FAQ',
      tags: ['错误', '调试'],
      content: '### LINCS 失败\n- 减小时间步长\n- 检查初始结构\n\n### SCF 不收敛\n- 增加 SCF 迭代次数\n- 使用更小的混合因子',
      updatedAt: '2026-05-10',
    },
  ],

  skills: [
    { id: 'S-001', name: 'GROMACS 自动脚本', description: '自动生成GROMACS运行脚本', version: '1.2.0', installed: true, author: 'ChemCode', downloads: 128 },
    { id: 'S-002', name: '分子结构验证', description: '上传结构文件自动检查合理性', version: '0.9.0', installed: true, author: 'ChemCode', downloads: 92 },
    { id: 'S-003', name: '轨迹分析工具集', description: 'RMSD、RDF、氢键等分析', version: '2.0.0', installed: false, author: 'Community', downloads: 356 },
    { id: 'S-004', name: 'VASP 输入生成', description: '生成VASP计算输入文件', version: '1.0.0', installed: false, author: 'Community', downloads: 67 },
  ],

  configuredModels: [
    { name: 'DeepSeek-V4', apiUrl: 'https://api.deepseek.com', apiKey: 'sk-***', supportsContext: true, provider: 'deepseek' },
    { name: 'GPT-4o', apiUrl: 'https://api.openai.com', apiKey: 'sk-***', supportsContext: true, provider: 'openai' },
  ],

  chatMessages: [
    {
      id: 'sys-1',
      type: 'system',
      content: '欢迎使用 ChemCode！我可以帮你完成计算化学任务，随时开始对话。',
      timestamp: '09:00',
    },
    {
      id: 'msg-1',
      type: 'user',
      content: '帮我做蛋白质A的分子动力学模拟，用AMBER力场',
      timestamp: '09:01',
    },
    {
      id: 'msg-2',
      type: 'agent',
      content: '好的，我将为你准备蛋白质A的分子动力学模拟。\n\n**模拟方案：**\n- 力场：AMBER99SB-ILDN\n- 溶剂：TIP3P水模型\n- 温度：310K\n- 模拟时间：50ns\n\n我先进行能量最小化步骤。',
      timestamp: '09:01',
      files: [
        { name: 'em.mdp', type: 'mdp', size: '1.2KB' },
        { name: 'nvt.mdp', type: 'mdp', size: '1.5KB' },
        { name: 'npt.mdp', type: 'mdp', size: '1.5KB' },
        { name: 'md.mdp', type: 'mdp', size: '1.3KB' },
      ],
    },
    {
      id: 'msg-3',
      type: 'system',
      content: '检测到结构文件键长异常，建议检查PDB文件',
      timestamp: '09:02',
    },
  ],

  theme: 'light',
  language: 'zh',
  fontSize: 14,
};

export function getState(): AppState {
  return state;
}

export function updateState(partial: Partial<AppState>): void {
  state = { ...state, ...partial };
  listeners.forEach((fn) => fn());
}

export function setView(view: PageView): void {
  updateState({ currentView: view, selectedTaskId: null });
}

export function selectTask(id: string): void {
  updateState({ currentView: 'task-detail', selectedTaskId: id });
}

export function toggleSidebar(): void {
  updateState({ sidebarCollapsed: !state.sidebarCollapsed });
}

export function setThemeMode(mode: ThemeMode): void {
  updateState({ theme: mode });
  document.documentElement.setAttribute('data-theme', mode);
}

export function setLanguage(lang: Lang): void {
  updateState({ language: lang });
}

export function setFontSize(size: number): void {
  updateState({ fontSize: size });
}

export function setSettingsTab(tab: SettingsTab): void {
  updateState({ settingsTab: tab });
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

export function toggleSkill(id: string): void {
  const skills = state.skills.map(s =>
    s.id === id ? { ...s, installed: !s.installed } : s
  );
  updateState({ skills });
}

export function addModel(model: ConfiguredModel): void {
  updateState({ configuredModels: [...state.configuredModels, model] });
}

export function removeModel(name: string): void {
  updateState({ configuredModels: state.configuredModels.filter(m => m.name !== name) });
}
