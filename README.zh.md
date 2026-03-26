# 🎧 双耳拍体验器

开源的交互式双耳拍体验工具。纯前端，零依赖，浏览器直接运行。

**👉 [在线体验](https://thomas-hiddenpeak.github.io/binaural-beats/)** · [English](README.md)

> **必须佩戴耳机使用。** 双耳拍的原理要求左右耳分别接收不同频率的信号，用扬声器无效。

---

## 这是什么

双耳拍（Binaural Beats）是一种听觉现象：当左右耳分别听到频率略有差异的纯音（例如左耳 395 Hz、右耳 405 Hz），大脑会在中枢层面感知到一种与差频（此例为 10 Hz）对应的节律性搏动。这个搏动**不存在于物理声波中**，而是脑干上橄榄核（Superior Olivary Complex）对双耳相位差进行神经编码的产物。

本工具让你可以亲自体验并探索这一现象。

## 功能特性

### 三种音频模式

| 模式 | 原理 | 特点 |
|------|------|------|
| 🎵 **纯音** | 经典双耳拍 | 最清晰的搏动感知，适合入门体验 |
| 🎶 **音乐频移** | FFT-SSB 精确频移 | 上传任意音频，全频段产生同一差频 |
| 🕉 **持续音** | 多泛音线性频移 | 坦布拉 / 颂钵 / 管风琴 / 合成Pad |

### 四种频率分配策略

| 策略 | 说明 | 推荐场景 |
|------|------|---------|
| ⚖️ 对称分配 | 双耳各移 ±½ 差频 | **默认推荐**，听感最均衡 |
| ↔️ 左右交替 | 对称分配 + 定时自动交换 | **长时间聆听推荐**，降低单耳疲劳 |
| ➡️ 仅右耳频移 | 左耳原始，右耳 +差频 | 单侧对照体验 |
| ⬅️ 仅左耳频移 | 左耳 -差频，右耳原始 | 单侧对照体验 |

### 其他特性

- Canvas 实时差频包络可视化
- 音乐模式立体声保留切换
- 循环 crossfade 无缝衔接
- 拖拽上传音频文件（MP3 / WAV / FLAC）
- 中/英双语 i18n 国际化
- PWA 支持——可安装到桌面/主屏幕，离线可用
- 移动端响应式布局 + 触摸优化

## 快速开始

1. 打开[在线体验](https://thomas-hiddenpeak.github.io/binaural-beats/)（推荐 Chrome / Edge / Safari）
2. **佩戴耳机**
3. 选择模式，点击开始
4. 调节差频、频率分配等参数，感受搏动变化
5. 音乐模式下可上传自己的音频文件

## 技术栈

纯前端，零后端，ES Modules 模块化架构：

- **Web Audio API** — OscillatorNode、AudioWorklet、ChannelMerger
- **AudioWorklet** — SSB 调制运行于音频渲染线程（ScriptProcessorNode 自动回退）
- **Web Worker** — 手写 radix-2 Cooley-Tukey FFT + overlap-save 分块 Hilbert 变换离线预处理
- **Canvas** — 实时波形可视化
- **PWA** — Service Worker cache-first 离线策略

## 项目结构

```
├── index.html                  # 纯结构，无内联脚本/样式
├── css/style.css               # 全部样式（含移动端响应式）
├── manifest.json               # PWA 清单
├── sw.js                       # Service Worker 离线缓存
├── icons/                      # PWA 图标
├── js/
│   ├── app.js                  # 应用入口，模块组装，i18n 集成
│   ├── audio-engine.js         # 音频引擎 Facade
│   ├── modes/
│   │   ├── base-mode.js        # 模式抽象基类 (Template Method)
│   │   ├── pure-tone.js        # 纯音模式
│   │   ├── music-ssb.js        # 音乐SSB频移模式
│   │   └── drone.js            # 持续音模式
│   ├── ui/
│   │   ├── visualizer.js       # Canvas 波形可视化
│   │   ├── info-panel.js       # 频段信息面板
│   │   ├── file-handler.js     # 文件上传/拖放
│   │   └── controls.js         # 控件绑定与参数读取
│   ├── utils/
│   │   └── freq-distribution.js # 频率分配策略 (Strategy Pattern)
│   ├── i18n/
│   │   ├── i18n.js             # 国际化管理器
│   │   ├── zh.js               # 中文语言包
│   │   └── en.js               # 英文语言包
│   └── workers/
│       ├── hilbert-worker.js   # FFT/Hilbert Web Worker
│       └── ssb-worklet.js      # SSB AudioWorklet Processor
├── docs/
│   ├── en/                     # English documentation
│   └── zh/                     # 中文文档
├── README.md                   # English (default)
└── README.zh.md                # 中文版（本文件）
```

## 📖 详细文档

提供中英双语详细文档：

| 主题 | 中文 | English |
|------|------|---------|
| 科学背景与诚实澄清 | [科学背景](docs/zh/science.md) | [Science](docs/en/science.md) |
| 技术架构与设计模式 | [技术架构](docs/zh/architecture.md) | [Architecture](docs/en/architecture.md) |
| 工程探索历程（8步演进） | [工程探索历程](docs/zh/engineering-journey.md) | [Engineering Journey](docs/en/engineering-journey.md) |

## 许可证

MIT
