# 🎧 Binaural Beats Explorer / 双耳拍体验器

一个开源的交互式双耳拍体验工具。基于 Web Audio API，纯前端，零依赖，浏览器直接运行。

**👉 [在线体验](https://thomas-hiddenpeak.github.io/binaural-beats/)**

> **必须佩戴耳机使用。** 双耳拍的原理要求左右耳分别接收不同频率的信号，用扬声器无效。

---

## 这是什么

双耳拍（Binaural Beats）是一种听觉现象：当左右耳分别听到频率略有差异的纯音（例如左耳 395 Hz、右耳 405 Hz），大脑会在中枢层面感知到一种与差频（此例为 10 Hz）对应的节律性搏动。这个搏动**不存在于物理声波中**，而是脑干上橄榄核（Superior Olivary Complex）对双耳相位差进行神经编码的产物。

本工具让你可以亲自体验并探索这一现象，提供三种模式：

| 模式 | 原理 | 特点 |
|------|------|------|
| 🎵 **纯音** | 经典双耳拍 | 最清晰的搏动感知，适合入门体验 |
| 🎶 **音乐频移** | FFT-SSB 精确频移 | 上传任意音频，全频段产生同一差频 |
| 🕉 **持续音** | 多泛音线性频移 | 坦布拉 / 颂钵 / 管风琴 / 合成Pad |

支持三种**频率分配策略**：

| 策略 | 说明 | 推荐场景 |
|------|------|---------|
| ⚖️ 对称分配 | 双耳各移 ±½ 差频 | **默认推荐**，听感最均衡 |
| ➡️ 仅右耳频移 | 左耳原始，右耳 +差频 | 单侧对照体验 |
| ⬅️ 仅左耳频移 | 左耳 -差频，右耳原始 | 单侧对照体验 |

## 科学背景与诚实澄清

### ✅ 已被科学确认的事实

- **双耳拍是真实的听觉-神经现象。** 自 Heinrich Wilhelm Dove 于 1839 年首次描述以来，大量电生理研究证实了脑干对双耳频差的相位锁定响应（Licklider, 1948; Wernick & Starr, 1968）。
- **脑干频率跟随反应（FFR）可被客观测量。** EEG 可以记录到与差频同步的稳态诱发电位，这不是主观臆测（Pratt et al., 2010; Gao et al., 2014）。
- **频率跟随存在上限。** 当差频超过约 30–35 Hz，脑干的相位锁定能力急剧下降（Licklider, 1948），搏动感知瓦解为两个独立音调——本工具的"瓦解区"预设可让你直接体验这一边界。

### ⚠️ 被过度商业营销夸大的部分

市面上大量双耳拍产品声称可以"提升智力"、"替代冥想"、"治疗失眠/焦虑/ADHD"，甚至"开发松果体"。**对此需要保持清醒的批判性认识：**

1. **脑干 FFR ≠ 皮层脑波同步。** 双耳拍在脑干产生的频率跟随反应，并不等于整个大脑皮层的节律被"夹带"（entrained）到同一频率。这是一个层级上的错误推断。目前缺乏强有力的证据证明听双耳拍可以可靠地改变皮层主导脑波频段（Orozco Perez et al., 2020; Systematic reviews by Garcia-Argibay et al., 2019）。

2. **安慰剂效应和期望效应显著。** 多项双盲对照研究发现，受试者在被告知"这是放松频率"时报告更放松，而实际播放内容是否包含双耳拍并无显著差异（Wahbeh et al., 2007）。**你的主观感受很可能源于放松场景本身（闭眼、安静、耳机隔离外界），而非双耳拍的特异性作用。**

3. **没有任何权威医疗机构将双耳拍列为治疗手段。** FDA、WHO、NIH 的临床指南中均无双耳拍疗法。将其作为焦虑、失眠或注意力障碍的治疗方式缺乏循证支持。

4. **"Delta 波助眠、Beta 波提神"是过度简化。** 脑波频段与意识状态之间的关系远比通俗科普描述的复杂，不是简单的一一对应。

### 🔬 本工具的科学探索价值

尽管疗效声明缺乏支撑，双耳拍本身作为**心理声学和神经科学的教学演示工具**仍然有明确价值：

- **体验听觉系统的非线性特性**：你的大脑"听到"了物理世界中不存在的节拍，这是感知不等于物理输入的直观演示。
- **探索频率跟随的边界**：亲身感受 30+ Hz 差频时搏动消失的过程，比任何教科书描述都更直观。
- **理解 SSB 频移**：音乐模式使用的单边带调制是通信工程的经典技术，这里将其可听化。
- **差频感知的主观体验**：不同人对相同参数的感知可能不同，这本身就是心理声学研究的有趣课题。

**本工具是实验性体验工具，不是医疗器械，不做任何治疗承诺。**

## 使用方法

1. 打开网页（推荐 Chrome / Edge / Safari）
2. **佩戴耳机**
3. 选择模式，点击开始
4. 调节差频、频率分配等参数，感受搏动变化
5. 音乐模式下可上传自己的 MP3/WAV/FLAC 文件

## 技术实现

- **纯前端**，零依赖，零后端，ES Module 模块化架构
- Web Audio API（OscillatorNode / AudioWorklet / ChannelMerger）
- SSB 调制运行于 AudioWorklet 音频渲染线程（ScriptProcessorNode 自动回退）
- Web Worker 离线预处理：手写 radix-2 Cooley-Tukey FFT + overlap-save 分块 Hilbert 变换
- 立体声独立处理，保留原始声像定位
- 循环 crossfade 消除接缝爆音
- Canvas 实时差频包络可视化
- 拖拽上传音频文件

### 项目结构

```
├── index.html                  # 纯结构，无内联脚本/样式
├── css/style.css               # 全部样式
├── js/
│   ├── app.js                  # 应用入口，模块组装
│   ├── audio-engine.js         # 音频引擎 Facade
│   ├── modes/
│   │   ├── base-mode.js        # 模式抽象基类 (Template Method)
│   │   ├── pure-tone.js        # 纯音模式
│   │   ├── music-ssb.js        # 音乐SSB频移模式
│   │   └── drone.js            # 持续音模式
│   ├── ui/
│   │   ├── visualizer.js       # Canvas波形可视化
│   │   ├── info-panel.js       # 频段信息面板
│   │   ├── file-handler.js     # 文件上传/拖放
│   │   └── controls.js         # 控件绑定与参数读取
│   ├── utils/
│   │   └── freq-distribution.js # 频率分配策略 (Strategy Pattern)
│   └── workers/
│       ├── hilbert-worker.js   # FFT/Hilbert Web Worker
│       └── ssb-worklet.js      # SSB AudioWorklet Processor
└── README.md
```

### 设计模式

| 模式 | 应用 |
|------|------|
| **Strategy** | 频率分配策略（对称/仅左/仅右），可独立扩展新的分配算法 |
| **Template Method** | `BaseMode` 定义 start/stop/update 生命周期，子类实现具体音频图 |
| **Facade** | `AudioEngine` 统一管理 AudioContext、模式切换、参数传递 |

## 工程探索历程

这个项目的演进过程本身就值得记录——每一步都是从"听起来不太对"出发，追溯到信号处理的根本问题。

### 第一步：纯音双耳拍

最基础的实现：左右耳各放一个正弦波，频率差即为差频。Web Audio API 的 `OscillatorNode` 直接支持，几行代码即可。这一步没有任何技术难度，但它建立了核心体验——你能清晰地"听到"一个物理上不存在的搏动。

### 第二步：音乐模式——为什么不能简单地"调音高"

纯音的体验有限，自然想到：能不能用自己喜欢的音乐来产生双耳拍？

**朴素想法**：把右耳的音频播放速度加快一点？——不行。变速会同时改变时长和所有频率的相对关系，而且 Pitch Shifting（变调不变速）在频域上的操作并非线性平移，它保持的是频率比例关系（乘法），而双耳拍需要的是线性频移（加法）。一段音乐里 200 Hz 和 2000 Hz 的分量都需要各自 +10 Hz，变成 210 Hz 和 2010 Hz，而不是等比放大。

**正确方案**：SSB（Single-Sideband）单边带调制——通信工程中的经典技术。

将信号 $x(t)$ 通过 Hilbert 变换得到解析信号 $x_a(t) = x(t) + j\hat{x}(t)$，然后：

$$y(t) = \text{Re}\left[x_a(t) \cdot e^{j2\pi \Delta f \cdot t}\right] = x(t)\cos(2\pi \Delta f \cdot t) - \hat{x}(t)\sin(2\pi \Delta f \cdot t)$$

这实现了全频段的精确线性平移 $\Delta f$，无下边带泄漏。

### 第三步：Hilbert 变换的工程实现

理论直接但实现有坑：

- **不能对全长音频做单次 FFT**：一首 5 分钟 44.1kHz 的歌约 1300 万采样点，`nextPow2` 后是 $2^{24}$ = 16M 点，两个 Float32Array 就耗 128MB 内存，长音频直接 OOM。
- **解决方案**：overlap-save 分块处理。每块 32768 点 FFT，前后各留 4096 点重叠区作为 guard band，只取中间"可信"部分拼接。这是数字信号处理教科书中处理长序列卷积的标准方法，但从零实现时要小心边界对齐。
- **UI 不能卡死**：FFT 是 CPU 密集操作，且浏览器主线程是单线程。使用 `async/await` + `setTimeout(0)` 在每几个块之后让出控制权，使进度条能更新、UI 保持响应。

### 第四步：单耳感知问题与对称分配

实现功能后实际试听发现：高差频时（如 30 Hz），右耳的音色变化明显可感知——因为整首歌的所有频率分量都向上平移了 30 Hz，谐波关系被破坏，音色"变味"了。

这不是 bug，而是 SSB 频移的固有特性。但差频全部施加在一只耳朵上，让这种失真集中而明显。

**解决方案**：引入频率分配策略——对称模式下，左耳下移 $-\Delta f/2$，右耳上移 $+\Delta f/2$，每耳的实际频移减半，音色失真大幅降低，而双耳差频不变。数学上：

$$y_L(t) = \text{Re}\left[x_a(t) \cdot e^{-j\pi \Delta f \cdot t}\right], \quad y_R(t) = \text{Re}\left[x_a(t) \cdot e^{+j\pi \Delta f \cdot t}\right]$$

$$f_{R} - f_{L} = \Delta f \quad \text{（差频守恒）}$$

### 第五步：持续音模式——泛音结构的双耳拍

纯音太单调，音乐频移有音色失真——能否构造一类自然且适合长时间聆听的声音？

答案是用加法合成（Additive Synthesis）构建多泛音持续音（Drone），每个泛音分量独立进行线性频移。坦布拉、颂钵等乐器的泛音结构各有特色，为搏动体验提供不同的声音纹理。颂钵的非谐波泛音比（2.71, 4.8, 7.2）让搏动节奏产生有趣的复合节律。

### 反思

整个过程的模式是：**提出想法 → 实现 → 试听 → 发现问题 → 回溯到信号处理理论 → 找到更好的方案**。每一步的"不对劲"都有精确的物理/数学解释，这比任何教科书都有说服力。

### 第六步：架构优化——把计算搬到正确的线程

前五步实现了功能，但工程质量留有遗憾：

- **Hilbert 预处理卡主线程**：虽然用了 `async/await` + `setTimeout(0)` 让出控制权，但 FFT 密集计算仍在主线程执行，UI 对于长音频仍有卡顿感。
- **ScriptProcessorNode 已被标记为 deprecated**：它在主线程的音频回调中运行 SSB 调制逻辑，高负载时可能产生音频 glitch。
- **单声道混缩丢失空间信息**：原始立体声音乐被混缩为 mono 后再做 Hilbert 变换，损失了立体声场。
- **循环播放有接缝 click**：播放到末尾直接跳回开头，波形不连续产生爆音。

解决方案是一组协同优化：

1. **Web Worker 预处理**：将 FFT 和 Hilbert 变换的全部计算移入 Web Worker。Worker 代码以 Blob URL 内联（保持单文件部署），通过 `postMessage` + Transferable 传递大数组实现零拷贝通信。主线程在整个预处理过程中完全不阻塞。

2. **AudioWorklet 实时处理**：将 SSB 调制从主线程的 ScriptProcessorNode 迁移到 AudioWorklet。Worklet 代码同样以 Blob URL 内联，通过 `audioWorklet.addModule()` 注册。SSB 运算在独立的音频渲染线程执行，不再与 UI 竞争 CPU 时间。保留 ScriptProcessorNode 作为自动回退（如果 AudioWorklet 不可用）。

3. **立体声保持**：对每个声道独立计算 Hilbert 变换，SSB 调制时左耳输出左声道、右耳输出右声道（各自施加不同的频移量）。内存翻倍，但保留了原始录音的声像定位。

4. **循环 Crossfade**：在播放末尾 2048 采样（~46ms）处开始与开头做线性交叉渐变，消除循环衔接的波形不连续。循环复位点跳到 `cfLen` 处以避免重复已渐入的内容。

5. **拖拽上传**：为文件选择区域添加 `dragover`/`dragleave`/`drop` 事件处理。

### 第七步：模块化重构——从单文件到可维护架构

前六步的成果是一个功能完整的单 HTML 文件（~1050 行），所有 CSS、HTML、JS 内联。Worker 和 Worklet 代码以字符串形式嵌入，通过 Blob URL 动态创建。这种"单文件部署"虽方便，但随着功能增长，维护性急剧下降：任何修改都需要在一个巨大文件中定位代码，模式之间相互耦合，无法独立测试。

重构方案：

1. **HTML/CSS/JS 三层分离**：`index.html` 只保留纯结构标记，无任何 `<style>` 或 `<script>` 内联代码。CSS 提取到 `css/style.css`。JS 通过 `<script type="module">` 加载 ES Module 入口。

2. **设计模式指导拆分**：
   - **Strategy**：频率分配策略（`freq-distribution.js`）将对称/仅左/仅右三种算法封装为可替换的策略对象，新增分配方式只需添加一个策略。
   - **Template Method**：`BaseMode` 定义音频模式的生命周期（start → update → stop），三种模式各自实现音频图构建逻辑，互不干扰。
   - **Facade**：`AudioEngine` 为 UI 层提供统一的 `start()`/`stop()`/`update()` 接口，隐藏 AudioContext 管理、模式切换、WorkerWorklet 协调等复杂性。

3. **Worker/Worklet 文件独立**：不再用 Blob URL 从字符串创建，而是作为独立 `.js` 文件直接引用。调试友好（DevTools 可直接断点），也为未来 Service Worker 缓存铺路。

4. **UI 模块化**：可视化、信息面板、文件处理、控件绑定各自独立，通过 `app.js` 组装。每个 UI 模块只关心自己的 DOM 交互，不直接操作音频。

## 参考文献

- Dove, H. W. (1839). *Repertorium der Physik*, 共发现双耳拍现象
- Licklider, J. C. R., Webster, J. C., & Hedlun, J. M. (1950). On the frequency limits of binaural beats. *JASA*, 22(4), 468–473.
- Pratt, H., et al. (2010). Auditory brainstem and middle latency responses to binaural beats. *International Journal of Audiology*, 49(12), 894–904.
- Garcia-Argibay, M., Santed, M. A., & Reales, J. M. (2019). Efficacy of binaural auditory beats in cognition, anxiety, and pain perception: a meta-analysis. *Psychological Research*, 83(2), 357–372.
- Orozco Perez, H. D., Dumas, G., & Bhatt, S. (2020). Binaural beats through the auditory pathway: from brainstem to connectivity patterns. *eNeuro*, 7(2).

## License

MIT
