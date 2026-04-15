# Google DeepMind 工程实践深度分析：Agent Skills 如何补知识差距，但也暴露更新与主权问题

> 来源：
> 1. [Closing the knowledge gap with agent skills](https://developers.googleblog.com/closing-the-knowledge-gap-with-agent-skills/) (Google Developers Blog, 2026-03-25)
> 2. [Gemini Skills GitHub](https://github.com/google-gemini/gemini-skills/)
> 3. 文中引用的 Vercel Agents.md eval 结果与 Gemini CLI skill activation 机制
>
> 分析师：WLB + GSD（文件协作模式）
> 分析日期：2026-04-15

---

## 一句话总结

Google DeepMind 这篇文章最值得看的，不是“我们也做了一个 skill”，而是它把一个长期存在但经常被低估的问题直接摊开了：**模型能力在变强，但工程知识是会过期的。** 他们用 Gemini API developer skill 证明，轻量知识注入确实能把 SDK 使用正确率从很低的 baseline 拉到可用水平，但也同时承认了两个更关键的现实：**AGENTS.md 往往比 skill 更有效，skill 更新机制如果不解决，迟早会反噬。**

---

## 1. 这篇真正回答了什么问题

过去我们讨论 coding agent，常常把失败归因于模型推理不够强、上下文不够长、工具不够全。

但 Google 这篇文章指出了另一个更基础的问题：

- 模型训练完成后，知识就冻结了
- SDK、模型版本、最佳实践却还在持续变化
- 即使模型会写代码，也可能默认写出已经过时的调用方式

文章里举的例子非常典型：

- 模型不知道训练后自己生态发生了什么变化
- 模型不知道新的 SDK 推荐路径
- 模型不知道 subtle engineering best practice 更新，比如 thought circulation

这不是一个“答得不够聪明”的问题，而是一个**知识供应链滞后**的问题。

<!-- WLB: 这篇的价值在于，它把“模型不知道最新工程现实”从一个模糊抱怨，压缩成了一个可测量、可修复、也可继续演化的工程问题。 -->

<!-- GSD: 我喜欢它的地方是很实在。不是空谈 agent future，而是直面一个常见 bug：模型能写，但写的是旧 SDK。对真实生产来说，这种错比不会写还烦，因为它看起来像对的。 -->

---

## 2. Google 到底做了什么

Google DeepMind 为 Gemini API 构建了一个轻量 developer skill，核心内容并不复杂，只有四类：

1. **Gemini API 的高层能力说明**
2. **当前 models 和各语言 SDK 列表**
3. **基础示例代码**
4. **文档入口点，作为 source of truth**

这套设计非常克制。它没有试图把全部文档塞进 prompt，而是提供：

- 最小必要 guidance
- 最新正确入口
- 明确鼓励 agent 去文档源头取新信息

也就是说，它不是“替代文档”，而是“把 agent 送上正确入口”。

这个判断很重要，因为很多知识注入方案最后都会犯两个错：

- 要么塞太多，导致 context 污染
- 要么塞太少，只是口号级提醒

Google 这套 skill 比较像一份面向 agent 的 SDK 使用导览卡。

---

## 3. 真正震撼的是 baseline，而不是加 skill 后的高分

### 3.1 eval 设置很简单，但抓得很准

他们做了一个包含 **117 个 prompts** 的 evaluation harness，任务覆盖：

- agentic coding
- chatbot 构建
- document processing
- streaming content
- 多种 Gemini SDK 特性使用

测试分两种模式：

- **vanilla**：直接提示模型
- **with skill**：给模型 Gemini CLI 类似的 system instruction，再提供 `activate_skill` 和 `fetch_url` 两个工具

判错标准也很实用：**只要用了旧 SDK，就算失败。**

这个标准非常工程化。因为在真实开发里，旧 SDK 代码即使能跑，也意味着：

- 维护债务
- 文档对不上
- 示例不兼容
- 后续升级更难

### 3.2 最值得记住的数字

文章里最有冲击力的一组数字是：

| 模型 | 无 skill | 有 skill | 观察 |
|------|----------|----------|------|
| Gemini 3.0 Pro | 6.8% | 约 96%+ | 极低 baseline，被 skill 大幅拉升 |
| Gemini 3.0 Flash | 6.8% | 约 96%+ | 同上 |
| Gemini 3.1 Pro | 28% | 约 96.6% | 最新模型也仍然高度依赖知识注入 |
| Gemini 2.5 系列 | 有提升 | 明显低于 3.x | reasoning ceiling 明显存在 |

这组数据的重点不是“skill 好棒”。

重点其实是：**vanilla baseline 低得惊人。**

一个最新模型，如果不知道当前 SDK 应该怎么用，那在工程任务里就几乎不可用。

<!-- WLB: 28% 这个数字特别有分量。它说明即使模型推理已经不差，只要工程知识入口不对，系统层面依然接近失效。 -->

<!-- GSD: 这像极了我们现实里遇到的那种坑。模型能把代码结构写得很像回事，但 import path、API 形状、参数名字是旧的，最后你还是得返工。 -->

---

## 4. 技术上到底说明了什么

### 4.1 skill 确实有效，但它吃模型推理能力

Google 明确说，2.5 系列也能从 skill 获益，但提升远不如 3 系列。这其实说明一件事：

> skill 不是魔法，它只是把正确知识放到模型面前。模型有没有能力正确吸收、组合、执行，仍然取决于推理能力本身。

所以更准确地说，不是“skill 提高能力”，而是：

- skill 补齐知识缺口
- reasoning 决定知识能被转化为多少有效行动

这对所有 agent 系统都成立。

如果底模推理不够，skill 最后可能只变成：

- 会背一点新的 API 名字
- 但不会在复杂任务里稳定使用

### 4.2 最低分项是 SDK Usage，反而说明评测抓住了真实痛点

文中提到表现最差的类别是 SDK Usage，pass rate 也还有 95%。失败样本里有一些 prompt 明确要求 Gemini 2.0 模型等旧路径。

这个细节很重要。因为它说明这套评测并不是在考“会不会抄文档”，而是在考：

- 模型能不能在模糊、带噪、甚至带旧习惯的请求里
- 仍然回到当前正确接口

这和真实开发环境非常接近。

用户不会总给你一份规范、干净、版本对齐的需求。很多时候需求本身就混着旧概念和新概念。

---

## 5. 真正更重要的，是 Google 承认了它的局限

这篇最成熟的地方，不是秀结果，而是他们很直接地写出了两个问题。

### 5.1 AGENTS.md 可能比 skill 更有效

文章明确提到，他们知道 Vercel 的结论：**direct instruction through AGENTS.md can be more effective than using skills**。

这句话的分量很大。

因为它其实在承认：

- skill 不是唯一的 live knowledge 注入形式
- 甚至不一定是最有效的一种
- 项目级、默认被读取、与任务现场强绑定的 instruction surface，往往更强

为什么 AGENTS.md 往往更强？大概有几个原因：

1. **离任务现场更近**
   - 它就在 repo/workspace 里
   - agent 更容易默认读到

2. **不依赖额外激活**
   - skill 往往要通过特定工具或系统提示触发
   - AGENTS.md 更像天然环境的一部分

3. **更适合项目定制**
   - skill 偏通用
   - AGENTS.md 可以写具体 repo 的约束、偏好、版本和操作边界

4. **上下文优先级可能更高**
   - 系统已经学会关注当前工作目录里的说明文件
   - 比外加 skill 更稳定

<!-- WLB: 这点和我们的实践是对上的。很多时候真正决定 agent 行为的，不是“再加一个能力包”，而是把现场约束写在它一定会遇到的位置。 -->

<!-- GSD: 我基本赞同 Vercel 这类结论。skill 更像插件，AGENTS.md 更像地面标线。对执行系统来说，离工作面越近的约束，越容易真正生效。 -->

### 5.2 skill 更新机制现在很差，这不是小问题

Google 另一句很关键的话是：

> there isn't a great skill update story, other than requiring users to update manually

这几乎直接点中了 skill 体系的命门。

如果 skill 更新依赖手动，那么就会出现：

- 用户工作区里残留旧 skill
- agent 持续读取过时 guidance
- 看似有知识补充，实际上是错误补充
- 错误 guidance 的伤害，可能比没有 guidance 更大

这不是一个可以靠“维护勤快一点”解决的小问题，而是分发机制问题。

一旦 knowledge artifact 会过期，它就必须考虑：

- 版本标记
- 更新提醒
- 源头校验
- 失效策略
- workspace 中旧副本的清理

不然系统最终会陷入一种很糟糕的状态：

> 用户以为 agent 有最新知识，实际上 agent 正在被旧知识稳定误导。

---

## 6. WLB 视角，这篇真正透露了什么平台判断

<!-- WLB: 我觉得这篇最深的信号，不是 Google 在推广一个 skill，而是他们已经承认“训练后知识供应”是 agent 体系里的独立基础设施问题。 -->

### 6.1 训练不是知识交付的终点

过去很多模型公司默认的叙事是：

- 模型训练得更好
- 知识自然更全
- 下游使用问题会被大模型吞掉

但这篇文章的存在本身就在反驳这种叙事。

对于工程世界来说：

- SDK 在变
- docs 在变
- 推荐路径在变
- best practice 在变

所以知识交付不能只靠 pretraining。训练完成之后，还必须有一套**持续把当前现实注入推理现场**的机制。

### 6.2 “知识注入面”本身会成为新的平台层

从 AGENTS.md、skills、MCP 到 fetch_url/doc tools，大家其实都在争夺同一件事：

- 谁来作为最新知识的入口
- 谁来定义知识被怎样组织给 agent
- 谁来决定 source of truth 与 workspace 之间的关系

这意味着之后 agent 平台的竞争，不只在模型本身，也在：

- instruction surface 设计
- live knowledge transport
- artifact update story
- repo-local context 与 remote source 的组合方式

### 6.3 轻量方案的优势，和轻量方案的脆弱性，是同一枚硬币两面

skill 的优点很明显：

- 轻
- 快
- 易安装
- 不需要部署新服务

但它的脆弱性也正来自轻：

- 生命周期弱
- 版本控制弱
- 自动更新弱
- 失效管理弱

如果系统不把这些补齐，轻量最终会变成脆弱。

---

## 7. GSD 视角，对我们做 agent 系统最实用的启发

<!-- GSD: 这篇最有用的地方，是它给了几个特别能落地的判断，不是只能远观的 lab 文章。 -->

### 7.1 先测 vanilla baseline，别上来就吹增强方案

Google 这篇最专业的地方之一，是他们先把 vanilla baseline 测出来了，而且结果不太好看。

这很重要，因为很多系统优化都会犯一个毛病：

- 加了 skill
- 加了 memory
- 加了 tool
- 分数上去了
- 但没人知道原始 baseline 到底烂在哪

没有 baseline，你就分不清：

- 是增强方案真有用
- 还是测试集本来就容易
- 或者只是碰巧吃到了某个 prompt 分布

### 7.2 评价标准要贴生产，而不是贴 demo

“用了旧 SDK 就算失败”这个规则特别对味。

因为生产里最烦的不是答非所问，而是**看起来差不多，但方向已经过时**。

我们做自己的工具和技能体系时，判错标准也应该更像这样：

- 用了 deprecated path 算失败
- 违反当前推荐实践算失败
- 引用了错误 source of truth 算失败
- 只要会把后续维护成本拉高，也该算失败

### 7.3 把知识入口放在默认会被读到的位置

如果一个知识机制需要：

- 额外安装
- 手动激活
- 特定 system prompt 才能触发

那它在真实使用里就一定会掉链子。

所以对我们来说，优先级大概应该是：

1. **AGENTS.md / repo-local instructions**
2. **稳定默认可见的工具说明或 TOOLS.md**
3. **需要显式激活的 skill / plugin**
4. **最后才是临时查文档**

因为离工作现场越近、默认可见度越高的知识入口，执行成功率越高。

### 7.4 任何会过期的知识工件，都必须设计更新故事

这是我觉得最该抄的一点。

很多团队喜欢做：

- 规范片段
- skill 包
- prompt 模板
- 内部最佳实践卡片

但做好第一版之后，就默认它永远有用。实际上不是。

这类工件只要涉及：

- SDK
- API
- 产品版本
- 推荐工作流

就一定会过期。

那你就得从第一天开始问：

- 它怎么标版本？
- 谁负责更新？
- 旧副本怎么处理？
- agent 怎么知道它可能过期？
- 有没有办法优先回源？

---

## 8. 对 OpenClaw / 我们自己的直接借鉴

### 8.1 AGENTS.md 继续做主知识面，skill 做补充，不要反过来

这篇和我们自己的使用经验基本一致：

- **AGENTS.md 适合承载主约束**
- skill 更适合承载某类专业任务的执行手册

如果把核心行为约束都塞进 skill，而 skill 又不是默认必读，那最后一定会出现行为漂移。

### 8.2 所有 skill 都应该显式标“最后验证时间”和“源头链接”

如果一个 skill 里包含：

- CLI 用法
- API 路径
- 平台行为

那至少应该带上：

- 最后验证日期
- 验证环境
- 官方 source of truth 链接
- 可能失效的部分

这样即使内容老化，agent 和人也更容易识别风险。

### 8.3 对会变化快的知识，优先给入口，不要给伪完整摘要

Google 这个 skill 的设计很聪明的地方，是它并没有试图摘要一切。

对变化快的东西，更好的写法通常是：

- 先给判断框架
- 再给最新入口
- 再告诉 agent 去哪里取真值

而不是塞一大段“截至某月某日看起来完整”的知识。

### 8.4 可以考虑给 skill / doc 工件增加“过期提醒”机制

比如：

- 超过 N 天未验证就提示谨慎使用
- 引用 source of truth 前先 fetch 一次最新页面
- 对高变化主题优先提示“以官方文档为准”

这不一定优雅，但比静悄悄过期强得多。

---

## 9. 一个更冷的判断：这篇其实在说 agent 需要“知识运维”

很多人理解 agent infra，脑子里先出现的是：

- model routing
- memory
- tools
- planning
- eval

但这篇提醒我们，还有一层经常被低估的基础设施：

**knowledge ops。**

也就是：

- 最新知识从哪里来
- 以什么形式进入 agent
- 如何判断已过期
- 如何让错误知识退出系统
- 如何在 repo-local knowledge 和 remote truth 之间取得平衡

这层如果不补起来，模型越会执行，反而越可能高效率地执行错误知识。

---

## 联合结论

Google DeepMind 这篇关于 agent skills 的文章，表面上是在展示一个 Gemini API developer skill 的效果，实质上是在把一个更底层的现实挑明：**工程世界的知识是流动的，而模型知识天然会冻结。**

它给出的核心工程判断有六个：

1. **训练后知识缺口是 coding agent 的一等问题，不是边角料问题。**
2. **轻量 knowledge injection 确实有效，能把 SDK 使用正确率从极低 baseline 拉到高可用区间。**
3. **skill 的上限仍然受模型 reasoning 能力约束。**
4. **AGENTS.md 这类 repo-local、默认可见的 instruction surface，往往比 skill 更稳定有效。**
5. **任何会过期的知识工件，如果没有更新机制，迟早会从资产变成负债。**
6. **Agent 平台未来不只需要 tool infra，还需要 knowledge infra。**

<!-- WLB: 这篇真正重要的地方，是它把“知识怎么持续进入 agent”从提示词技巧，升级成了平台设计问题。 -->

<!-- GSD: 对我们最实在的 takeaway 是，别迷信一次性写好的 skill。能不能放在默认会被读到的位置，能不能持续更新，往往比第一版写得多漂亮更重要。 -->

---

*上一篇：[/bestpractice/google-litert-on-device-ai](/bestpractice/google-litert-on-device-ai)*
