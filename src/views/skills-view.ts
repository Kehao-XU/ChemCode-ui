import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getState, subscribe, toggleSkill } from '../state';
import type { SkillEntry } from '../types';

@customElement('skills-view')
export class SkillsView extends LitElement {
  static styles = css`
    :host { display: block; padding: var(--spacing-lg); max-width: 860px; margin: 0 auto; }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--spacing-lg);
    }
    .page-title { font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); }
    .skill-count { font-size: var(--font-size-sm); color: var(--color-text-secondary); }

    .skill-item {
      background: var(--color-background-primary);
      border: 0.5px solid var(--color-border-tertiary);
      border-radius: var(--border-radius-lg);
      padding: var(--spacing-md);
      margin-bottom: var(--spacing-sm);
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      transition: all var(--transition-fast);
    }
    .skill-item:hover { border-color: var(--color-border-secondary); }

    .skill-icon {
      width: 40px; height: 40px;
      border-radius: var(--border-radius-md);
      background: var(--color-accent-light);
      color: var(--color-accent);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
    }
    .skill-info { flex: 1; min-width: 0; }
    .skill-name {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
    }
    .skill-desc {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      margin-top: 2px;
    }
    .skill-meta {
      display: flex;
      gap: var(--spacing-sm);
      font-size: var(--font-size-xs);
      color: var(--color-text-tertiary);
      margin-top: var(--spacing-xs);
    }

    .toggle-btn {
      padding: 6px 16px;
      border-radius: var(--border-radius-md);
      font-size: var(--font-size-sm);
      cursor: pointer;
      border: none;
      font-weight: var(--font-weight-medium);
      flex-shrink: 0;
      transition: all var(--transition-fast);
    }
    .toggle-btn.installed {
      background: var(--color-accent);
      color: white;
    }
    .toggle-btn.installed:hover { background: var(--color-text-danger); }
    .toggle-btn.not-installed {
      background: transparent;
      border: 0.5px solid var(--color-border-secondary);
      color: var(--color-text-secondary);
    }
    .toggle-btn.not-installed:hover { background: var(--color-accent-light); color: var(--color-accent); border-color: var(--color-accent); }

    .import-btn {
      padding: 8px 16px;
      background: transparent;
      border: 0.5px solid var(--color-border-secondary);
      border-radius: var(--border-radius-md);
      cursor: pointer;
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }
    .import-btn:hover { background: var(--color-background-tertiary); }
  `;

  @property({ type: Array }) skills: SkillEntry[] = [];

  connectedCallback() {
    super.connectedCallback();
    subscribe(() => { this.skills = getState().skills; });
  }

  render() {
    const installed = this.skills.filter(s => s.installed).length;

    return html`
      <div>
        <div class="page-header">
          <div>
            <div class="page-title">🧩 Skills</div>
            <div class="skill-count">技能总数 ${this.skills.length} · 已安装 ${installed}</div>
          </div>
          <button class="import-btn" @click=${() => alert('导入功能开发中')}>📥 导入</button>
        </div>

        <div style="margin-bottom:var(--spacing-md);font-size:var(--font-size-sm);color:var(--color-text-secondary)">
          已安装技能
        </div>

        ${this.skills.filter(s => s.installed).map(s => this.renderSkill(s))}

        ${this.skills.some(s => !s.installed) ? html`
          <div style="margin:var(--spacing-md) 0 var(--spacing-sm);font-size:var(--font-size-sm);color:var(--color-text-secondary)">
            可安装
          </div>
          ${this.skills.filter(s => !s.installed).map(s => this.renderSkill(s))}
        ` : ''}
      </div>
    `;
  }

  private renderSkill(s: SkillEntry) {
    return html`
      <div class="skill-item">
        <div class="skill-icon">${s.name.charAt(0)}</div>
        <div class="skill-info">
          <div class="skill-name">${s.name}</div>
          <div class="skill-desc">${s.description}</div>
          <div class="skill-meta">
            <span>v${s.version}</span>
            <span>${s.author}</span>
            <span>${s.downloads} 下载</span>
          </div>
        </div>
        <button class="toggle-btn ${s.installed ? 'installed' : 'not-installed'}"
          @click=${() => toggleSkill(s.id)}>
          ${s.installed ? '已安装' : '安装'}
        </button>
      </div>
    `;
  }
}
