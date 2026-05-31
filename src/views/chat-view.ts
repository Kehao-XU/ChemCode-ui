import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getState, subscribe, addChatMessage } from '../state';
import type { ChatMessage } from '../types';

@customElement('chat-view')
export class ChatView extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: calc(100vh - var(--navbar-height) - 2px);
      max-width: 960px;
      margin: 0 auto;
    }

    .chat-header {
      padding: var(--spacing-sm) var(--spacing-lg);
      border-bottom: 0.5px solid var(--color-border-tertiary);
      background: var(--color-background-primary);
    }
    .chat-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-medium);
    }
    .chat-subtitle {
      font-size: var(--font-size-xs);
      color: var(--color-text-tertiary);
    }

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
      max-width: 80%;
      animation: fadeIn 0.2s ease;
    }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

    .message.user {
      align-self: flex-end;
      flex-direction: row-reverse;
    }
    .message.agent {
      align-self: flex-start;
    }
    .message.system {
      align-self: center;
      max-width: 100%;
    }

    .msg-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }
    .message.user .msg-avatar {
      background: var(--color-accent);
      color: white;
    }
    .message.agent .msg-avatar {
      background: var(--color-background-tertiary);
      color: var(--color-text-secondary);
    }

    .msg-bubble {
      padding: 10px 14px;
      border-radius: var(--border-radius-md);
      font-size: var(--font-size-base);
      line-height: 1.6;
      word-break: break-word;
    }
    .message.user .msg-bubble {
      background: var(--color-accent);
      color: white;
      border-bottom-right-radius: 4px;
    }
    .message.agent .msg-bubble {
      background: var(--color-background-primary);
      border: 0.5px solid var(--color-border-tertiary);
      border-bottom-left-radius: 4px;
      color: var(--color-text-primary);
    }
    .message.system .msg-bubble {
      background: var(--color-background-secondary);
      color: var(--color-text-secondary);
      font-size: var(--font-size-sm);
      text-align: center;
      border-radius: 100px;
      padding: 6px 16px;
    }

    .msg-time {
      font-size: var(--font-size-xs);
      color: var(--color-text-tertiary);
      margin-top: 4px;
      padding: 0 4px;
    }

    .msg-code {
      margin: var(--spacing-xs) 0;
    }

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
      transition: border-color var(--transition-fast);
    }
    .input-row textarea:focus {
      border-color: var(--color-accent);
      background: var(--color-background-primary);
    }
    .input-row textarea::placeholder { color: var(--color-text-tertiary); }

    .input-tools {
      display: flex;
      gap: var(--spacing-xxs);
      margin-top: var(--spacing-xs);
    }
    .tool-btn {
      padding: 4px 10px;
      border: 0.5px solid var(--color-border-tertiary);
      border-radius: var(--border-radius-sm);
      background: transparent;
      color: var(--color-text-tertiary);
      cursor: pointer;
      font-size: var(--font-size-xs);
      transition: all var(--transition-fast);
    }
    .tool-btn:hover { border-color: var(--color-accent); color: var(--color-accent); }

    .send-btn {
      width: 42px;
      height: 42px;
      border: none;
      border-radius: var(--border-radius-md);
      background: var(--color-accent);
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background var(--transition-fast);
    }
    .send-btn:hover { background: var(--color-accent-hover); }
    .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    /* Quick actions */
    .quick-actions {
      display: flex;
      gap: var(--spacing-xs);
      flex-wrap: wrap;
      margin-top: var(--spacing-xs);
    }
    .quick-btn {
      padding: 4px 12px;
      border: 0.5px solid var(--color-border-info);
      border-radius: 100px;
      background: var(--color-accent-light);
      color: var(--color-accent);
      cursor: pointer;
      font-size: var(--font-size-xs);
      transition: all var(--transition-fast);
    }
    .quick-btn:hover { background: var(--color-accent); color: white; }

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
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--color-text-tertiary);
      animation: bounce 1.4s ease-in-out infinite;
    }
    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  `;

  @property({ type: Array }) messages: ChatMessage[] = [];
  @property({ type: Boolean }) isTyping = false;

  private inputEl!: HTMLTextAreaElement;

  connectedCallback() {
    super.connectedCallback();
    subscribe(() => {
      this.messages = getState().chatMessages;
    });
  }

  firstUpdated() {
    this.inputEl = this.shadowRoot!.querySelector('textarea')!;
    this.scrollToBottom();
  }

  updated() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    const area = this.shadowRoot!.querySelector('.messages-area');
    if (area) {
      requestAnimationFrame(() => {
        area.scrollTop = area.scrollHeight;
      });
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

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };
    addChatMessage(userMsg);
    this.inputEl.value = '';
    this.inputEl.style.height = 'auto';

    // Simulate agent typing
    this.isTyping = true;

    setTimeout(() => {
      const responses: Record<string, string> = {
        '分子动力学': '分子动力学模拟需要以下步骤：\n1. 准备分子结构文件（PDB格式）\n2. 选择力场（推荐AMBER或CHARMM）\n3. 溶剂化和离子中和\n4. 能量最小化\n5. NVT和NPT平衡\n6. 生产模拟\n\n建议使用 GROMACS 软件，具体参数可根据体系调整。',
        'gromacs': 'GROMACS 调用基本流程：\n```\ngmx pdb2gmx -f input.pdb -o processed.gro\ngmx editconf -f processed.gro -o box.gro -c -d 1.0\ngmx solvate -cp box.gro -cs spc216.gro -o solvated.gro\ngmx grompp -f em.mdp -c solvated.gro -p topol.top -o em.tpr\ngmx mdrun -deffnm em\n```\n需要更具体的参数配置吗？',
      };

      let reply = '';
      for (const [key, val] of Object.entries(responses)) {
        if (text.toLowerCase().includes(key.toLowerCase())) {
          reply = val;
          break;
        }
      }
      if (!reply) {
        reply = '这是一个很好的问题！让我为您查找相关信息。\n\n当前计算化学平台支持以下功能：\n- **分子动力学模拟** (GROMACS, AMBER)\n- **DPD耗散粒子动力学**\n- **量子化学计算**\n- **DFT密度泛函计算**\n- **轨迹分析与可视化**\n\n您想了解哪方面的具体内容？';
      }

      const agentMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        type: 'agent',
        content: reply,
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      };
      addChatMessage(agentMsg);
      this.isTyping = false;
    }, 1500);
  }

  private onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.handleSend();
    }
  }

  private insertText(text: string) {
    this.inputEl.value = text;
    this.inputEl.focus();
    this.autoResize({ target: this.inputEl } as unknown as InputEvent);
  }

  render() {
    const quickActions = ['如何做分子动力学模拟？', '什么是力场？', '帮我生成GROMACS脚本', '常见计算参数设置'];

    return html`
      <div class="chat-header">
        <div class="chat-title">💬 AI 对话</div>
        <div class="chat-subtitle">向AI Agent提问计算化学相关问题</div>
      </div>

      <div class="messages-area">
        ${this.messages.map(m => html`
          <div class="message ${m.type}">
            <div class="msg-avatar">
              ${m.type === 'user' ? 'J' : m.type === 'agent' ? 'AI' : 'i'}
            </div>
            <div>
              <div class="msg-bubble">${m.content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')}</div>
              <div class="msg-time">${m.timestamp}</div>
            </div>
          </div>
        `)}

        ${this.isTyping ? html`
          <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
          </div>
        ` : ''}

        ${this.messages.length === 1 ? html`
          <div class="quick-actions">
            ${quickActions.map(a => html`
              <button class="quick-btn" @click=${() => this.insertText(a)}>${a}</button>
            `)}
          </div>
        ` : ''}
      </div>

      <div class="input-area">
        <div class="input-row">
          <textarea
            placeholder="输入你的计算化学问题..."
            @input=${this.autoResize}
            @keydown=${this.onKeydown}
            rows="1"
          ></textarea>
          <button class="send-btn" @click=${this.handleSend}>
            ➤
          </button>
        </div>
        <div class="input-tools">
          <button class="tool-btn">📎 附件</button>
          <button class="tool-btn">💻 代码</button>
          <button class="tool-btn">📚 知识库</button>
          <button class="tool-btn">📋 模板</button>
        </div>
      </div>
    `;
  }
}
