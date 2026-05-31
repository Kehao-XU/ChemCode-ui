import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { setView, getState } from '../state';

@customElement('results-view')
export class ResultsView extends LitElement {
  static styles = css`
    :host { display: block; padding: var(--spacing-lg); max-width: 1280px; margin: 0 auto; }

    .page-title { font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); margin-bottom: var(--spacing-lg); }

    /* 3D Viewer placeholder */
    .viewer-section {
      background: var(--color-background-primary);
      border: 0.5px solid var(--color-border-tertiary);
      border-radius: var(--border-radius-lg);
      padding: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
    }
    .section-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-medium);
      margin-bottom: var(--spacing-sm);
    }
    .viewer-3d {
      width: 100%;
      height: 360px;
      background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f0 100%);
      border-radius: var(--border-radius-md);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--color-text-tertiary);
      position: relative;
      overflow: hidden;
    }
    .viewer-3d .molecule-icon { font-size: 64px; margin-bottom: var(--spacing-sm); }
    .viewer-toolbar {
      display: flex;
      gap: var(--spacing-xs);
      padding: var(--spacing-xs) 0;
      flex-wrap: wrap;
    }
    .viewer-btn {
      padding: 4px 12px;
      border: 0.5px solid var(--color-border-tertiary);
      border-radius: var(--border-radius-sm);
      background: var(--color-background-primary);
      cursor: pointer;
      font-size: var(--font-size-xs);
      color: var(--color-text-secondary);
    }
    .viewer-btn:hover { border-color: var(--color-accent); color: var(--color-accent); }

    /* Charts grid */
    .charts-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
    }
    @media (max-width: 768px) { .charts-grid { grid-template-columns: 1fr; } }

    .chart-card {
      background: var(--color-background-primary);
      border: 0.5px solid var(--color-border-tertiary);
      border-radius: var(--border-radius-lg);
      padding: var(--spacing-md);
    }
    .chart-title {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      margin-bottom: var(--spacing-sm);
    }
    .chart-placeholder {
      width: 100%;
      height: 200px;
      background: var(--color-background-secondary);
      border-radius: var(--border-radius-md);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--color-text-tertiary);
      font-size: var(--font-size-sm);
    }
    .chart-placeholder .chart-icon { font-size: 36px; margin-bottom: var(--spacing-xs); }

    /* Stats cards */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-lg);
    }
    @media (max-width: 800px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 500px) { .stats-grid { grid-template-columns: 1fr; } }

    .stat-item {
      background: var(--color-background-primary);
      border: 0.5px solid var(--color-border-tertiary);
      border-radius: var(--border-radius-md);
      padding: var(--spacing-sm);
      text-align: center;
    }
    .stat-item .value {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-accent);
    }
    .stat-item .label {
      font-size: var(--font-size-xs);
      color: var(--color-text-secondary);
      margin-top: 2px;
    }

    .empty-state {
      text-align: center;
      padding: var(--spacing-xl);
      color: var(--color-text-tertiary);
    }
  `;

  render() {
    return html`
      <div>
        <div class="page-title">结果分析</div>

        <!-- Task selector -->
        <div style="margin-bottom:var(--spacing-md);display:flex;gap:var(--spacing-sm);align-items:center;">
          <label style="font-size:var(--font-size-sm);color:var(--color-text-secondary);">选择任务：</label>
          <select class="input select" style="width:280px;padding:6px 28px 6px 10px;font-size:var(--font-size-sm);">
            ${getState().tasks.filter(t => t.status === 'completed' || t.status === 'failed').map(t => html`
              <option>${t.id} - ${t.name}</option>
            `)}
          </select>
        </div>

        <!-- 3D Molecular Viewer -->
        <div class="viewer-section">
          <div class="section-title">🔬 分子结构可视化</div>
          <div class="viewer-3d">
            <div class="molecule-icon">🧪</div>
            <div>3D 分子结构查看器</div>
            <div style="font-size:var(--font-size-xs);margin-top:var(--spacing-xxs)">鼠标拖拽旋转 · 滚轮缩放</div>
          </div>
          <div class="viewer-toolbar">
            <button class="viewer-btn">↺ 重置视角</button>
            <button class="viewer-btn">🏷 标签显示</button>
            <button class="viewer-btn">📏 距离测量</button>
            <button class="viewer-btn">✂️ 截面视图</button>
            <button class="viewer-btn">▶️ 播放轨迹</button>
            <button class="viewer-btn">📷 截图</button>
          </div>
        </div>

        <!-- Charts -->
        <div class="charts-grid">
          <div class="chart-card">
            <div class="chart-title">能量-时间曲线</div>
            <div class="chart-placeholder">
              <div class="chart-icon">📈</div>
              <div>图表加载区域</div>
              <div style="font-size:var(--font-size-xs)">势能 · 动能 · 总能量</div>
            </div>
          </div>
          <div class="chart-card">
            <div class="chart-title">温度-时间曲线</div>
            <div class="chart-placeholder">
              <div class="chart-icon">🌡️</div>
              <div>图表加载区域</div>
              <div style="font-size:var(--font-size-xs)">温度波动 · 平均值</div>
            </div>
          </div>
          <div class="chart-card">
            <div class="chart-title">压力-时间曲线</div>
            <div class="chart-placeholder">
              <div class="chart-icon">📊</div>
              <div>图表加载区域</div>
              <div style="font-size:var(--font-size-xs)">压力波动 · 平均值</div>
            </div>
          </div>
          <div class="chart-card">
            <div class="chart-title">RMSD-时间曲线</div>
            <div class="chart-placeholder">
              <div class="chart-icon">📉</div>
              <div>图表加载区域</div>
              <div style="font-size:var(--font-size-xs)">主链RMSD · 整体RMSD</div>
            </div>
          </div>
        </div>

        <!-- Statistics -->
        <div class="viewer-section">
          <div class="section-title">📊 统计分析</div>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="value">-52.3</div>
              <div class="label">平均能量 (kJ/mol)</div>
            </div>
            <div class="stat-item">
              <div class="value">309.8</div>
              <div class="label">平均温度 (K)</div>
            </div>
            <div class="stat-item">
              <div class="value">0.12</div>
              <div class="label">温度波动 (K)</div>
            </div>
            <div class="stat-item">
              <div class="value">1.02</div>
              <div class="label">平均压力 (bar)</div>
            </div>
            <div class="stat-item">
              <div class="value">2.3e-6</div>
              <div class="label">扩散系数 (cm²/s)</div>
            </div>
          </div>
          <div style="display:flex;gap:var(--spacing-xs);margin-top:var(--spacing-sm)">
            <button class="btn btn-sm btn-secondary">📥 导出图表</button>
            <button class="btn btn-sm btn-secondary">📄 生成报告</button>
            <button class="btn btn-sm btn-secondary">🔬 径向分布函数 (RDF)</button>
          </div>
        </div>
      </div>
    `;
  }
}
