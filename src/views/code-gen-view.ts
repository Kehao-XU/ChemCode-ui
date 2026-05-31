import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { CALC_TYPE_LABELS, FORCE_FIELD_OPTIONS } from '../types';

const SAMPLE_GROMACS = `; GROMACS 生产模拟参数文件 (md.mdp)
; 由 ChemCode AI Agent 生成

title               = Production MD
; Run parameters
integrator          = md
nsteps              = 50000000
dt                  = 0.002
; Output control
nstxout             = 5000
nstvout             = 5000
nstenergy           = 5000
nstlog              = 5000
; Bond parameters
constraint_algorithm = lincs
constraints         = h-bonds
continuation        = yes
; Neighbor searching
cutoff-scheme       = Verlet
ns_type             = grid
nstlist             = 10
rlist               = 1.0
; Electrostatics
coulombtype         = PME
rcoulomb            = 1.0
; van der Waals
vdwtype             = cutoff
rvdw                = 1.0
; Temperature coupling
tcoupl              = V-rescale
tc-grps             = Protein Non-Protein
tau_t               = 0.1   0.1
ref_t               = 310   310
; Pressure coupling
pcoupl              = Parrinello-Rahman
pcoupltype          = isotropic
tau_p               = 2.0
ref_p               = 1.0
compressibility     = 4.5e-5
; Periodic boundary conditions
pbc                 = xyz
; Dispersion correction
DispCorr            = EnerPres
; Velocity generation
gen_vel             = no
`;

const SAMPLE_PYTHON = `# 轨迹分析脚本 - MDAnalysis
# 由 ChemCode AI Agent 生成

import MDAnalysis as mda
import numpy as np
import matplotlib.pyplot as plt
from MDAnalysis.analysis import rms, hbonds, align

# 加载体系
u = mda.Universe("topol.tpr", "traj.xtc")
ref = mda.Universe("topol.tpr", "em.gro")

# 1. RMSD 分析
print("计算 RMSD...")
aligner = align.AlignTraj(u, ref, select="backbone", in_memory=True)
aligner.run()

rmsd_analysis = rms.RMSD(u, select="backbone")
rmsd_analysis.run()

plt.figure(figsize=(10, 6))
plt.plot(rmsd_analysis.results.rmsd[:, 1] / 1000,
         rmsd_analysis.results.rmsd[:, 2] * 10)
plt.xlabel("Time (ns)")
plt.ylabel("RMSD (Å)")
plt.title("Backbone RMSD vs Initial Structure")
plt.savefig("rmsd_analysis.png", dpi=150)
print("RMSD 图已保存: rmsd_analysis.png")

# 2. 回旋半径
from MDAnalysis.analysis import rdf
# ... (更多分析代码)
`;

@customElement('code-gen-view')
export class CodeGenView extends LitElement {
  static styles = css`
    :host { display: block; padding: var(--spacing-lg); max-width: 1280px; margin: 0 auto; }

    .page-title { font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); margin-bottom: var(--spacing-lg); }

    .code-layout {
      display: grid;
      grid-template-columns: 340px 1fr;
      gap: var(--spacing-md);
    }
    @media (max-width: 860px) {
      .code-layout { grid-template-columns: 1fr; }
    }

    .panel {
      background: var(--color-background-primary);
      border: 0.5px solid var(--color-border-tertiary);
      border-radius: var(--border-radius-lg);
      padding: var(--spacing-md);
    }
    .panel-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-medium);
      margin-bottom: var(--spacing-md);
      padding-bottom: var(--spacing-xs);
      border-bottom: 0.5px solid var(--color-border-tertiary);
    }

    .param-group { margin-bottom: var(--spacing-sm); }
    .param-label { display: block; font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); margin-bottom: 4px; }
    .param-hint { font-size: var(--font-size-xs); color: var(--color-text-tertiary); margin-top: 2px; }

    .preview-area {
      display: flex;
      flex-direction: column;
    }
    .tabs {
      display: flex;
      border-bottom: 0.5px solid var(--color-border-tertiary);
      margin-bottom: var(--spacing-sm);
    }
    .tab {
      padding: 8px 16px;
      cursor: pointer;
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      border-bottom: 2px solid transparent;
      transition: all var(--transition-fast);
    }
    .tab.active {
      color: var(--color-accent);
      border-bottom-color: var(--color-accent);
    }
    .code-output {
      flex: 1;
      min-height: 400px;
    }
    .toolbar {
      display: flex;
      gap: var(--spacing-xs);
      margin-top: var(--spacing-sm);
    }
  `;

  @property({ type: String }) activeTab = 'gromacs';
  private tabs = [
    { id: 'gromacs', label: 'GROMACS (.mdp)' },
    { id: 'python', label: 'Python 分析脚本' },
  ];

  private get currentCode() {
    return this.activeTab === 'gromacs' ? SAMPLE_GROMACS : SAMPLE_PYTHON;
  }

  private onCopy() {
    navigator.clipboard.writeText(this.currentCode);
    alert('代码已复制到剪贴板！');
  }

  private onDownload() {
    const ext = this.activeTab === 'gromacs' ? 'mdp' : 'py';
    const blob = new Blob([this.currentCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chemcode_output.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  render() {
    return html`
      <div>
        <div class="page-title">代码生成与验证</div>

        <div class="code-layout">
          <!-- Left: Parameter panel -->
          <div class="panel">
            <div class="panel-title">参数配置</div>

            <div class="param-group">
              <label class="param-label">计算类型</label>
              <select class="input select">
                <option value="molecular_dynamics">分子动力学 (MD)</option>
                <option value="dpd">DPD耗散粒子动力学</option>
                <option value="quantum_chemistry">量子化学</option>
                <option value="dft">DFT密度泛函理论</option>
              </select>
            </div>

            <div class="param-group">
              <label class="param-label">力场</label>
              <select class="input select">
                ${FORCE_FIELD_OPTIONS.map(f => html`<option>${f}</option>`)}
              </select>
            </div>

            <div class="param-group">
              <label class="param-label">温度 (K)</label>
              <input class="input" type="number" value="310" />
            </div>

            <div class="param-group">
              <label class="param-label">模拟时间 (ns)</label>
              <input class="input" type="number" value="100" />
              <div class="param-hint">总模拟时间，自动计算步数</div>
            </div>

            <div class="param-group">
              <label class="param-label">温度耦合</label>
              <select class="input select">
                <option>V-rescale</option>
                <option>Berendsen</option>
                <option>Nose-Hoover</option>
              </select>
            </div>

            <div class="param-group">
              <label class="param-label">压力耦合</label>
              <select class="input select">
                <option>Parrinello-Rahman</option>
                <option>Berendsen</option>
                <option>无</option>
              </select>
            </div>

            <button class="btn btn-primary" style="width:100%;margin-top:var(--spacing-sm)"
              @click=${() => {}}>
              ⚡ 生成代码
            </button>

            <button class="btn btn-secondary" style="width:100%;margin-top:var(--spacing-xs)">
              🔍 验证代码
            </button>
          </div>

          <!-- Right: Code preview -->
          <div class="panel preview-area">
            <div class="tabs">
              ${this.tabs.map(t => html`
                <div class="tab ${this.activeTab === t.id ? 'active' : ''}"
                  @click=${() => this.activeTab = t.id}>${t.label}</div>
              `)}
            </div>

            <div class="code-output">
              <chemcode-code-block code=${this.currentCode} language=${this.activeTab === 'python' ? 'python' : 'shell'}></chemcode-code-block>
            </div>

            <div class="toolbar">
              <button class="btn btn-sm btn-secondary" @click=${this.onCopy}>📋 复制代码</button>
              <button class="btn btn-sm btn-secondary" @click=${this.onDownload}>⬇️ 下载文件</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
