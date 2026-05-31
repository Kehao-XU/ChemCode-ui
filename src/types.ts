// ====== 计算化学平台类型定义 ======

export type CalcType =
  | 'molecular_dynamics'
  | 'dpd'
  | 'quantum_chemistry'
  | 'dft'
  | 'monte_carlo'
  | 'machine_learning';

/** 任务状态：完成/询问/报错/进行中 */
export type TaskStatus = 'completed' | 'waiting' | 'error' | 'running';

export interface Task {
  id: string;
  name: string;
  calcType: CalcType;
  status: TaskStatus;
  description: string;
  progress?: number;
  createdAt: string;
  completedAt?: string;
  forceField?: string;
  temperature?: number;
  pressure?: number;
  timeStep?: number;
  totalSteps?: number;
  jobs?: JobStep[];
  parameters?: Record<string, string>;
  outputFiles?: string[];
}

/** 任务中的作业步骤 */
export interface JobStep {
  name: string;
  status: TaskStatus;
  detail?: string;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: string;
  files?: GeneratedFile[];
  code?: string;
}

/** 生成的文件块 */
export interface GeneratedFile {
  name: string;
  type: string;
  size?: string;
  content?: string;
}

export interface KnowledgeEntry {
  id: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  updatedAt: string;
}

export interface SkillEntry {
  id: string;
  name: string;
  description: string;
  version: string;
  installed: boolean;
  author?: string;
  downloads?: number;
}

export interface ConfiguredModel {
  name: string;
  apiUrl: string;
  apiKey: string;
  supportsContext: boolean;
  provider: string;
}

/** 设置界面左侧Tab */
export type SettingsTab = 'account' | 'system' | 'models' | 'help';

export type PageView =
  | 'chat'
  | 'task-detail'
  | 'knowledge'
  | 'skills'
  | 'settings';

export type ThemeMode = 'light' | 'dark';
export type Lang = 'zh' | 'en';

export const CALC_TYPE_LABELS: Record<CalcType, string> = {
  molecular_dynamics: '分子动力学',
  dpd: 'DPD',
  quantum_chemistry: '量子化学',
  dft: 'DFT',
  monte_carlo: '蒙特卡洛',
  machine_learning: '机器学习',
};

export const STATUS_LABELS: Record<TaskStatus, string> = {
  completed: '已完成',
  waiting: '等待中',
  error: '出错',
  running: '进行中',
};
