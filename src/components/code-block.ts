import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('chemcode-code-block')
export class CodeBlock extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: relative;
      margin: var(--spacing-xs) 0;
    }
    .code-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 12px;
      background: #1e1e2e;
      border-radius: var(--border-radius-md) var(--border-radius-md) 0 0;
      font-size: var(--font-size-xs);
      color: #a0a0b0;
    }
    .copy-btn {
      background: transparent;
      border: none;
      color: #a0a0b0;
      cursor: pointer;
      font-size: var(--font-size-xs);
      padding: 2px 8px;
      border-radius: var(--border-radius-sm);
    }
    .copy-btn:hover { background: rgba(255,255,255,0.1); color: white; }
    pre {
      margin: 0;
      padding: var(--spacing-sm);
      background: #282a36;
      border-radius: 0 0 var(--border-radius-md) var(--border-radius-md);
      overflow-x: auto;
      font-size: var(--font-size-sm);
      line-height: 1.6;
      color: #f8f8f2;
    }
    code {
      font-family: var(--font-mono);
    }
    /* Basic syntax coloring */
    .kw { color: #ff79c6; }
    .fn { color: #50fa7b; }
    .str { color: #f1fa8c; }
    .cm { color: #6272a4; }
    .num { color: #bd93f9; }
    .op { color: #ff79c6; }
  `;

  @property({ type: String }) code = '';
  @property({ type: String }) language = 'python';

  private copied = false;

  private async onCopy() {
    try {
      await navigator.clipboard.writeText(this.code);
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
      this.requestUpdate();
    } catch {
      // fallback
    }
  }

  private highlightPython(code: string): string {
    return code
      .replace(/\b(import|from|def|class|return|if|elif|else|for|while|in|not|and|or|True|False|None|with|as|try|except|finally|raise|break|continue|print|pass)\b/g, '<span class="kw">$1</span>')
      .replace(/\b([a-z_][a-z0-9_]*)\s*\(/g, '<span class="fn">$1</span>(')
      .replace(/'[^']*'/g, '<span class="str">$&</span>')
      .replace(/"[^"]*"/g, '<span class="str">$&</span>')
      .replace(/#[^\n]*/g, '<span class="cm">$&</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="num">$1</span>')
      .replace(/([+\-*/=<>!]+)/g, '<span class="op">$1</span>');
  }

  private highlightShell(code: string): string {
    return code
      .replace(/(^#.*)/gm, '<span class="cm">$1</span>')
      .replace(/\$(\w+)/g, '<span class="kw">$$$1</span>');
  }

  private get highlighted(): string {
    if (this.language === 'python') return this.highlightPython(this.code);
    return this.highlightShell(this.code);
  }

  render() {
    return html`
      <div class="code-header">
        <span>${this.language}</span>
        <button class="copy-btn" @click=${this.onCopy}>
          ${this.copied ? '✅ 已复制' : '📋 复制'}
        </button>
      </div>
      <pre><code .innerHTML=${this.highlighted}></code></pre>
    `;
  }
}
