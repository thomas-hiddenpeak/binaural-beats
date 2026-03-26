# 🎧 Binaural Beats Explorer / 双耳拍体验器

一个开源的交互式双耳拍体验工具。基于 Web Audio API，纯前端，零依赖，浏览器直接运行。

**👉 [在线体验](https://thomas.github.io/binaural-beats/)**

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

- **纯前端单文件**，零依赖，零后端
- Web Audio API（OscillatorNode / ScriptProcessorNode / ChannelMerger）
- 手写 radix-2 Cooley-Tukey FFT + overlap-save 分块 Hilbert 变换
- 实时 SSB 单边带调制（解析信号法），支持对称/单耳频移
- Canvas 实时差频包络可视化

## 参考文献

- Dove, H. W. (1839). *Repertorium der Physik*, 共发现双耳拍现象
- Licklider, J. C. R., Webster, J. C., & Hedlun, J. M. (1950). On the frequency limits of binaural beats. *JASA*, 22(4), 468–473.
- Pratt, H., et al. (2010). Auditory brainstem and middle latency responses to binaural beats. *International Journal of Audiology*, 49(12), 894–904.
- Garcia-Argibay, M., Santed, M. A., & Reales, J. M. (2019). Efficacy of binaural auditory beats in cognition, anxiety, and pain perception: a meta-analysis. *Psychological Research*, 83(2), 357–372.
- Orozco Perez, H. D., Dumas, G., & Bhatt, S. (2020). Binaural beats through the auditory pathway: from brainstem to connectivity patterns. *eNeuro*, 7(2).

## License

MIT
