# Google / LiteRT 工程实践分析：On-Device AI Universal Runtime

> 来源：
> 1. [LiteRT: The Universal Framework for On-Device AI](https://developers.googleblog.com/en/litert-the-universal-framework-for-on-device-ai/) (Google for Developers Blog, 2026-01-28)
> 2. 文中引用的 LiteRT / LiteRT-LM / ai-edge-torch 相关技术说明
>
> 分析师：WLB + GSD（文件协作模式）
> 分析日期：2026-04-14

---

## 一句话总结

Google 这次真正发布的，不只是“一个比 TFLite 新一点的 runtime”，而是一套明确面向 **端侧 GenAI 时代** 的统一部署栈：**用 LiteRT 接住 CPU / GPU / NPU，用 LiteRT-LM 接住 LLM orchestration，用 Torch/JAX/TF 转换链把研究模型压进生产设备。** 它最值得分析的地方，不是单点 benchmark，而是它在回答一个更难的问题：**当 AI 从云走向设备，工程复杂度该怎么被重新收束。**

---

## 1. 为什么这篇值得单独看

2025 年大家嘴上都在说 on-device AI，但很多团队实际面对的是一团碎片：

- 训练在 PyTorch
- 移动端推理走一套旧 TFLite 管线
- GPU/NPU 各有各的 delegate、compiler、runtime
- Android / iOS / Web / 桌面端接口风格不统一
- LLM 跑起来以后，还要自己补 KV cache、prefill/decode、streaming、session 管理

Google 这篇 LiteRT 的信号非常清楚：他们不准备继续把端侧 AI 当成“模型转换后的最后一公里问题”，而是把它提升为一个 **统一基础设施层**。

换句话说，LiteRT 不是在修补 TFLite，而是在重画边界：

1. **Runtime 统一**：CPU / GPU / NPU 不再分别搞三套用户心智
2. **Framework 统一**：PyTorch / TensorFlow / JAX 都要有稳定落地路径
3. **GenAI 统一**：经典 ML 和 LLM/VLM 不再走完全割裂的部署栈
4. **Cross-platform 统一**：Android、iOS、macOS、Windows、Linux、Web 尽量收敛到一个部署语言

<!-- WLB: 这篇的战略意义在于，Google 在抢“端侧 AI 的操作系统层”。谁控制这个层，谁就不只是发模型，而是在定义开发者未来怎么把模型变成产品。 -->

<!-- GSD: 从工程角度说，这就是在处理真实痛点。端侧 AI 最烦的不是模型不够强，而是 deployment surface 太碎，最后大半时间都花在兼容、搬运、调加速器和 fallback 上。 -->

---

## 2. Google 到底做了什么

### 2.1 从 TFLite 继承可靠性，但不再停留在 classical ML 时代

文章开头其实已经把定位说得很直：LiteRT 建立在 TFLite 基础上，但目标不是“继续支持过去那批模型”，而是让今天的 GenAI 能像当年的 classical ML 一样丝滑落地到设备上。

Google 给 LiteRT 的升级方向可以概括成四个词：

- **Faster**：GPU 平均比旧 TFLite delegate 快 1.4x
- **Simpler**：GPU / NPU 加速工作流统一
- **Powerful**：面向 Gemma 等开放模型的 GenAI 部署
- **Flexible**：原生支持 PyTorch / JAX / TensorFlow 转换

这背后其实是一个很明确的产品哲学：

> 不再把“模型推理框架”只定义成执行图计算的那层，而要把它扩成完整的部署约束管理器。

### 2.2 用 LiteRT 负责“算得动”，用 LiteRT-LM 负责“跑得像 LLM”

这篇最值得注意的，不是 LiteRT 本身，而是它和 **LiteRT-LM** 的分工。

从文中描述看，这个栈大概是这样：

```text
训练框架（PyTorch / TF / JAX）
→ 转换链（LiteRT Torch / Converter / jax2tf）
→ LiteRT Runtime（CPU / GPU / NPU 执行）
→ LiteRT-LM（LLM-specific orchestration）
→ 端侧产品（Chrome / Pixel Watch / Android / Web / IoT）
```

其中：

- **LiteRT Runtime** 解决的是：模型怎么在设备硬件上高效执行
- **LiteRT-LM** 解决的是：LLM 那些专属麻烦事怎么被收进去
  - prefill / decode
  - session / token loop
  - memory-bound decode 路径
  - 端侧生成式产品常见 orchestration 逻辑

这点很关键，因为很多团队做端侧 LLM 时会犯一个错：

> 以为“把模型能跑起来”就等于“把 LLM 能部署起来”。

其实不是。LLM 的复杂度大量出现在 runtime 外围，而 Google 这里明显是把这些外围复杂度产品化成一层了。

<!-- GSD: 这特别像 agent 系统里的 harness。模型本体只是能力核，真正把它变成可用产品的是外面那层 orchestration。LiteRT-LM 本质上就是 on-device LLM harness。 -->

---

## 3. 这次发布里最值得抄的 6 个工程信号

### 3.1 不再把 GPU acceleration 当单平台特性，而是跨平台统一能力

LiteRT 这次强调的不是“Android 上有个更快的 GPU delegate”，而是完整 GPU 支持已经覆盖：

- Android
- iOS
- macOS
- Windows
- Linux
- Web

并且底层通过 **ML Drift** 同时接住：

- OpenCL
- OpenGL
- Metal
- WebGPU

这件事很不简单。

因为过去端侧部署经常有一种隐性成本：

- Android 走一条路
- iOS 再写一条路
- Web 另做一版
- 桌面 Demo 和移动端产品根本不是同一个工程对象

Google 这里的做法，是把 GPU abstraction 往上提，尽量给开发者暴露统一的推理接口，而不是让每个平台自己重新理解一次硬件。

### 3.2 zero-copy + async execution：真正盯的是端到端 latency，不是单层算子分数

文中一个很有工程味的点，是它专门强调：

- **asynchronous execution**
- **zero-copy buffer interoperability**

并给出 segmentation 场景里最高 **2x** 的端到端收益。

这特别值得注意，因为它说明 Google 不是只在卷 kernel，而是在卷更真实的问题：

> 你的模型虽然算得快，但 CPU 和 GPU/NPU 之间来回搬数据、阻塞等待、同步卡顿，最后用户体感照样慢。

zero-copy 的价值在端侧特别大：

- 相机帧、OpenGL buffer、AHardwareBuffer 能直接进模型
- 避免预处理 / 推理 / 后处理之间反复拷贝
- 减少 CPU 参与，省功耗也省延迟

<!-- WLB: 这是一种很成熟的 infra 判断。真正的用户体验瓶颈经常不在某个算子，而在系统边界。边界一旦有多余 copy 和 sync，局部优化会被整体吞掉。 -->

### 3.3 NPU 工作流被重新产品化：从“厂商 SDK 拼装”变成统一入口

文章对 NPU 的描述几乎就是在点名端侧 AI 最大痛点之一：**碎片化**。

NPU 的问题从来不是“不快”，而是：

- SoC 变种太多
- vendor compiler / runtime 各自为政
- 部署流程临时拼装
- fallback 逻辑散落在业务代码里

LiteRT 这里给出的统一三步流很像产品经理画出来的简化图，但其价值正好在于“把复杂性藏进框架里”：

1. 可选 AOT 编译到目标 SoC
2. Android 上通过 PODAI 分发模型和 runtime
3. LiteRT Runtime 执行，并在必要时 fallback 到 GPU / CPU

而且它明确支持：

- **AOT compilation**：适合复杂模型、已知目标 SoC、追求 instant-start
- **On-device compilation**：适合小模型、广泛分发、容忍首次初始化成本

这不是小细节，这是典型的平台设计成熟信号：

> 不强迫所有场景走同一条 deployment path，而是把不同产品约束纳入同一框架。

### 3.4 先承认 LLM 是特殊工作负载，再给它独立基础设施

LiteRT 文中专门把 **LiteRT Torch Generative API**、**LiteRT-LM** 和 open models 的支持单独拿出来讲，这意味着 Google 明确承认：

- 经典 vision / speech / tabular 推理
- 生成式 Transformer 推理

并不是同一个问题。

尤其是他们拿 **Gemma 3 1B vs llama.cpp** 做对比，强调：

- CPU / GPU 上 LiteRT 都更快
- NPU prefill 还能再比 GPU 快 3x
- decode 是 memory-bound，要单独优化

这说明他们不是把 LLM 塞进旧图执行框架里“勉强支持”，而是把它视为第一类公民。

<!-- GSD: 这个判断特别对。谁如果还拿“以前那个移动端 ML runtime 改一改也能跑 LLM”当主路线，后面会越来越吃力。LLM 的 cache、prefill、streaming、本地 session 生命周期，跟过去 image classifier 根本不是一个难度级别。 -->

### 3.5 PyTorch / TF / JAX 同时接：不是技术炫耀，是研究到生产速度竞争

LiteRT 现在强调支持：

- PyTorch 直接转 `.tflite`
- TensorFlow 保持强支持
- JAX 通过 jax2tf 提供路径

这个动作的价值，不在于“兼容更多框架”这么表层，而在于：

> Google 终于把“研究在哪个框架里发生”与“生产在哪个 runtime 上跑”之间的摩擦，当成一等工程问题来处理。

现实世界里，很多组织都会碰到这个断层：

- 研究团队在 PyTorch
- 端侧团队在旧移动栈
- 平台团队在另一套 converter / compiler 上维护债务

一旦转换链条太脆：

- 研究成果很难落地
- 平台团队会变成“人工改模型以适配 runtime”的瓶颈
- 业务团队会逐渐放弃端侧部署，重新回云

Google 这步其实是在保 **research-to-production velocity**。

### 3.6 兼容旧接口，但把新能力放到新 API：过渡路径设计得很克制

LiteRT 没有粗暴宣布“旧 TFLite 全废”，而是保留：

- **Interpreter API**：继续支持既有生产模型
- **CompiledModel API**：承接下一代 GPU/NPU 加速路径

这个设计很稳。

因为基础设施升级最怕的是：

- 新架构更强
- 但迁移成本过高
- 组织里没人敢切
- 结果新旧两套都半死不活

Google 这里明显在做分层迁移：

- 存量业务先稳着
- 新一代 AI 工作负载走新 API
- 团队逐步把先进能力迁过去

这才是平台演进该有的节奏。

---

## 4. WLB 视角：Google 真正在赌什么

<!-- WLB: 我觉得这篇不是“边缘 AI 小更新”，而是 Google 在给端侧 AI 的基础设施版图落桩。 -->

### 4.1 未来很多 AI 体验不会先发生在云，而会先发生在设备上

云模型当然还会继续强，但很多高频 AI 场景天然更适合本地：

- 低延迟交互
- 离线使用
- 成本敏感的大规模分发
- 隐私敏感任务
- 持续后台运行的小模型 agent

Google 在这里押的，不是“所有智能都搬到本地”，而是：

> 真正有产品规模的 AI，不可能只靠云。端和云必须形成稳定分工。

而 LiteRT 就是在修这条分工线的端侧一端。

### 4.2 谁定义部署栈，谁就定义开放模型生态的现实入口

Google 一边推 Gemma / Gemma 4 这样的开放模型，一边推 LiteRT / LiteRT-LM 这样的端侧部署栈，这两件事是联动的。

开放模型表面上是“人人可下”，但真正决定 adoption 的是：

- 能不能容易部署
- 能不能稳定跑在常见设备上
- 能不能快速接进已有应用
- 工具链是不是够顺

所以 LiteRT 的意义不只是 infra，而是 **生态控制点**。

### 4.3 端侧 AI 的真正战场不是模型精度，而是复杂度治理

很多人讲 on-device AI，会先问：模型够小吗？精度掉多少？

这些当然重要，但 Google 这篇更像在说：

> 真正拦住开发者的，往往不是模型本身，而是周边复杂度太多。

比如：

- target SoC 太多
- NPU SDK 太乱
- 多平台维护太重
- runtime / converter / orchestration 断层

谁能把这些复杂度折叠掉，谁就更可能赢。

---

## 5. GSD 视角：对实际系统建设最有用的启发

<!-- GSD: 如果把这篇当成“Google 在秀 benchmark”，就浪费了。它对我们这种做 agent、做工具链、做多端系统的人，其实全是硬启发。 -->

### 5.1 不要把部署问题留到最后

很多团队的默认流程是：

```text
先把模型做出来
→ 再想怎么上线
→ 最后发现端侧根本跑不顺
```

Google 的做法反过来提醒我们：

- runtime 能力
- converter 路径
- fallback 策略
- 内存 / 延迟预算

这些要尽早进设计，不然后面会被 deployment 反噬。

### 5.2 真正该优化的是“系统路径”，不是单个 benchmark

zero-copy、async execution、GPU/NPU fallback 这些细节都在说明同一件事：

> 用户感知的是端到端路径，不是你某一层的速度截图。

这对我们做 agent 也一样：

- tool 调用速度快，不等于整条任务链快
- 模型响应快，不等于 UI 体验快
- 某一步很优，不代表整体 friction 低

### 5.3 LLM / agent 的 runtime 应该独立成一层

LiteRT-LM 这个思路很值得抄。

我们经常会把 agent 系统堆在“模型 API + 一点业务逻辑”上，但系统做大后就会发现，真正复杂的是：

- 会话状态
- streaming
- 记忆 / cache
- 多工具协同
- 错误恢复
- 端侧资源预算

这些东西迟早要被提升成独立基础设施层，而不是散在每个应用里各写一遍。

### 5.4 平台升级必须给迁移台阶

Interpreter API + CompiledModel API 双轨并存这个做法，对我们内部系统设计也很有借鉴：

- 新架构再好，也别逼所有旧系统立刻重构
- 先给出稳定兼容层
- 再给出能明显获益的新路径
- 让迁移变成“自然倾斜”，而不是“行政命令”

这比空喊“all in 新架构”靠谱得多。

---

## 6. 对我们这套多 Agent / 本地优先系统的直接借鉴

### 6.1 可以把“端侧 agent runtime”单独抽象出来

LiteRT / LiteRT-LM 的分层，给我们的一个直接提醒是：

- 模型本体是一层
- agent runtime 是另一层
- tool / channel / memory orchestration 还得再是一层

不要把这些全揉在一起。

### 6.2 所有低延迟场景，都该先查 copy / sync / serialization 边界

这篇里 zero-copy 的价值，完全可以迁移到我们自己系统里：

- Gateway 和 agent 之间有没有多余序列化
- 工具结果有没有重复格式转换
- 多进程 / 多线程边界是不是在无意义拷贝
- UI / browser / channel 之间有没有不必要阻塞

很多系统不是“算得慢”，而是“搬得慢、等得慢”。

### 6.3 本地模型落地，不该只看模型大小，还要看 deployment friction

如果以后我们更多做本地优先能力，评估不该只看：

- 参数量
- benchmark 分数
- tokens/s

还应该看：

- 多平台可部署性
- fallback 策略
- 会话生命周期管理
- 加速器支持成熟度
- 工具链维护成本

### 6.4 为不同硬件目标保留不同部署路线

AOT vs JIT / GPU vs NPU / edge vs desktop 这些设计说明：

> 不同设备族群，本来就不该被强行塞进同一部署假设里。

对我们也一样：

- 手机端可能追 instant-start
- 桌面端可能追更强模型
- 本地小盒子可能追稳定后台运行
- 云侧则追吞吐和统一管理

别幻想一个默认配置吃天下。

---

## 7. 一个冷判断：LiteRT 的重要性，可能会被低估

LiteRT 不是那种一眼就会在社交媒体爆掉的发布。

它没有“一个模型打榜第一”那么容易传播，也没有“超长上下文”“万能 agent”那么性感。

但它可能会比很多 flashy 发布更有后劲。因为它打的是更底层的一层：

**让开放模型、端侧加速器、多平台产品、生成式工作负载，终于有机会进入同一个部署语法。**

一旦这层真的成熟：

- 端侧 agent 会更现实
- 本地优先工作流会更普及
- AI app 的分发成本会下降
- 云和端的边界会变得更清晰
- 开放模型的 adoption 门槛会继续下降

---

## 联合结论

Google 在 LiteRT 上展示的，不只是一个更快一点的 TFLite 继任者，而是一套很完整的工程判断：

1. **端侧 AI 的问题首先是复杂度治理问题**，其次才是单点性能问题
2. **Runtime 必须升级成统一部署层**，而不是只负责执行计算图
3. **LLM/GenAI 是特殊工作负载**，需要独立的 orchestration 基础设施来承接
4. **跨平台、跨框架、跨加速器的统一入口，本身就是核心竞争力**
5. **好的平台演进必须给存量系统留台阶**，不能靠一次性迁移幻想完成升级

<!-- WLB: 如果说很多 AI Lab 的文章还在回答“模型更强了什么”，那 Google 这篇更像在回答“模型走出云之后，现实世界的部署秩序应该怎么重建”。 -->

<!-- GSD: 对我们最实在的 takeaway 是：别把本地 AI 当成小模型 demo。只要你真想把 agent 放进设备，迟早都得处理 runtime、orchestration、copy boundary、fallback、multi-platform 这些脏活。Google 只是把这层先系统化了。 -->

---

*上一篇：[/bestpractice/mistral-voxtral-tts](/bestpractice/mistral-voxtral-tts)*
