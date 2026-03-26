# 🎧 Binaural Beats Explorer / 双耳拍体验器

基于 Web Audio API 的交互式双耳拍体验工具，无需安装，浏览器直接运行。

## 功能

### binaural-beats.html — 基础版
- 纯音双耳拍体验
- 载波频率 / 差频 / 音量实时调节
- 多种差频预设（Delta / Theta / Alpha / Beta / 瓦解区）
- 实时波形可视化

### binaural-beats-pro.html — 增强版
三种双耳拍模式：

| 模式 | 原理 | 特点 |
|------|------|------|
| 🎵 纯音 | 经典双耳拍 | 最清晰的搏动感 |
| 🎶 音乐频移 | FFT-SSB 线性频移 | 上传任意音频，全频段产生同一差频 |
| 🕉 持续音 | 多泛音线性频移 | 坦布拉 / 颂钵 / 管风琴 / 合成Pad |

**音乐频移模式**使用 FFT overlap-save 预计算精确 Hilbert 变换（解析信号），播放时进行实时 SSB 单边带调制，确保右耳信号为纯频移（无下边带泄漏）。

## 使用方法

1. 用浏览器打开 HTML 文件（推荐 Chrome / Edge / Safari）
2. **必须佩戴耳机**——左右耳需分别接收不同频率
3. 点击开始，调节参数体验

## 原理简述

左右耳分别听到频率略有不同的纯音（如左 395 Hz、右 405 Hz），大脑在脑干上橄榄核对两路信号进行相位比较，产生与差频（10 Hz）对应的节律性搏动感知。这个差频并非真实声波，而是中枢神经系统的计算产物。

## 技术栈

- 纯前端，零依赖
- Web Audio API（OscillatorNode / ScriptProcessorNode / ChannelMerger）
- 手写 radix-2 FFT + overlap-save Hilbert 变换
- Canvas 实时波形渲染

## License

MIT
