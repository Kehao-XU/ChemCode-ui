import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { toggleSidebar, updateState, getState } from '../state';

@customElement('chemcode-navbar')
export class Navbar extends LitElement {
  static styles = css`
    :host {
      display: block;
      height: var(--navbar-height);
      background: var(--color-background-primary);
      border-bottom: 0.5px solid var(--color-border-tertiary);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .navbar-inner {
      display: flex;
      align-items: center;
      height: 100%;
      padding: 0 var(--spacing-md);
      gap: var(--spacing-sm);
    }
    .menu-btn {
      display: none;
      background: none;
      border: none;
      padding: 6px;
      color: var(--color-text-secondary);
      cursor: pointer;
      border-radius: var(--border-radius-sm);
    }
    .menu-btn:hover { background: var(--color-background-tertiary); }
    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-accent);
      white-space: nowrap;
    }
    .logo-icon {
      width: 28px;
      height: 28px;
      background: var(--color-accent);
      border-radius: var(--border-radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 14px;
      font-weight: bold;
    }
    .spacer { flex: 1; }
    .search-box {
      position: relative;
      width: 280px;
    }
    .search-box input {
      width: 100%;
      padding: 6px 12px 6px 32px;
      border: 0.5px solid var(--color-border-tertiary);
      border-radius: 6px;
      background: var(--color-background-secondary);
      font-size: var(--font-size-sm);
      outline: none;
      transition: all var(--transition-fast);
    }
    .search-box input:focus {
      border-color: var(--color-border-info);
      background: var(--color-background-primary);
      width: 320px;
    }
    .search-box .search-icon {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-text-tertiary);
      font-size: 13px;
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
    }
    .icon-btn {
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-secondary);
      cursor: pointer;
      font-size: 16px;
      position: relative;
    }
    .icon-btn:hover { background: var(--color-background-tertiary); color: var(--color-text-primary); }
    .badge {
      position: absolute;
      top: 2px;
      right: 2px;
      width: 16px;
      height: 16px;
      background: var(--color-text-danger);
      color: white;
      font-size: 9px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    }
    .user-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--color-accent-light);
      color: var(--color-accent);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: var(--font-weight-bold);
      cursor: pointer;
    }
    @media (max-width: 768px) {
      .menu-btn { display: block; }
      .search-box { width: 160px; }
      .search-box input:focus { width: 200px; }
    }
  `;

  @property({ type: String }) searchQuery = '';

  private onSearch(e: InputEvent) {
    const value = (e.target as HTMLInputElement).value;
    this.searchQuery = value;
    updateState({ searchQuery: value });
  }

  render() {
    return html`
      <div class="navbar-inner">
        <button class="menu-btn" @click=${toggleSidebar} title="切换侧边栏">
          ☰
        </button>
        <div class="logo">
          <div class="logo-icon">C</div>
          ChemCode
        </div>
        <div class="spacer"></div>
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input
            type="text"
            placeholder="搜索任务、知识库..."
            .value=${this.searchQuery}
            @input=${this.onSearch}
          />
        </div>
        <div class="nav-actions">
          <button class="icon-btn" title="通知">
            🔔
            <span class="badge">3</span>
          </button>
          <div class="user-avatar" title="用户">J</div>
        </div>
      </div>
    `;
  }
}
