import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getState, subscribe, addChatMessage, getState as state } from '../state';
import type { ChatMessage, GeneratedFile, Task } from '../types';

@customElement('chat-view')
export class ChatView extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      max-width: 960px;
      margin: 0 auto;
      width: 100%;
    }

    /* Messages */
    .messages-area {
      flex: 1;
      overflow-y: auto;
      padding: var(--spacing-md) var(--spacing-lg);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .message {
      display: flex;
      gap: var(--spacing-xs);
      max-width: 85%;
      animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    .message.user { align-self: flex-end; flex-direction: row-reverse; }
    .message.agent { align-self: flex-start; }
    .message.system { align-self: center; max-width: 100%; }

    .msg-avatar {
      width: 28px; height: 28px;
      border-radius: 50%;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
    }
    .message.user .msg-avatar { background: var(--color-accent); color: white; }
    .message.agent .msg-avatar { background: var(--color-background-tertiary); color: var(--color-text-secondary); }

    .msg-content { min-width: 0; }
    .msg-bubble {
      padding: 10px 14px;
      border-radius: var(--border-radius-md);
      font-size: var(--font-size-base);
      line-height: 1.6;
      word-break: break-word;
    }
    .message.user .msg-bubble { background: var(--color-accent); color: white; border-bottom-right-radius: 4px; }
    .message.agent .msg-bubble { background: var(--color-background-primary); border: 0.5px solid var(--color-border-tertiary); border-bottom-left-radius: 4px; color: var(--color-text-primary); }
    .message.system .msg-bubble { background: var(--color-background-warning); color: var(--color-text-warning); font-size: var(--font-size-sm); text-align: center; border-radius: 100px; padding: 6px 16px; border: 0.5px solid var(--color-border-warning); }
    .msg-time { font-size: var(--font-size-xs); color: var(--color-text-tertiary); margin-top: 4px; padding: 0 4px; }

    /* File blocks */
    .file-block {
      margin-top: var(--spacing-xs);
      border: 0.5px solid var(--color-border-tertiary);
      border-radius: var(--border-radius-md);
      overflow: hidden;
    }
    .file-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 12px;
      background: #1e1e2e;
      font-size: var(--font-size-xs);
      color: #a0a0b0;
    }
    .file-actions {
      display: flex;
      gap: 6px;
    }
    .file-action-btn {
      background: transparent;
      border: none;
      color: #a0a0b0;
      cursor: pointer;
      padding: 2px 8px;
      border-radius: var(--border-radius-sm);
      font-size: var(--font-size-xs);
    }
    .file-action-btn:hover { background: rgba(255,255,255,0.1); color: white; }
    .file-preview {
      padding: 8px 12px;
      background: #282a36;
      max-height: 150px;
      overflow-y: auto;
      font-family: var(--font-mono);
      font-size: var(--font-size-xs);
      color: #f8f8f2;
      line-height: 1.5;
      white-space: pre;
    }

    /* Confirm dialog / popup */
    .confirm-overlay {
      position: sticky;
      bottom: 0;
      padding: var(--spacing-sm) var(--spacing-lg);
      background: linear-gradient(transparent, var(--color-background-secondary) 20%);
      z-index: 10;
    }
    .confirm-box {
      background: var(--color-background-primary);
      border: 0.5px solid var(--color-border-info);
      border-radius: var(--border-radius-lg);
      padding: var(--spacing-md);
      box-shadow: var(--shadow-md);
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }
    .confirm-text {
      flex: 1;
      font-size: var(--font-size-sm);
      color: var(--color-text-primary);
    }
    .confirm-actions {
      display: flex;
      gap: var(--spacing-xs);
      flex-shrink: 0;
    }
    .confirm-btn {
      padding: 6px 16px;
      border: none;
      border-radius: var(--border-radius-md);
      font-size: var(--font-size-sm);
      cursor: pointer;
      font-weight: var(--font-weight-medium);
    }
    .confirm-btn.accept { background: var(--color-accent); color: white; }
    .confirm-btn.accept:hover { background: var(--color-accent-hover); }
    .confirm-btn.reject { background: transparent; border: 0.5px solid var(--color-border-secondary); color: var(--color-text-secondary); }
    .confirm-btn.reject:hover { background: var(--color-background-tertiary); }

    /* Input */
    .input-area {
      padding: var(--spacing-sm) var(--spacing-lg);
      border-top: 0.5px solid var(--color-border-tertiary);
      background: var(--color-background-primary);
    }
    .input-row {
      display: flex;
      gap: var(--spacing-xs);
      align-items: flex-end;
    }
    .input-row textarea {
      flex: 1;
      padding: 10px 12px;
      border: 0.5px solid var(--color-border-tertiary);
      border-radius: var(--border-radius-md);
      resize: none;
      font-size: var(--font-size-base);
      font-family: inherit;
      outline: none;
      min-height: 42px;
      max-height: 120px;
      line-height: 1.5;
      background: var(--color-background-secondary);
    }
    .input-row textarea:focus { border-color: var(--color-accent); background: var(--color-background-primary); }
    .input-row textarea::placeholder { color: var(--color-text-tertiary); }

    .input-tools {
      display: flex;
      gap: var(--spacing-xxs);
      margin-top: var(--spacing-xs);
      align-items: center;
    }
    .tool-btn {
      padding: 4px 10px;
      border: 0.5px solid var(--color-border-tertiary);
      border-radius: var(--border-radius-sm);
      background: transparent;
      color: var(--color-text-tertiary);
      cursor: pointer;
      font-size: var(--font-size-xs);
    }
    .tool-btn:hover { border-color: var(--color-accent); color: var(--color-accent); }

    .model-selector {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
    }
    .model-selector select {
      padding: 4px 8px;
      border: 0.5px solid var(--color-border-tertiary);
      border-radius: var(--border-radius-sm);
      background: var(--color-background-primary);
      font-size: var(--font-size-sm);
      outline: none;
      cursor: pointer;
    }

    .send-btn {
      width: 42px; height: 42px;
      border: none;
      border-radius: var(--border-radius-md);
      background: var(--color-accent);
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .send-btn:hover { background: var(--color-accent-hover); }
    .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    /* Typing indicator */
    .typing-indicator {
      display: flex;
      gap: 4px;
      padding: 10px 14px;
      background: var(--color-background-primary);
      border: 0.5px solid var(--color-border-tertiary);
      border-radius: var(--border-radius-md);
      border-bottom-left-radius: 4px;
      align-self: flex-start;
    }
    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0.6); }
      40% { transform: scale(1); }
    }
    .typing-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: var(--color-text-tertiary);
      animation: bounce 1.4s ease-in-out infinite;
    }
    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  `;

  @property({ type: Array }) messages: ChatMessage[] = [];
  @property({ type: Boolean }) isTyping = false;
  @property({ type: Boolean }) showConfirm = false;
  private inputEl!: HTMLTextAreaElement;

  connectedCallback() {
    super.connectedCallback();
    subscribe(() => {
      this.messages = getState().chatMessages;
    });
    setTimeout(() => this.showConfirm = true, 2000);
  }

  firstUpdated() {
    this.inputEl = this.shadowRoot!.querySelector('textarea')!;
    this.scrollToBottom();
  }

  updated() { this.scrollToBottom(); }

  private scrollToBottom() {
    const area = this.shadowRoot!.querySelector('.messages-area');
    if (area) {
      requestAnimationFrame(() => { area.scrollTop = area.scrollHeight; });
    }
  }

  private autoResize(e: Event) {
    const el = e.target as HTMLTextAreaElement;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }

  private handleSend() {
    const text = this.inputEl.value.trim();
    if (!text) return;

    const ts = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    addChatMessage({ id: `msg-${Date.now()}`, type: 'user', content: text, timestamp: ts });
    this.inputEl.value = '';
    this.inputEl.style.height = 'auto';
    this.showConfirm = false;

    this.isTyping = true;
    setTimeout(() => {
      addChatMessage({
        id: `msg-${Date.now()}`,
        type: 'agent',
        content: '好的，我已收到你的请求。正在准备计算方案...\n\n需要确认以下参数设置：\n- 力场：AMBER99SB-ILDN\n- 温度：310K\n- 模拟时间：50ns',
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        files: [
          { name: 'em.mdp', type: 'mdp', size: '1.2KB' },
          { name: 'md.mdp', type: 'mdp', size: '1.5KB' },
        ],
      });
      this.isTyping = false;
      this.showConfirm = true;
      this.requestUpdate();
    }, 1500);
  }

  private onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.handleSend(); }
  }

  render() {
    return html`
      <div class="messages-area">
        ${this.messages.map(m => {
          if (m.type === 'system') {
            return html`
              <div class="message system">
                <div class="msg-bubble">⚠️ ${m.content}</div>
              </div>
            `;
          }
          return html`
            <div class="message ${m.type}">
              <div class="msg-avatar">${m.type === 'user' ? 'J' : 'AI'}</div>
              <div class="msg-content">
                <div class="msg-bubble">${m.content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')}</div>
                ${m.files ? m.files.map(f => html`
                  <div class="file-block">
                    <div class="file-header">
                      <span>${f.name}</span>
                      <div class="file-actions">
                        <button class="file-action-btn" @click=${() => navigator.clipboard.writeText(f.content || '')}>📋 复制</button>
                        <button class="file-action-btn">⬇️ 下载</button>
                      </div>
                    </div>
                    <div class="file-preview">${f.type === 'mdp' ? `; ${f.name} generated by ChemCode\n; size: ${f.size}\n\nintegrator = md\nnsteps = 50000000\ndt = 0.002\n\n; ...` : ''}</div>
                  </div>
                `) : ''}
                <div class="msg-time">${m.timestamp}</div>
              </div>
            </div>
          `;
        })}

        ${this.isTyping ? html`
          <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>
        ` : ''}

        ${this.showConfirm ? html`
          <div class="confirm-overlay">
            <div class="confirm-box">
              <div class="confirm-text">是否接受当前步骤的配置参数并继续？</div>
              <div class="confirm-actions">
                <button class="confirm-btn accept" @click=${() => {
                  this.showConfirm = false;
                  addChatMessage({ id: `msg-${Date.now()}`, type: 'user', content: '确认，继续执行', timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }) });
                }}>接受</button>
                <button class="confirm-btn reject" @click=${() => this.showConfirm = false}>拒绝</button>
              </div>
            </div>
          </div>
        ` : ''}
      </div>

      <div class="input-area">
        <div class="input-row">
          <textarea placeholder="输入消息..."
            @input=${this.autoResize}
            @keydown=${this.onKeydown}
            rows="1"></textarea>
          <button class="send-btn" @click=${this.handleSend}>➤</button>
        </div>
        <div class="input-tools">
          <button class="tool-btn">📎</button>
          <div class="model-selector">
            <span>模型</span>
            <select>
              <option>DeepSeek-V4</option>
              <option>GPT-4o</option>
            </select>
          </div>
        </div>
      </div>
    `;
  }
}
