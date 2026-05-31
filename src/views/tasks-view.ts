import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getState, subscribe, selectTask, setView } from '../state';
import type { Task } from '../types';
import { CALC_TYPE_LABELS, STATUS_LABELS } from '../types';

@customElement('tasks-view')
export class TasksView extends LitElement {
  static styles = css`
    :host { display: block; padding: var(--spacing-lg); max-width: 1280px; margin: 0 auto; }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--spacing-lg);
    }
    .page-title { font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); }
    .toolbar {
      display: flex;
      gap: var(--spacing-xs);
      align-items: center;
    }

    .table-wrapper {
      background: var(--color-background-primary);
      border: 0.5px solid var(--color-border-tertiary);
      border-radius: var(--border-radius-lg);
      overflow: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: var(--font-size-base);
    }
    th {
      text-align: left;
      padding: 10px var(--spacing-md);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-secondary);
      border-bottom: 0.5px solid var(--color-border-secondary);
      background: var(--color-background-secondary);
      white-space: nowrap;
    }
    td {
      padding: 10px var(--spacing-md);
      border-bottom: 0.5px solid var(--color-border-tertiary);
      color: var(--color-text-primary);
    }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: var(--color-background-secondary); }
    tr { cursor: pointer; }

    .task-id {
      font-family: var(--font-mono);
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }
    .task-name-cell {
      font-weight: var(--font-weight-medium);
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .actions-cell {
      display: flex;
      gap: 4px;
    }
    .empty {
      text-align: center;
      padding: var(--spacing-xl);
      color: var(--color-text-tertiary);
    }
    .filter-bar {
      display: flex;
      gap: var(--spacing-sm);
      align-items: center;
      flex-wrap: wrap;
    }
  `;

  @property({ type: Array }) tasks: Task[] = [];
  @property({ type: String }) filterStatus = 'all';

  connectedCallback() {
    super.connectedCallback();
    subscribe(() => {
      this.tasks = getState().tasks;
    });
  }

  private get filtered(): Task[] {
    if (this.filterStatus === 'all') return this.tasks;
    return this.tasks.filter(t => t.status === this.filterStatus);
  }

  render() {
    return html`
      <div>
        <div class="page-header">
          <div class="page-title">任务管理</div>
          <div class="toolbar">
            <select class="input select" style="width:auto;padding:6px 28px 6px 10px;font-size:var(--font-size-sm);"
              .value=${this.filterStatus}
              @change=${(e: Event) => this.filterStatus = (e.target as HTMLSelectElement).value}>
              <option value="all">全部状态</option>
              <option value="running">运行中</option>
              <option value="queued">排队中</option>
              <option value="completed">已完成</option>
              <option value="failed">失败</option>
            </select>
            <button class="btn btn-primary" @click=${() => setView('create-task')}>+ 创建任务</button>
          </div>
        </div>

        <div class="table-wrapper">
          ${this.filtered.length === 0
            ? html`<div class="empty">暂无任务</div>`
            : html`
            <table>
              <thead>
                <tr>
                  <th>任务ID</th>
                  <th>任务名称</th>
                  <th>计算类型</th>
                  <th>状态</th>
                  <th>创建时间</th>
                  <th>完成时间</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                ${this.filtered.map(t => html`
                  <tr @click=${() => selectTask(t.id)}>
                    <td><span class="task-id">${t.id}</span></td>
                    <td><div class="task-name-cell">${t.name}</div></td>
                    <td>${CALC_TYPE_LABELS[t.calcType]}</td>
                    <td>
                      <span class="status-badge ${t.status}">
                        <span class="status-dot ${t.status}"></span>
                        ${STATUS_LABELS[t.status]}
                      </span>
                    </td>
                    <td style="font-size:var(--font-size-sm);color:var(--color-text-secondary)">${t.createdAt}</td>
                    <td style="font-size:var(--font-size-sm);color:var(--color-text-secondary)">${t.completedAt || '-'}</td>
                    <td @click=${(e:Event) => e.stopPropagation()}>
                      <div class="actions-cell">
                        <button class="btn btn-sm btn-ghost">查看</button>
                        <button class="btn btn-sm btn-ghost">编辑</button>
                        <button class="btn btn-sm btn-ghost" style="color:var(--color-text-danger)">删除</button>
                      </div>
                    </td>
                  </tr>
                `)}
              </tbody>
            </table>
          `}
        </div>
      </div>
    `;
  }
}
