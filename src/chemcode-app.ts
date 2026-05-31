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
      display: flex;
    }
  `;

  @property({ type: String }) currentView: PageView = 'chat';
  @property({ type: Boolean }) sidebarCollapsed = false;

  connectedCallback() {
    super.connectedCallback();
    subscribe(() => {
      const s = getState();
      this.currentView = s.currentView;
      this.sidebarCollapsed = s.sidebarCollapsed;
    });
  }

  private renderView() {
    switch (this.currentView) {
      case 'chat': return html`<chat-view></chat-view>`;
      case 'task-detail': return html`<task-detail-view></task-detail-view>`;
      case 'knowledge': return html`<knowledge-view></knowledge-view>`;
      case 'skills': return html`<skills-view></skills-view>`;
      case 'settings': return html`<settings-view></settings-view>`;
      default: return html`<chat-view></chat-view>`;
    }
  }

  render() {
    return html`
      <chemcode-navbar></chemcode-navbar>
      <div class="layout">
        <chemcode-sidebar class="${this.sidebarCollapsed ? 'collapsed' : ''}"></chemcode-sidebar>
        <div class="main-content">
          ${this.renderView()}
        </div>
      </div>
    `;
  }
}
