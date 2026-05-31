// ====== 计算化学平台类型定义 ======

export type CalcType =
  | 'molecular_dynamics'
  | 'dpd'
  | 'quantum_chemistry'
  | 'dft'
  | 'monte_carlo'
  | 'machine_learning';

export type TaskStatus = 'running' | 'queued' | 'failed' | 'completed';

export interface Task {
  id: string;
  name: string;
  calcType: CalcType;
  status: TaskStatus;
  description: string;
  progress: number;
  eta: string;
  createdAt: string;
  completedAt?: string;
  moleculeFile?: string;
  forceField?: string;
  temperature?: number;
  pressure?: number;
  timeStep?: number;
  totalSteps?: number;
  outputFiles?: string[];
}

export interface KnowledgeEntry {
  id: string;
  title: string;
  category: string;
  tags: string[];
  content: string;
  codeExample?: string;
  notes?: string;
  relatedIds?: string[];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: string;
  code?: string;
}

export interface DashboardStats {
  activeTasks: number;
  completedToday: number;
  knowledgeEntries: number;
  systemStatus: 'online' | 'degraded' | 'offline';
}

export type PageView =
  | 'dashboard'
  | 'tasks'
  | 'create-task'
  | 'task-detail'
  | 'knowledge'
  | 'knowledge-detail'
  | 'code-gen'
  | 'results'
  | 'chat';

export const CALC_TYPE_LABELS: Record<CalcType, string> = {
  molecular_dynamics: '分子动力学',
  dpd: 'DPD耗散粒子动力学',
  quantum_chemistry: '量子化学',
  dft: 'DFT密度泛函理论',
  monte_carlo: '蒙特卡洛',
  machine_learning: '机器学习',
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  running: '运行中',
  queued: '排队中',
  failed: '失败',
  completed: '已完成',
};

export const KNOWLEDGE_CATEGORIES = [
  '学术规范',
  '计算库使用指南',
  '参数设置规则',
  '常见问题解答',
  '示例代码',
];

export const FORCE_FIELD_OPTIONS = ['AMBER', 'CHARMM', 'OPLS', 'GROMOS', 'COMPASS'];
