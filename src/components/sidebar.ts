import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getState, subscribe, setView } from '../state';
import type { PageView } from '../types';

interface NavItem {
  view: PageView;
  icon: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { view: 'dashboard', icon: '📊', label: '仪表板' },
  { view: 'tasks', icon: '📋', label: '任务管理' },
  { view: 'create-task', icon: '➕', label: '创建任务' },
  { view: 'knowledge', icon: '📚', label: '知识库' },
  { view: 'code-gen', icon: '💻', label: '代码生成' },
  { view: 'results', icon: '📈', label: '结果分析' },
  { view: 'chat', icon: '💬', label: 'AI对话' },
];

@customElement('chemcode-sidebar')
export class Sidebar extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: var(--sidebar-width);
      background: var(--color-background-primary);
      border-right: 0.5px solid var(--color-border-tertiary);
      height: calc(100vh - var(--navbar-height));
      overflow-y: auto;
      flex-shrink: 0;
      transition: width var(--transition-normal);
    }
    :host(.collapsed) {
      width: var(--sidebar-collapsed-width);
    }
    .nav-section {
      padding: var(--spacing-sm);
    }
    .nav-label {
      font-size: var(--font-size-xs);
      color: var(--color-text-tertiary);
      padding: var(--spacing-xs) var(--spacing-sm);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: var(--font-weight-medium);
    }
    :host(.collapsed) .nav-label { display: none; }
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
      overflow: hidden;
    }
    .nav-item:hover {
      background: var(--color-background-tertiary);
      color: var(--color-text-primary);
    }
    .nav-item.active {
      background: var(--color-accent-light);
      color: var(--color-accent);
      font-weight: var(--font-weight-medium);
    }
    .nav-icon {
      flex-shrink: 0;
      width: 20px;
      text-align: center;
      font-size: 16px;
    }
    :host(.collapsed) .nav-label-text {
      display: none;
    }
    :host(.collapsed) .nav-item {
      justify-content: center;
      padding: 8px;
    }
    :host(.collapsed) .nav-item.active {
      background: var(--color-accent-light);
    }

    /* Mobile overlay */
    @media (max-width: 768px) {
      :host {
        position: fixed;
        left: 0;
        top: var(--navbar-height);
        bottom: 0;
        z-index: 90;
        box-shadow: var(--shadow-md);
        transform: translateX(-100%);
        transition: transform var(--transition-normal);
      }
      :host(.collapsed) { transform: translateX(0); }
    }
  `;

  @property({ type: String }) currentView: PageView = 'dashboard';
  @property({ type: Boolean }) collapsed = false;

  connectedCallback() {
    super.connectedCallback();
    subscribe(() => {
      const s = getState();
      this.currentView = s.currentView;
      this.collapsed = s.sidebarCollapsed;
    });
  }

  private navigate(view: PageView) {
    setView(view);
  }

  render() {
    return html`
      <div class="nav-section">
        <div class="nav-label">导航菜单</div>
        ${NAV_ITEMS.map(
          (item) => html`
            <div
              class="nav-item ${this.currentView === item.view ? 'active' : ''}"
              @click=${() => this.navigate(item.view)}
              title=${item.label}
            >
              <span class="nav-icon">${item.icon}</span>
              <span class="nav-label-text">${item.label}</span>
            </div>
          `
        )}
      </div>
    `;
  }
}
