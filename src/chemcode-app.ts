import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getState, subscribe } from './state';
import type { PageView } from './types';
import './components/navbar';
import './components/sidebar';
import './components/status-card';
import './components/code-block';
import './views/index';

@customElement('chemcode-app')
export class ChemCodeApp extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: var(--color-background-secondary);
    }
    .layout {
      display: flex;
      flex: 1;
      overflow: hidden;
    }
    .main-content {
      flex: 1;
      overflow-y: auto;
      min-width: 0;
    }
  `;

  @property({ type: String }) currentView: PageView = 'dashboard';

  connectedCallback() {
    super.connectedCallback();
    subscribe(() => {
      this.currentView = getState().currentView;
    });
  }

  private renderView() {
    switch (this.currentView) {
      case 'dashboard':
        return html`<dashboard-view></dashboard-view>`;
      case 'tasks':
        return html`<tasks-view></tasks-view>`;
      case 'create-task':
        return html`<create-task-view></create-task-view>`;
      case 'task-detail':
        return html`<task-detail-view></task-detail-view>`;
      case 'knowledge':
        return html`<knowledge-view></knowledge-view>`;
      case 'knowledge-detail':
        return html`<knowledge-detail-view></knowledge-detail-view>`;
      case 'code-gen':
        return html`<code-gen-view></code-gen-view>`;
      case 'results':
        return html`<results-view></results-view>`;
      case 'chat':
        return html`<chat-view></chat-view>`;
      default:
        return html`<dashboard-view></dashboard-view>`;
    }
  }

  render() {
    const collapsed = getState().sidebarCollapsed;

    return html`
      <chemcode-navbar></chemcode-navbar>
      <div class="layout">
        <chemcode-sidebar class="${collapsed ? 'collapsed' : ''}"></chemcode-sidebar>
        <div class="main-content">
          ${this.renderView()}
        </div>
      </div>
    `;
  }
}
