import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getState, subscribe, setView } from '../state';
import type { KnowledgeEntry } from '../types';

@customElement('knowledge-detail-view')
export class KnowledgeDetailView extends LitElement {
  static styles = css`
    :host { display: block; padding: var(--spacing-lg); max-width: 860px; margin: 0 auto; }

    .page-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-lg);
    }
    .back-btn {
      background: none; border: none; cursor: pointer;
      color: var(--color-text-secondary); font-size: 18px; padding: 4px;
      border-radius: var(--border-radius-sm);
    }
    .back-btn:hover { background: var(--color-background-tertiary); }

    .content-card {
      background: var(--color-background-primary);
      border: 0.5px solid var(--color-border-tertiary);
      border-radius: var(--border-radius-lg);
      padding: var(--spacing-lg);
    }
    .category-badge {
      display: inline-block;
      padding: 2px 10px;
      background: var(--color-accent-light);
      color: var(--color-accent);
      border-radius: 100px;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
    }
    .title {
      font-size: 20px;
      font-weight: var(--font-weight-bold);
      margin: var(--spacing-sm) 0;
      color: var(--color-text-primary);
    }
    .tags {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
      margin-bottom: var(--spacing-md);
    }
    .content-body {
      font-size: var(--font-size-base);
      line-height: 1.8;
      color: var(--color-text-primary);
    }
    .content-body p { margin-bottom: var(--spacing-sm); }
    .content-body strong { font-weight: var(--font-weight-bold); }
    .content-body ul, .content-body ol { padding-left: var(--spacing-lg); margin-bottom: var(--spacing-sm); }
    .content-body li { margin-bottom: var(--spacing-xxs); }
    .content-body h3 {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-medium);
      margin: var(--spacing-md) 0 var(--spacing-xs);
      color: var(--color-text-primary);
    }

    .code-section {
      margin-top: var(--spacing-lg);
      border-top: 0.5px solid var(--color-border-tertiary);
      padding-top: var(--spacing-md);
    }
    .code-section-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      margin-bottom: var(--spacing-xs);
    }

    .notes {
      margin-top: var(--spacing-md);
      padding: var(--spacing-sm);
      background: var(--color-background-warning);
      border-radius: var(--border-radius-md);
      font-size: var(--font-size-sm);
      color: var(--color-text-warning);
      border: 0.5px solid var(--color-border-warning);
    }

    .actions {
      display: flex;
      gap: var(--spacing-xs);
      margin-top: var(--spacing-lg);
    }
  `;

  @property({ type: Object }) entry: KnowledgeEntry | null = null;

  connectedCallback() {
    super.connectedCallback();
    subscribe(() => {
      const state = getState();
      this.entry = state.knowledge.find(k => k.id === state.selectedKnowledgeId) || null;
    });
  }

  private renderContent(text: string) {
    // Simple markdown-like rendering
    const html = text
      .replace(/### (.+)/g, '<h3>$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/^- (.+)/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(?!<[hul])/gm, '')
    ;
    return `<p>${html}</p>`;
  }

  render() {
    if (!this.entry) {
      return html`<div style="padding:var(--spacing-xl);text-align:center;color:var(--color-text-tertiary)">
        <p>知识条目未找到</p>
        <button class="btn btn-secondary mt-md" @click=${() => setView('knowledge')}>返回知识库</button>
      </div>`;
    }

    const e = this.entry;

    return html`
      <div>
        <div class="page-header">
          <button class="back-btn" @click=${() => setView('knowledge')}>←</button>
          <span class="text-muted" style="font-size:var(--font-size-sm)">知识详情</span>
        </div>

        <div class="content-card">
          <span class="category-badge">${e.category}</span>
          <div class="title">${e.title}</div>
          <div class="tags">${e.tags.map(t => html`<span class="tag">${t}</span>`)}</div>

          <div class="content-body">
            ${e.content.split('\n\n').map(p => {
              if (p.startsWith('### ')) {
                return html`<h3>${p.replace('### ', '')}</h3>`;
              }
              if (p.startsWith('- ')) {
                const items = p.split('\n').filter(l => l.startsWith('- ')).map(l => l.replace('- ', ''));
                return html`<ul>${items.map(i => html`<li>${i}</li>`)}</ul>`;
              }
              // Bold
              const formatted = p.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
              return html`<p>${formatted}</p>`;
            })}
          </div>

          ${e.codeExample ? html`
            <div class="code-section">
              <div class="code-section-title">💻 代码示例</div>
              <chemcode-code-block code=${e.codeExample} language="python"></chemcode-code-block>
            </div>
          ` : ''}

          ${e.notes ? html`
            <div class="notes">⚠️ ${e.notes}</div>
          ` : ''}

          <div class="actions">
            <button class="btn btn-secondary btn-sm">编辑</button>
            <button class="btn btn-secondary btn-sm">分享</button>
            <button class="btn btn-ghost btn-sm" style="color:var(--color-text-danger)">删除</button>
          </div>
        </div>
      </div>
    `;
  }
}
