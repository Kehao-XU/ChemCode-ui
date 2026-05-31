import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getState, subscribe, setView, selectTask } from '../state';
import type { PageView, Task } from '../types';
import { CALC_TYPE_LABELS } from '../types';

interface NavItem {
  view: PageView;
  label: string;
  labelEn: string;
}

const NAV_ITEMS: NavItem[] = [
  { view: 'chat', label: '新建任务', labelEn: 'New Task' },
  { view: 'skills', label: 'Skills', labelEn: 'Skills' },
  { view: 'knowledge', label: '个人知识库', labelEn: 'Wiki' },
  { view: 'settings', label: '设置', labelEn: 'Settings' },
];

@customElement('chemcode-sidebar')
export class Sidebar extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      width: var(--sidebar-width);
      background: var(--color-background-primary);
      border-right: 0.5px solid var(--color-border-tertiary);
      height: calc(100vh - var(--navbar-height));
      flex-shrink: 0;
      transition: width var(--transition-normal);
      overflow: hidden;
    }
    :host(.collapsed) {
      width: var(--sidebar-collapsed-width);
    }
    .nav-section {
      padding: var(--spacing-sm);
      flex-shrink: 0;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      border-radius: var(--border-radius-md);
      cursor: pointer;
      color: var(--color-text-secondary);
      font-size: var(--font-size-base);
      transition: all var(--transition-fast);
      white-space: nowrap;
    }
    .nav-item:hover { background: var(--color-background-tertiary); color: var(--color-text-primary); }
    .nav-item.active { background: var(--color-accent-light); color: var(--color-accent); font-weight: var(--font-weight-medium); }

    .divider {
      height: 0.5px;
      background: var(--color-border-tertiary);
      margin: var(--spacing-xs) var(--spacing-sm);
      flex-shrink: 0;
    }

    /* Search */
    .search-area { padding: var(--spacing-xxs) var(--spacing-sm) 0; flex-shrink: 0; }
    .search-input {
      width: 100%;
      padding: 6px 10px;
      border: 0.5px solid var(--color-border-tertiary);
      border-radius: 6px;
      background: var(--color-background-secondary);
      font-size: var(--font-size-sm);
      outline: none;
      box-sizing: border-box;
    }
    .search-input:focus { border-color: var(--color-border-info); }

    /* Task label */
    .task-label {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-xs) var(--spacing-sm);
      font-size: var(--font-size-xs);
      color: var(--color-text-tertiary);
      font-weight: var(--font-weight-medium);
      flex-shrink: 0;
    }

    /* Task list */
    .task-list {
      flex: 1;
      overflow-y: auto;
      padding: 0 var(--spacing-sm) var(--spacing-sm);
    }
    .task-item {
      display: flex;
      gap: 10px;
      padding: 8px 10px;
      border-radius: var(--border-radius-md);
      cursor: pointer;
      transition: background var(--transition-fast);
      align-items: flex-start;
    }
    .task-item:hover { background: var(--color-background-tertiary); }
    .task-item.active { background: var(--color-accent-light); }

    .status-icon {
      flex-shrink: 0;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 1px;
    }
    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .status-dot.completed { background: var(--color-status-completed); }
    .status-dot.waiting { background: var(--color-status-queued); }
    .status-dot.error { background: var(--color-status-failed); }
    @keyframes spin { to { transform: rotate(360deg); } }
    .spinner {
      width: 12px;
      height: 12px;
      border: 2px solid var(--color-border-tertiary);
      border-top-color: var(--color-accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .task-info { flex: 1; min-width: 0; }
    .task-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .task-meta {
      font-size: var(--font-size-xs);
      color: var(--color-text-tertiary);
      margin-top: 2px;
    }
    .task-actions {
      display: flex;
      gap: 2px;
      flex-shrink: 0;
      opacity: 0;
      transition: opacity var(--transition-fast);
    }
    .task-item:hover .task-actions { opacity: 1; }
    .action-btn {
      width: 22px;
      height: 22px;
      border: none;
      background: transparent;
      border-radius: var(--border-radius-sm);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      color: var(--color-text-tertiary);
    }
    .action-btn:hover { background: var(--color-background-tertiary); color: var(--color-text-primary); }
    .action-btn.danger:hover { color: var(--color-text-danger); }

    .no-tasks {
      padding: var(--spacing-lg);
      text-align: center;
      color: var(--color-text-tertiary);
      font-size: var(--font-size-sm);
    }

    :host(.collapsed) .nav-label,
    :host(.collapsed) .nav-item span,
    :host(.collapsed) .search-area,
    :host(.collapsed) .task-label,
    :host(.collapsed) .task-info,
    :host(.collapsed) .task-actions,
    :host(.collapsed) .no-tasks { display: none; }
    :host(.collapsed) .nav-item { justify-content: center; padding: 8px; }
    :host(.collapsed) .task-item { justify-content: center; }
  `;

  @property({ type: String }) currentView: PageView = 'chat';
  @property({ type: Boolean }) collapsed = false;
  @property({ type: Array }) tasks: Task[] = [];
  @property({ type: String }) searchQuery = '';

  connectedCallback() {
    super.connectedCallback();
    subscribe(() => {
      const s = getState();
      this.currentView = s.currentView;
      this.collapsed = s.sidebarCollapsed;
      this.tasks = s.tasks;
    });
  }

  private get filteredTasks(): Task[] {
    if (!this.searchQuery) return this.tasks;
    return this.tasks.filter(t =>
      t.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  render() {
    return html`
      <div class="nav-section">
        ${NAV_ITEMS.map(item => html`
          <div class="nav-item ${this.currentView === item.view ? 'active' : ''}"
            @click=${() => setView(item.view)}>
            <span>${item.view === 'chat' ? '💬' : item.view === 'skills' ? '🧩' : item.view === 'knowledge' ? '📚' : '⚙️'}</span>
            <span>${item.label}</span>
          </div>
        `)}
      </div>

      <div class="divider"></div>

      <div class="search-area">
        <input class="search-input" type="text" placeholder="搜索任务..."
          .value=${this.searchQuery}
          @input=${(e: InputEvent) => this.searchQuery = (e.target as HTMLInputElement).value} />
      </div>

      <div class="task-label">
        <span>最近任务</span>
      </div>

      <div class="task-list">
        ${this.filteredTasks.length === 0
          ? html`<div class="no-tasks">暂无任务</div>`
          : this.filteredTasks.map(t => {
              const statusIcon = t.status === 'running'
                ? html`<div class="spinner"></div>`
                : html`<div class="status-dot ${t.status}"></div>`;
              return html`
                <div class="task-item ${this.currentView === 'task-detail' && getState().selectedTaskId === t.id ? 'active' : ''}"
                  @click=${() => selectTask(t.id)}>
                  <div class="status-icon">${statusIcon}</div>
                  <div class="task-info">
                    <div class="task-name">${t.name}</div>
                    <div class="task-meta">${CALC_TYPE_LABELS[t.calcType]} · ${t.createdAt}</div>
                  </div>
                  <div class="task-actions">
                    <button class="action-btn" title="查看" @click=${(e: Event) => { e.stopPropagation(); selectTask(t.id); }}>👁</button>
                    <button class="action-btn danger" title="删除" @click=${(e: Event) => e.stopPropagation()}>🗑</button>
                  </div>
                </div>
              `;
            })}
      </div>
    `;
  }
}
