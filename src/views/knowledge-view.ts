import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getState, subscribe, setView } from '../state';
import type { KnowledgeEntry } from '../types';

@customElement('knowledge-view')
export class KnowledgeView extends LitElement {
  static styles = css`
    :host { display: block; padding: var(--spacing-lg); max-width: 860px; margin: 0 auto; }
    .page-title { font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); margin-bottom: var(--spacing-lg); }

    .search-bar {
      margin-bottom: var(--spacing-md);
    }
    .search-bar input {
      width: 100%;
      padding: 8px 12px;
      border: 0.5px solid var(--color-border-tertiary);
      border-radius: var(--border-radius-md);
      font-size: var(--font-size-base);
      outline: none;
      box-sizing: border-box;
    }
    .search-bar input:focus { border-color: var(--color-accent); }

    .entry-list { display: flex; flex-direction: column; gap: var(--spacing-sm); }
    .entry-card {
      background: var(--color-background-primary);
      border: 0.5px solid var(--color-border-tertiary);
      border-radius: var(--border-radius-lg);
      padding: var(--spacing-md);
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .entry-card:hover { border-color: var(--color-border-info); }
    .entry-title { font-size: var(--font-size-base); font-weight: var(--font-weight-medium); margin-bottom: 4px; }
    .entry-meta { font-size: var(--font-size-xs); color: var(--color-text-tertiary); margin-bottom: var(--spacing-xs); }

    .entry-content {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      line-height: 1.6;
    }
    .entry-content code {
      background: var(--color-background-secondary);
      padding: 1px 4px;
      border-radius: 3px;
      font-size: var(--font-size-xs);
    }
    .entry-content pre {
      background: #282a36;
      color: #f8f8f2;
      padding: var(--spacing-sm);
      border-radius: var(--border-radius-md);
      overflow-x: auto;
      font-size: var(--font-size-xs);
      margin: var(--spacing-xs) 0;
    }
    .entry-content table {
      width: 100%;
      border-collapse: collapse;
      font-size: var(--font-size-sm);
      margin: var(--spacing-xs) 0;
    }
    .entry-content td, .entry-content th {
      padding: 4px 8px;
      border: 0.5px solid var(--color-border-tertiary);
    }
    .entry-content th { background: var(--color-background-secondary); font-weight: var(--font-weight-medium); }

    .tags { display: flex; gap: 4px; flex-wrap: wrap; margin-top: var(--spacing-xs); }
    .tag {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 100px;
      background: var(--color-accent-light);
      color: var(--color-accent);
      font-size: var(--font-size-xs);
    }

    .empty { text-align: center; padding: var(--spacing-xl); color: var(--color-text-tertiary); }
  `;

  @property({ type: Array }) entries: KnowledgeEntry[] = [];
  @property({ type: String }) search = '';

  connectedCallback() {
    super.connectedCallback();
    subscribe(() => {
      this.entries = getState().knowledge;
    });
  }

  private get filtered(): KnowledgeEntry[] {
    if (!this.search) return this.entries;
    const q = this.search.toLowerCase();
    return this.entries.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.content.toLowerCase().includes(q) ||
      e.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  private renderMarkdown(text: string) {
    // Simple wiki-style rendering
    const html = text
      .replace(/### (.+)/g, '<h3>$1</h3>')
      .replace(/## (.+)/g, '<h2>$1</h2>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
      .replace(/^\|(.+)\|$/gm, (match) => {
        if (match.includes('---')) return '';
        return match;
      })
      .replace(/\n/g, '<br/>');
    return html;
  }

  render() {
    return html`
      <div>
        <div class="page-title">📚 个人知识库</div>
        <div class="search-bar">
          <input type="text" placeholder="搜索知识条目..." .value=${this.search}
            @input=${(e: InputEvent) => this.search = (e.target as HTMLInputElement).value} />
        </div>
        <div class="entry-list">
          ${this.filtered.length === 0
            ? html`<div class="empty">暂无匹配条目</div>`
            : this.filtered.map(e => html`
              <div class="entry-card">
                <div class="entry-title">${e.title}</div>
                <div class="entry-meta">${e.category} · ${e.updatedAt}</div>
                <div class="entry-content">${this.renderMarkdown(e.content)}</div>
                <div class="tags">${e.tags.map(t => html`<span class="tag">${t}</span>`)}</div>
              </div>
            `)}
        </div>
      </div>
    `;
  }
}
