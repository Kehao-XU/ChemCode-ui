import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getState, subscribe, selectTask } from '../state';
import type { Task } from '../types';
import { CALC_TYPE_LABELS, STATUS_LABELS } from '../types';

@customElement('dashboard-view')
export class DashboardView extends LitElement {
  static styles = css`
    :host { display: block; padding: var(--spacing-lg); max-width: 1280px; margin: 0 auto; }
    .page-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      margin-bottom: var(--spacing-lg);
      color: var(--color-text-primary);
    }
    .page-subtitle {
      font-size: var(--font-size-base);
      color: var(--color-text-secondary);
      margin-top: -12px;
      margin-bottom: var(--spacing-lg);
    }

    /* Status cards grid */
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
    }
    @media (max-width: 900px) {
      .cards-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 500px) {
      .cards-grid { grid-template-columns: 1fr; }
    }

    .stat-card {
      background: var(--color-background-primary);
      border: 0.5px solid var(--color-border-tertiary);
      border-radius: var(--border-radius-lg);
      padding: var(--spacing-md);
    }
    .stat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--spacing-xs);
    }
    .stat-icon {
      width: 36px; height: 36px;
      border-radius: var(--border-radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }
    .stat-value {
      font-size: 28px;
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      line-height: 1.2;
    }
    .stat-label {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }
    .stat-footer {
      font-size: var(--font-size-xs);
      color: var(--color-text-tertiary);
      margin-top: var(--spacing-xs);
    }
    .online { color: var(--color-text-success); }
    .degraded { color: var(--color-text-warning); }
    .offline { color: var(--color-text-danger); }

    /* Section */
    .section-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-medium);
      margin-bottom: var(--spacing-sm);
      color: var(--color-text-primary);
    }

    /* Running tasks */
    .task-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
    }

    .task-card {
      background: var(--color-background-primary);
      border: 0.5px solid var(--color-border-tertiary);
      border-radius: var(--border-radius-lg);
      padding: var(--spacing-md);
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .task-card:hover {
      border-color: var(--color-border-info);
      box-shadow: var(--shadow-sm);
    }
    .task-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--spacing-sm);
    }
    .task-name {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .task-type {
      font-size: var(--font-size-xs);
      color: var(--color-text-tertiary);
      margin-bottom: var(--spacing-xs);
    }
    .progress-bar {
      width: 100%;
      height: 4px;
      background: var(--color-border-tertiary);
      border-radius: 2px;
      overflow: hidden;
      margin: var(--spacing-xs) 0;
    }
    .progress-fill {
      height: 100%;
      border-radius: 2px;
      transition: width 0.5s ease;
    }
    .progress-fill.running { background: var(--color-status-running); }
    .progress-fill.queued { background: var(--color-status-queued); }
    .progress-fill.failed { background: var(--color-status-failed); }
    .progress-fill.completed { background: var(--color-status-completed); }
    .task-meta {
      display: flex;
      justify-content: space-between;
      font-size: var(--font-size-xs);
      color: var(--color-text-tertiary);
      margin-top: var(--spacing-xs);
    }

    /* Recent tasks list */
    .recent-list {
      background: var(--color-background-primary);
      border: 0.5px solid var(--color-border-tertiary);
      border-radius: var(--border-radius-lg);
      overflow: hidden;
    }
    .recent-item {
      display: flex;
      align-items: center;
      padding: var(--spacing-sm) var(--spacing-md);
      border-bottom: 0.5px solid var(--color-border-tertiary);
      cursor: pointer;
      transition: background var(--transition-fast);
      gap: var(--spacing-sm);
    }
    .recent-item:last-child { border-bottom: none; }
    .recent-item:hover { background: var(--color-background-secondary); }
    .recent-name { flex: 1; font-size: var(--font-size-base); }
    .recent-type { font-size: var(--font-size-xs); color: var(--color-text-tertiary); width: 100px; }
    .recent-time { font-size: var(--font-size-xs); color: var(--color-text-tertiary); width: 140px; }
    .recent-actions {
      display: flex;
      gap: 4px;
    }
    .action-btn {
      padding: 4px 8px;
      border: none;
      background: transparent;
      border-radius: var(--border-radius-sm);
      color: var(--color-text-secondary);
      cursor: pointer;
      font-size: var(--font-size-xs);
    }
    .action-btn:hover { background: var(--color-background-tertiary); color: var(--color-accent); }
  `;

  @property({ type: Object }) tasks: Task[] = [];

  connectedCallback() {
    super.connectedCallback();
    subscribe(() => {
      this.tasks = getState().tasks;
    });
  }

  private statusColor(status: string) {
    switch (status) {
      case 'running': return 'var(--color-status-running)';
      case 'queued': return 'var(--color-status-queued)';
      case 'failed': return 'var(--color-status-failed)';
      case 'completed': return 'var(--color-status-completed)';
      default: return 'var(--color-text-tertiary)';
    }
  }

  render() {
    const state = getState();
    const dash = state.dashboard;
    const runningTasks = state.tasks.filter(t => t.status === 'running' || t.status === 'queued');

    return html`
      <div>
        <div class="page-title">仪表板</div>
        <div class="page-subtitle">计算化学AI Agent平台 · 总览当前状态</div>

        <!-- Status Cards -->
        <div class="cards-grid">
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon" style="background:var(--color-background-info)">🔬</div>
            </div>
            <div class="stat-value">${dash.activeTasks}</div>
            <div class="stat-label">活跃计算任务</div>
            <div class="stat-footer">其中 ${runningTasks.filter(t=>t.status==='running').length} 个正在运行</div>
          </div>
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon" style="background:var(--color-background-success)">✅</div>
            </div>
            <div class="stat-value">${dash.completedToday}</div>
            <div class="stat-label">今日完成</div>
            <div class="stat-footer">较昨日 +2</div>
          </div>
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon" style="background:var(--color-background-warning)">📚</div>
            </div>
            <div class="stat-value">${dash.knowledgeEntries}</div>
            <div class="stat-label">知识库条目</div>
            <div class="stat-footer">本周新增 5 条</div>
          </div>
          <div class="stat-card">
            <div class="stat-header">
              <div class="stat-icon" style="background:var(--color-background-info)">⚡</div>
            </div>
            <div class="stat-value ${dash.systemStatus}">${dash.systemStatus === 'online' ? '在线' : dash.systemStatus === 'degraded' ? '降级' : '离线'}</div>
            <div class="stat-label">系统状态</div>
            <div class="stat-footer">服务正常运行中</div>
          </div>
        </div>

        <!-- Running Tasks -->
        <div class="section-title">计算任务状态</div>
        <div class="task-grid">
          ${runningTasks.length === 0
            ? html`<div class="text-muted" style="grid-column:1/-1;padding:var(--spacing-lg) 0;text-align:center;">暂无活跃任务</div>`
            : runningTasks.map(t => html`
              <div class="task-card" @click=${() => selectTask(t.id)}>
                <div class="task-card-header">
                  <span class="task-name">${t.name}</span>
                  <span class="status-badge ${t.status}">
                    <span class="status-dot ${t.status}"></span>
                    ${STATUS_LABELS[t.status]}
                  </span>
                </div>
                <div class="task-type">${CALC_TYPE_LABELS[t.calcType]}</div>
                <div class="progress-bar">
                  <div class="progress-fill ${t.status}" style="width:${t.progress}%"></div>
                </div>
                <div class="task-meta">
                  <span>${t.progress}%</span>
                  <span>${t.eta}</span>
                </div>
              </div>
            `)}
        </div>

        <!-- Recent Tasks -->
        <div class="section-title">最近任务</div>
        <div class="recent-list">
          ${state.tasks.slice(0, 5).map(t => html`
            <div class="recent-item" @click=${() => selectTask(t.id)}>
              <span class="status-dot ${t.status}"></span>
              <span class="recent-name">${t.name}</span>
              <span class="recent-type">${CALC_TYPE_LABELS[t.calcType]}</span>
              <span class="status-badge ${t.status}" style="padding:0 6px;font-size:11px;">
                ${STATUS_LABELS[t.status]}
              </span>
              <span class="recent-time">${t.createdAt}</span>
              <div class="recent-actions">
                <button class="action-btn" @click=${(e: Event) => { e.stopPropagation(); selectTask(t.id); }}>查看</button>
                <button class="action-btn" @click=${(e: Event) => e.stopPropagation()}>编辑</button>
                <button class="action-btn" @click=${(e: Event) => e.stopPropagation()} style="color:var(--color-text-danger)">删除</button>
              </div>
            </div>
          `)}
        </div>
      </div>
    `;
  }
}
