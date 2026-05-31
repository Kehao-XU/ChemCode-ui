import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { toggleSidebar } from '../state';

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
      background: none;
      border: none;
      padding: 6px;
      color: var(--color-text-secondary);
      cursor: pointer;
      border-radius: var(--border-radius-sm);
      font-size: 18px;
    }
    .menu-btn:hover { background: var(--color-background-tertiary); }
    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-accent);
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
    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 8px;
      border-radius: var(--border-radius-md);
      cursor: pointer;
    }
    .user-info:hover { background: var(--color-background-tertiary); }
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
    }
    .user-name {
      font-size: var(--font-size-sm);
      color: var(--color-text-primary);
    }
  `;

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
        <div class="user-info">
          <div class="user-avatar">J</div>
          <span class="user-name">Justinian</span>
        </div>
      </div>
    `;
  }
}
