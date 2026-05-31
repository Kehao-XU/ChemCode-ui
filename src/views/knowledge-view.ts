import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getState, subscribe, selectKnowledge, setView } from '../state';
import type { KnowledgeEntry } from '../types';
import { KNOWLEDGE_CATEGORIES } from '../types';

@customElement('knowledge-view')
export class KnowledgeView extends LitElement {
  static styles = css`
    :host { display: block; padding: var(--spacing-lg); max-width: 1280px; margin: 0 auto; }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--spacing-lg);
      flex-wrap: wrap;
      gap: var(--spacing-sm);
    }
    .page-title { font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); }

    .category-bar {
      display: flex;
      gap: var(--spacing-xs);
      flex-wrap: wrap;
      margin-bottom: var(--spacing-lg);
    }
    .cat-btn {
      padding: 6px 14px;
      border: 0.5px solid var(--color-border-tertiary);
      border-radius: 100px;
      background: var(--color-background-primary);
      color: var(--color-text-secondary);
      cursor: pointer;
      font-size: var(--font-size-sm);
      transition: all var(--transition-fast);
    }
    .cat-btn:hover { border-color: var(--color-accent); color: var(--color-accent); }
    .cat-btn.active {
      background: var(--color-accent);
      color: white;
      border-color: var(--color-accent);
    }

    .knowledge-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--spacing-md);
    }

    .entry-card {
      background: var(--color-background-primary);
      border: 0.5px solid var(--color-border-tertiary);
      border-radius: var(--border-radius-lg);
      padding: var(--spacing-md);
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .entry-card:hover {
      border-color: var(--color-border-info);
      box-shadow: var(--shadow-sm);
    }
    .entry-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      margin-bottom: var(--spacing-xs);
      color: var(--color-text-primary);
    }
    .entry-category { font-size: var(--font-size-xs); color: var(--color-accent); margin-bottom: var(--spacing-xs); }
    .entry-preview {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-height: 1.6;
    }
    .entry-tags {
      display: flex;
      gap: 4px;
      flex-wrap: wrap;
      margin-top: var(--spacing-xs);
    }
    .entry-date { font-size: var(--font-size-xs); color: var(--color-text-tertiary); margin-top: var(--spacing-xs); }

    .empty {
      text-align: center;
      padding: var(--spacing-xl);
      color: var(--color-text-tertiary);
      grid-column: 1 / -1;
    }
  `;

  @property({ type: Array}) entries: KnowledgeEntry[] = [];
  @property({ type: String }) activeCategory = '全部';

  connectedCallback() {
    super.connectedCallback();
    subscribe(() => {
      this.entries = getState().knowledge;
    });
  }

  private get filtered(): KnowledgeEntry[] {
    if (this.activeCategory === '全部') return this.entries;
    return this.entries.filter(e => e.category === this.activeCategory);
  }

  render() {
    const categories = ['全部', ...KNOWLEDGE_CATEGORIES];

    return html`
      <div>
        <div class="page-header">
          <div class="page-title">知识库</div>
          <button class="btn btn-primary" @click=${() => alert('添加新条目（功能开发中）')}>+ 添加条目</button>
        </div>

        <div class="category-bar">
          ${categories.map(c => html`
            <button class="cat-btn ${this.activeCategory === c ? 'active' : ''}"
              @click=${() => this.activeCategory = c}>${c}</button>
          `)}
        </div>

        <div class="knowledge-grid">
          ${this.filtered.length === 0
            ? html`<div class="empty">该分类下暂无知识条目</div>`
            : this.filtered.map(e => html`
              <div class="entry-card" @click=${() => selectKnowledge(e.id)}>
                <div class="entry-category">${e.category}</div>
                <div class="entry-title">${e.title}</div>
                <div class="entry-preview">${e.content.slice(0, 150)}...</div>
                <div class="entry-tags">
                  ${e.tags.map(t => html`<span class="tag">${t}</span>`)}
                </div>
                <div class="entry-date">${e.createdAt}</div>
              </div>
            `)}
        </div>
      </div>
    `;
  }
}
