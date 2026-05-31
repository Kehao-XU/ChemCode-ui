import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getState, subscribe, setSettingsTab, setThemeMode, setLanguage, setFontSize, addModel, removeModel, setView } from '../state';
import type { SettingsTab, ThemeMode, Lang, ConfiguredModel } from '../types';

@customElement('settings-view')
export class SettingsView extends LitElement {
  static styles = css`
    :host { display: flex; height: 100%; }

    /* Left sidebar */
    .settings-sidebar {
      width: 180px;
      flex-shrink: 0;
      background: var(--color-background-primary);
      border-right: 0.5px solid var(--color-border-tertiary);
      padding: var(--spacing-sm) 0;
    }
    .settings-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px var(--spacing-md);
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      cursor: pointer;
      border-left: 3px solid transparent;
    }
    .settings-item:hover { background: var(--color-background-secondary); color: var(--color-text-primary); }
    .settings-item.active {
      background: var(--color-accent-light);
      color: var(--color-accent);
      border-left-color: var(--color-accent);
      font-weight: var(--font-weight-medium);
    }
    .back-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px var(--spacing-md);
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      cursor: pointer;
      border-bottom: 0.5px solid var(--color-border-tertiary);
      margin-bottom: var(--spacing-xs);
    }
    .back-btn:hover { color: var(--color-accent); }

    /* Right content */
    .settings-content {
      flex: 1;
      padding: var(--spacing-lg);
      overflow-y: auto;
      max-width: 640px;
    }
    .page-title { font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); margin-bottom: var(--spacing-lg); }

    .card {
      background: var(--color-background-primary);
      border: 0.5px solid var(--color-border-tertiary);
      border-radius: var(--border-radius-lg);
      padding: var(--spacing-md);
      margin-bottom: var(--spacing-md);
    }
    .card-title { font-size: var(--font-size-lg); font-weight: var(--font-weight-medium); margin-bottom: var(--spacing-sm); }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 0.5px solid var(--color-border-tertiary);
    }
    .info-row:last-child { border-bottom: none; }
    .info-label { font-size: var(--font-size-sm); color: var(--color-text-secondary); }
    .info-value { font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); }

    .setting-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 0.5px solid var(--color-border-tertiary);
    }
    .setting-row:last-child { border-bottom: none; }
    .setting-label { font-size: var(--font-size-sm); }
    .setting-control select, .setting-control input {
      padding: 4px 8px;
      border: 0.5px solid var(--color-border-tertiary);
      border-radius: var(--border-radius-sm);
      font-size: var(--font-size-sm);
      background: var(--color-background-primary);
      outline: none;
    }

    .model-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 0.5px solid var(--color-border-tertiary);
    }
    .model-item:last-child { border-bottom: none; }
    .model-name { font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); }
    .model-url { font-size: var(--font-size-xs); color: var(--color-text-tertiary); }
    .edit-btn {
      padding: 4px 10px;
      border: 0.5px solid var(--color-border-tertiary);
      border-radius: var(--border-radius-sm);
      background: transparent;
      cursor: pointer;
      font-size: var(--font-size-xs);
      color: var(--color-text-secondary);
    }
    .edit-btn:hover { border-color: var(--color-accent); color: var(--color-accent); }
    .edit-btn.danger:hover { border-color: var(--color-text-danger); color: var(--color-text-danger); }

    .add-btn {
      width: 100%;
      padding: 8px;
      border: 1px dashed var(--color-border-secondary);
      border-radius: var(--border-radius-md);
      background: transparent;
      cursor: pointer;
      font-size: var(--font-size-sm);
      color: var(--color-text-tertiary);
      margin-top: var(--spacing-xs);
    }
    .add-btn:hover { border-color: var(--color-accent); color: var(--color-accent); }

    .auth-btn {
      padding: 6px 16px;
      border: none;
      border-radius: var(--border-radius-md);
      background: var(--color-accent);
      color: white;
      cursor: pointer;
      font-size: var(--font-size-sm);
    }
    .auth-btn:hover { background: var(--color-accent-hover); }
    .auth-btn.outline {
      background: transparent;
      border: 0.5px solid var(--color-border-secondary);
      color: var(--color-text-secondary);
    }
    .auth-btn.outline:hover { background: var(--color-background-tertiary); }

    /* Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 200;
    }
    .modal-box {
      background: var(--color-background-primary);
      border-radius: var(--border-radius-lg);
      padding: var(--spacing-lg);
      width: 400px;
      max-width: 90vw;
      box-shadow: var(--shadow-md);
    }
    .modal-title { font-size: var(--font-size-lg); font-weight: var(--font-weight-medium); margin-bottom: var(--spacing-md); }
    .modal-form .form-group { margin-bottom: var(--spacing-sm); }
    .modal-form .form-label { display: block; font-size: var(--font-size-sm); margin-bottom: 4px; }
    .modal-form input, .modal-form select {
      width: 100%;
      padding: 8px 10px;
      border: 0.5px solid var(--color-border-tertiary);
      border-radius: var(--border-radius-sm);
      font-size: var(--font-size-sm);
      outline: none;
      box-sizing: border-box;
    }
    .modal-form input:focus { border-color: var(--color-accent); }
    .modal-actions { display: flex; gap: var(--spacing-xs); justify-content: flex-end; margin-top: var(--spacing-md); }
  `;

  @property({ type: String }) activeTab: SettingsTab = 'account';
  @property({ type: String }) theme: ThemeMode = 'light';
  @property({ type: String }) language: Lang = 'zh';
  @property({ type: Number }) fontSize = 14;
  @property({ type: Array}) models: ConfiguredModel[] = [];
  @property({ type: Boolean }) showAddModel = false;

  // Add model form
  private formName = '';
  private formUrl = '';
  private formKey = '';
  private formContext = true;
  private formProvider = 'openai';

  connectedCallback() {
    super.connectedCallback();
    subscribe(() => {
      const s = getState();
      this.activeTab = s.settingsTab;
      this.theme = s.theme;
      this.language = s.language;
      this.fontSize = s.fontSize;
      this.models = s.configuredModels;
    });
  }

  private onSaveModel() {
    if (!this.formName || !this.formUrl || !this.formKey) return;
    removeModel(this.formName); // dedupe
    addModel({
      name: this.formName,
      apiUrl: this.formUrl,
      apiKey: this.formKey,
      supportsContext: this.formContext,
      provider: this.formProvider,
    });
    this.showAddModel = false;
    this.formName = '';
    this.formUrl = '';
    this.formKey = '';
  }

  render() {
    const tabs: { id: SettingsTab; label: string; icon: string }[] = [
      { id: 'account', label: '账户管理', icon: '👤' },
      { id: 'system', label: '系统设置', icon: '⚙️' },
      { id: 'models', label: '模型管理', icon: '🤖' },
      { id: 'help', label: '帮助与反馈', icon: '❓' },
    ];

    const settingsSidebar = html`
      <div class="settings-sidebar">
        <div class="back-btn" @click=${() => setView('chat')}>
          ← 退出
        </div>
        ${tabs.map(tab => html`
          <div class="settings-item ${this.activeTab === tab.id ? 'active' : ''}"
            @click=${() => setSettingsTab(tab.id)}>
            ${tab.icon} ${tab.label}
          </div>
        `)}
      </div>
    `;

    return html`
      ${settingsSidebar}
      <div class="settings-content">
        <!-- Account -->
        ${this.activeTab === 'account' ? html`
          <div class="page-title">👤 账户管理</div>
          <div class="card">
            <div class="card-title">用户信息</div>
            <div class="info-row"><span class="info-label">用户名</span><span class="info-value">Justinian</span></div>
            <div class="info-row"><span class="info-label">用户ID</span><span class="info-value" style="font-family:var(--font-mono);font-size:var(--font-size-xs)">usr_chemcode_001</span></div>
            <div class="info-row"><span class="info-label">邮箱</span><span class="info-value">justinian@example.com</span></div>
          </div>
          <div style="display:flex;gap:var(--spacing-xs)">
            <button class="auth-btn">编辑资料</button>
            <button class="auth-btn outline">登出</button>
          </div>
        ` : ''}

        <!-- System -->
        ${this.activeTab === 'system' ? html`
          <div class="page-title">⚙️ 系统设置</div>
          <div class="card">
            <div class="setting-row">
              <span class="setting-label">语言</span>
              <div class="setting-control">
                <select .value=${this.language} @change=${(e: Event) => setLanguage((e.target as HTMLSelectElement).value as Lang)}>
                  <option value="zh">中文</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
            <div class="setting-row">
              <span class="setting-label">字体大小</span>
              <div class="setting-control">
                <select .value=${String(this.fontSize)} @change=${(e: Event) => setFontSize(Number((e.target as HTMLSelectElement).value))}>
                  <option value="12">12px</option>
                  <option value="13">13px</option>
                  <option value="14">14px</option>
                  <option value="15">15px</option>
                  <option value="16">16px</option>
                </select>
              </div>
            </div>
            <div class="setting-row">
              <span class="setting-label">主题</span>
              <div class="setting-control">
                <select .value=${this.theme} @change=${(e: Event) => setThemeMode((e.target as HTMLSelectElement).value as ThemeMode)}>
                  <option value="light">浅色模式</option>
                  <option value="dark">深色模式</option>
                </select>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Models -->
        ${this.activeTab === 'models' ? html`
          <div class="page-title">🤖 模型管理</div>
          <div class="card">
            <div class="info-row" style="border-bottom:0.5px solid var(--color-border-tertiary);padding-bottom:var(--spacing-sm)">
              <span style="font-size:var(--font-size-sm);color:var(--color-text-secondary)">提示：支持 OpenAI 兼容协议</span>
            </div>
            ${this.models.map(m => html`
              <div class="model-item">
                <div>
                  <div class="model-name">${m.name}</div>
                  <div class="model-url">${m.apiUrl}</div>
                </div>
                <div style="display:flex;gap:4px">
                  <button class="edit-btn">编辑</button>
                  <button class="edit-btn danger" @click=${() => removeModel(m.name)}>删除</button>
                </div>
              </div>
            `)}
            <button class="add-btn" @click=${() => this.showAddModel = true}>+ 配置新模型</button>
          </div>

          ${this.showAddModel ? html`
            <div class="modal-overlay" @click=${() => this.showAddModel = false}>
              <div class="modal-box" @click=${(e: Event) => e.stopPropagation()}>
                <div class="modal-title">配置新模型</div>
                <div class="modal-form">
                  <div class="form-group">
                    <label class="form-label">模型名称</label>
                    <input type="text" placeholder="例如: DeepSeek-V4" .value=${this.formName} @input=${(e: InputEvent) => this.formName = (e.target as HTMLInputElement).value} />
                  </div>
                  <div class="form-group">
                    <label class="form-label">API URL</label>
                    <input type="text" placeholder="https://api.deepseek.com" .value=${this.formUrl} @input=${(e: InputEvent) => this.formUrl = (e.target as HTMLInputElement).value} />
                  </div>
                  <div class="form-group">
                    <label class="form-label">API Key</label>
                    <input type="password" placeholder="sk-..." .value=${this.formKey} @input=${(e: InputEvent) => this.formKey = (e.target as HTMLInputElement).value} />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Provider</label>
                    <select .value=${this.formProvider} @change=${(e: Event) => this.formProvider = (e.target as HTMLSelectElement).value}>
                      <option value="openai">OpenAI</option>
                      <option value="deepseek">DeepSeek</option>
                      <option value="anthropic">Anthropic</option>
                      <option value="google">Google</option>
                      <option value="other">其他</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>
                      <input type="checkbox" .checked=${this.formContext} @change=${(e: Event) => this.formContext = (e.target as HTMLInputElement).checked} />
                      <span style="font-size:var(--font-size-sm)"> 支持上下文</span>
                    </label>
                  </div>
                </div>
                <div class="modal-actions">
                  <button class="edit-btn" @click=${() => this.showAddModel = false}>取消</button>
                  <button class="auth-btn" @click=${this.onSaveModel}>保存</button>
                </div>
              </div>
            </div>
          ` : ''}
        ` : ''}

        <!-- Help -->
        ${this.activeTab === 'help' ? html`
          <div class="page-title">❓ 帮助与反馈</div>
          <div class="card">
            <div class="card-title">使用帮助</div>
            <p style="font-size:var(--font-size-sm);line-height:1.8;color:var(--color-text-secondary)">
              ChemCode 是一个计算化学 AI Agent 平台。<br/>
              如需帮助，请查看文档或联系支持团队。
            </p>
          </div>
          <div class="card">
            <div class="card-title">反馈方式</div>
            <p style="font-size:var(--font-size-sm);color:var(--color-text-secondary)">📧 support@chemcode.dev</p>
          </div>
          <div class="card">
            <div class="card-title">版本信息</div>
            <div class="info-row"><span class="info-label">版本</span><span class="info-value">v1.0.0</span></div>
            <div class="info-row"><span class="info-label">构建时间</span><span class="info-value">2026-05-31</span></div>
          </div>
        ` : ''}
      </div>
    `;
  }
}
