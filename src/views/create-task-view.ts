import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { setView } from '../state';
import { CALC_TYPE_LABELS, FORCE_FIELD_OPTIONS } from '../types';

@customElement('create-task-view')
export class CreateTaskView extends LitElement {
  static styles = css`
    :host { display: block; padding: var(--spacing-lg); max-width: 800px; margin: 0 auto; }

    .page-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-lg);
    }
    .back-btn {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--color-text-secondary);
      font-size: 18px;
      padding: 4px;
      border-radius: var(--border-radius-sm);
    }
    .back-btn:hover { background: var(--color-background-tertiary); }
    .page-title { font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); }

    .form-section {
      background: var(--color-background-primary);
      border: 0.5px solid var(--color-border-tertiary);
      border-radius: var(--border-radius-lg);
      padding: var(--spacing-lg);
      margin-bottom: var(--spacing-md);
    }
    .section-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-medium);
      margin-bottom: var(--spacing-md);
      padding-bottom: var(--spacing-xs);
      border-bottom: 0.5px solid var(--color-border-tertiary);
    }

    .form-group {
      margin-bottom: var(--spacing-md);
    }
    .form-label {
      display: block;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-primary);
      margin-bottom: 6px;
    }
    .form-hint {
      font-size: var(--font-size-xs);
      color: var(--color-text-tertiary);
      margin-top: 4px;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-md);
    }
    @media (max-width: 600px) {
      .form-row { grid-template-columns: 1fr; }
    }

    .file-upload {
      border: 1px dashed var(--color-border-secondary);
      border-radius: var(--border-radius-md);
      padding: var(--spacing-lg);
      text-align: center;
      cursor: pointer;
      transition: all var(--transition-fast);
      color: var(--color-text-tertiary);
    }
    .file-upload:hover {
      border-color: var(--color-accent);
      background: var(--color-accent-light);
      color: var(--color-accent);
    }
    .file-upload-icon { font-size: 24px; }
    .file-formats { font-size: var(--font-size-xs); margin-top: var(--spacing-xs); }

    .form-actions {
      display: flex;
      gap: var(--spacing-sm);
      justify-content: flex-end;
      margin-top: var(--spacing-lg);
    }

    .structure-preview {
      width: 100%;
      height: 200px;
      background: var(--color-background-secondary);
      border-radius: var(--border-radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-tertiary);
      font-size: var(--font-size-sm);
      margin-top: var(--spacing-sm);
    }
  `;

  private handleSubmit(e: Event) {
    e.preventDefault();
    // In a real app, submit to API
    alert('任务已提交！');
    setView('tasks');
  }

  render() {
    return html`
      <div>
        <div class="page-header">
          <button class="back-btn" @click=${() => setView('tasks')}>←</button>
          <div class="page-title">创建计算任务</div>
        </div>

        <form @submit=${this.handleSubmit}>
          <!-- Basic Info -->
          <div class="form-section">
            <div class="section-title">基本信息</div>
            <div class="form-group">
              <label class="form-label">任务名称</label>
              <input class="input" type="text" placeholder="例如：蛋白酶A分子动力学模拟" required />
            </div>
            <div class="form-group">
              <label class="form-label">计算类型</label>
              <select class="input select" required>
                ${Object.entries(CALC_TYPE_LABELS).map(([k, v]) => html`<option value=${k}>${v}</option>`)}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">描述信息</label>
              <textarea class="input" placeholder="描述任务目的、预期结果等..." rows="3"></textarea>
            </div>
          </div>

          <!-- Molecular Structure -->
          <div class="form-section">
            <div class="section-title">分子结构</div>
            <div class="file-upload">
              <div class="file-upload-icon">📄</div>
              <div>点击上传分子结构文件</div>
              <div class="file-formats">支持 PDB, MOL, XYZ, SDF 格式</div>
              <input type="file" style="display:none" accept=".pdb,.mol,.xyz,.sdf" />
            </div>
            <div class="structure-preview">
              🔬 分子结构预览区域（上传文件后显示）
            </div>
          </div>

          <!-- Calculation Parameters -->
          <div class="form-section">
            <div class="section-title">计算参数</div>
            <div class="form-group">
              <label class="form-label">力场选择</label>
              <select class="input select">
                <option value="">请选择力场...</option>
                ${FORCE_FIELD_OPTIONS.map(f => html`<option value=${f}>${f}</option>`)}
              </select>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">温度 (K)</label>
                <input class="input" type="number" placeholder="298" value="298" />
              </div>
              <div class="form-group">
                <label class="form-label">压力 (bar)</label>
                <input class="input" type="number" placeholder="1" value="1" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">时间步长 (fs)</label>
                <input class="input" type="number" placeholder="2" value="2" step="0.5" />
              </div>
              <div class="form-group">
                <label class="form-label">总步数</label>
                <input class="input" type="text" placeholder="10000000" />
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">输出频率 (步)</label>
              <input class="input" type="number" placeholder="5000" value="5000" />
            </div>
          </div>

          <!-- Advanced Parameters -->
          <div class="form-section">
            <div class="section-title">高级参数</div>
            <div class="form-group">
              <label class="form-label">边界条件</label>
              <select class="input select">
                <option value="pbc">周期性边界条件 (PBC)</option>
                <option value="reflective">反射边界</option>
                <option value="vacuum">真空边界</option>
              </select>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">静电作用处理</label>
                <select class="input select">
                  <option value="pme">PME (Particle Mesh Ewald)</option>
                  <option value="cutoff">截断法</option>
                  <option value="reaction_field">反应场法</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">温控方法</label>
                <select class="input select">
                  <option value="v-rescale">V-rescale</option>
                  <option value="berendsen">Berendsen</option>
                  <option value="nose-hoover">Nose-Hoover</option>
                  <option value="langevin">Langevin</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">压控方法</label>
                <select class="input select">
                  <option value="parrinello-rahman">Parrinello-Rahman</option>
                  <option value="berendsen">Berendsen</option>
                  <option value="none">无</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">约束设置</label>
                <select class="input select">
                  <option value="h-bonds">约束氢键 (LINCS)</option>
                  <option value="all-bonds">约束所有键</option>
                  <option value="none">无约束</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click=${() => setView('tasks')}>取消</button>
            <button type="button" class="btn btn-secondary">生成代码</button>
            <button type="submit" class="btn btn-primary">提交任务</button>
          </div>
        </form>
      </div>
    `;
  }
}
