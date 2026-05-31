import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getState, subscribe, setView } from '../state';
import type { Task } from '../types';
import { CALC_TYPE_LABELS, STATUS_LABELS } from '../types';

@customElement('task-detail-view')
export class TaskDetailView extends LitElement {
  static styles = css`
    :host { display: block; padding: var(--spacing-lg); max-width: 960px; margin: 0 auto; }

    .page-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-lg);
    }
    .back-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--color-text-secondary);
      font-size: 18px;
      padding: 4px;
      border-radius: var(--border-radius-sm);
    }
    .back-btn:hover { background: var(--color-background-tertiary); }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-md);
    }
    @media (max-width: 768px) { .detail-grid { grid-template-columns: 1fr; } }

    .card {
      background: var(--color-background-primary);
      border: 0.5px solid var(--color-border-tertiary);
      border-radius: var(--border-radius-lg);
      padding: var(--spacing-md);
    }
    .card-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-medium);
      margin-bottom: var(--spacing-sm);
      padding-bottom: var(--spacing-xs);
      border-bottom: 0.5px solid var(--color-border-tertiary);
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      border-bottom: 0.5px solid var(--color-border-tertiary);
      font-size: var(--font-size-base);
    }
    .info-row:last-child { border-bottom: none; }
    .info-label { color: var(--color-text-secondary); }
    .info-value { font-weight: var(--font-weight-medium); }

    .progress-container {
      margin: var(--spacing-md) 0;
    }
    .progress-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--spacing-xs);
      font-size: var(--font-size-sm);
    }
    .progress-bar {
      width: 100%;
      height: 8px;
      background: var(--color-border-tertiary);
      border-radius: 4px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.5s ease;
    }

    .output-files {
      margin-top: var(--spacing-sm);
    }
    .file-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: 6px 0;
      font-size: var(--font-size-sm);
      color: var(--color-accent);
      cursor: pointer;
    }
    .file-item:hover { text-decoration: underline; }

    .action-bar {
      display: flex;
      gap: var(--spacing-xs);
      margin-top: var(--spacing-md);
      grid-column: 1 / -1;
    }

    .status-section {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }
  `;

  @property({ type: Object }) task: Task | null = null;

  connectedCallback() {
    super.connectedCallback();
    subscribe(() => {
      const state = getState();
      this.task = state.tasks.find(t => t.id === state.selectedTaskId) || null;
    });
  }

  private statusColor(status: string): string {
    switch (status) {
      case 'running': return 'var(--color-status-running)';
      case 'queued': return 'var(--color-status-queued)';
      case 'failed': return 'var(--color-status-failed)';
      case 'completed': return 'var(--color-status-completed)';
      default: return 'var(--color-text-tertiary)';
    }
  }

  render() {
    if (!this.task) {
      return html`<div style="padding:var(--spacing-xl);text-align:center;color:var(--color-text-tertiary)">
        <p>任务未找到</p>
        <button class="btn btn-secondary mt-md" @click=${() => setView('tasks')}>返回任务列表</button>
      </div>`;
    }

    const t = this.task;

    return html`
      <div>
        <div class="page-header">
          <button class="back-btn" @click=${() => setView('tasks')}>←</button>
          <div>
            <div style="font-size:var(--font-size-2xl);font-weight:var(--font-weight-bold)">${t.name}</div>
            <div style="font-size:var(--font-size-sm);color:var(--color-text-secondary)">${t.id} · ${t.createdAt}</div>
          </div>
        </div>

        <div class="detail-grid">
          <!-- Status & Progress -->
          <div class="card">
            <div class="card-title">运行状态</div>
            <div class="status-section">
              <span class="status-badge ${t.status}" style="font-size:var(--font-size-base);padding:4px 14px;">
                <span class="status-dot ${t.status}" style="width:10px;height:10px"></span>
                ${STATUS_LABELS[t.status]}
              </span>
            </div>
            <div class="progress-container">
              <div class="progress-header">
                <span>进度</span>
                <span>${t.progress}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" style="width:${t.progress}%;background:${this.statusColor(t.status)}"></div>
              </div>
            </div>
            <div class="info-row"><span class="info-label">预计剩余</span><span class="info-value">${t.eta}</span></div>
          </div>

          <!-- Basic Info -->
          <div class="card">
            <div class="card-title">基本信息</div>
            <div class="info-row"><span class="info-label">计算类型</span><span class="info-value">${CALC_TYPE_LABELS[t.calcType]}</span></div>
            <div class="info-row"><span class="info-label">描述</span><span class="info-value">${t.description}</span></div>
            <div class="info-row"><span class="info-label">创建时间</span><span class="info-value">${t.createdAt}</span></div>
            ${t.completedAt ? html`<div class="info-row"><span class="info-label">完成时间</span><span class="info-value">${t.completedAt}</span></div>` : ''}
          </div>

          <!-- Parameters -->
          <div class="card">
            <div class="card-title">计算参数</div>
            <div class="info-row"><span class="info-label">力场</span><span class="info-value">${t.forceField || '-'}</span></div>
            <div class="info-row"><span class="info-label">温度</span><span class="info-value">${t.temperature ? t.temperature + ' K' : '-'}</span></div>
            <div class="info-row"><span class="info-label">压力</span><span class="info-value">${t.pressure ? t.pressure + ' bar' : '-'}</span></div>
            <div class="info-row"><span class="info-label">时间步长</span><span class="info-value">${t.timeStep ? t.timeStep + ' fs' : '-'}</span></div>
            <div class="info-row"><span class="info-label">总步数</span><span class="info-value">${t.totalSteps ? t.totalSteps.toLocaleString() : '-'}</span></div>
          </div>

          <!-- Output Files -->
          <div class="card">
            <div class="card-title">输出文件</div>
            ${t.outputFiles && t.outputFiles.length > 0
              ? html`<div class="output-files">
                  ${t.outputFiles.map(f => html`<div class="file-item">📄 ${f}</div>`)}
                </div>`
              : html`<div class="text-muted" style="font-size:var(--font-size-sm)">暂无输出文件</div>`
            }
          </div>

          <div class="action-bar">
            <button class="btn btn-primary">查看结果</button>
            <button class="btn btn-secondary">编辑参数</button>
            ${t.status === 'running' ? html`<button class="btn btn-danger">停止任务</button>` : ''}
            <button class="btn btn-secondary">导出报告</button>
            <button class="btn btn-secondary" @click=${() => setView('tasks')}>返回列表</button>
          </div>
        </div>
      </div>
    `;
  }
}
