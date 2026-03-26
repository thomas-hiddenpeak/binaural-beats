# 技术架构

[English Version](../en/architecture.md)

## 技术栈

- **纯前端**，零依赖，零后端，ES Module 模块化架构
- Web Audio API（OscillatorNode / AudioWorklet / ChannelMerger）
- SSB 调制运行于 AudioWorklet 音频渲染线程（ScriptProcessorNode 自动回退）
- Web Worker 离线预处理：手写 radix-2 Cooley-Tukey FFT + overlap-save 分块 Hilbert 变换
- 立体声独立处理，保留原始声像定位（可选关闭）
- 循环 crossfade 消除接缝爆音
- Canvas 实时差频包络可视化
- 拖拽上传音频文件
- 左右交替均衡模式（纯音/持续音 5 分钟定时交换，音乐模式循环边界交换）
- 中/英双语 i18n 国际化
- PWA 支持，可安装到桌面/主屏幕，离线可用
- 移动端响应式布局 + 触摸优化

## 项目结构

```
├── index.html                  # 纯结构，无内联脚本/样式
├── css/style.css               # 全部样式（含移动端响应式）
├── manifest.json               # PWA 清单
├── sw.js                       # Service Worker 离线缓存
├── icons/                      # PWA 图标
├── docs/
│   ├── en/                     # 英文文档
│   └── zh/                     # 中文文档
├── js/
│   ├── app.js                  # 应用入口，模块组装，i18n 集成
│   ├── audio-engine.js         # 音频引擎 Facade
│   ├── modes/
│   │   ├── base-mode.js        # 模式抽象基类 (Template Method)
│   │   ├── pure-tone.js        # 纯音模式（含交替定时器）
│   │   ├── music-ssb.js        # 音乐SSB频移模式（含立体声切换）
│   │   └── drone.js            # 持续音模式（含交替定时器）
│   ├── ui/
│   │   ├── visualizer.js       # Canvas波形可视化
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
└── README.md
```

## 设计模式

| 模式 | 应用 |
|------|------|
| **Strategy** | 频率分配策略（对称/仅左/仅右/交替），可独立扩展新的分配算法 |
| **Template Method** | `BaseMode` 定义 start/stop/update 生命周期，子类实现具体音频图 |
| **Facade** | `AudioEngine` 统一管理 AudioContext、模式切换、参数传递 |

## 核心实现细节

### SSB（单边带）频移

将信号 $x(t)$ 通过 Hilbert 变换得到解析信号 $x_a(t) = x(t) + j\hat{x}(t)$，然后：

$$y(t) = \text{Re}\left[x_a(t) \cdot e^{j2\pi \Delta f \cdot t}\right] = x(t)\cos(2\pi \Delta f \cdot t) - \hat{x}(t)\sin(2\pi \Delta f \cdot t)$$

这实现了全频段的精确线性平移 $\Delta f$，无下边带泄漏。

### 对称分配

对称模式下，频移平均分配到双耳：

$$y_L(t) = \text{Re}\left[x_a(t) \cdot e^{-j\pi \Delta f \cdot t}\right], \quad y_R(t) = \text{Re}\left[x_a(t) \cdot e^{+j\pi \Delta f \cdot t}\right]$$

$$f_{R} - f_{L} = \Delta f \quad \text{（差频守恒）}$$

每耳的实际频移减半，音色失真大幅降低，而双耳差频不变。

### 左右交替均衡模式

为降低长时间聆听下的单耳疲劳，定时交换频移方向：

- **纯音/持续音**：每 5 分钟通过 `linearRampToValueAtTime` 做 2.5 秒频率渐变交换。~0.2 秒的差频短暂减弱几乎不可感知。
- **音乐模式**：在循环 crossfade 边界自动交换，已有的 2048 采样交叉渐变完全遮罩频率翻转。

### Hilbert 变换：Overlap-Save 分块处理

- 一首 5 分钟 44.1kHz 的歌约 1300 万采样点，单次 FFT 需要 $2^{24}$ = 16M 点，两个 Float32Array 耗 128MB 内存。
- 解决方案：overlap-save 分块处理。每块 32768 点 FFT，前后各留 4096 点重叠，只取中间"可信"部分拼接。
- 全部计算运行在 Web Worker 中，主线程完全不阻塞。
