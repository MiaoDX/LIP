# Work Timeline HTML 更新计划

- Plan status: DONE
- Session scope: public-work-timeline
- Last updated: 2026-09-24
- Canonical source: `presentations/work-timeline.html`
- Public script: `share/work-timeline-script.md`

## Goal

维护一份适合面试和交流时共享屏幕的公开 Work Timeline deck：用更少的文字讲清从自动驾驶量产、机器人系统集成，到数据评测、模型适配和受控执行的连续方法。

## Final structure

- **01** 三个职业时代与方法主线
- **02** 团队、Owner 与交接机制
- **03** 质量、性能、资源预算与持续回归
- **04** 机器人系统分层图：接口契约、观测、归因、回归与运行时
- **05** 数据 → 模型版本 → 批量评测 → 校准门 → 真机 → 下一轮决策
- **06** Endless Testing episode loop 与人工兜底
- **07** WBC / π0.5、GenieSim / π0.5、GenieSim / XR-1 三条同层级实践
- **08** Agent / Runtime 边界、proof pack 与机器验收

## Visual contract

- SVG 只承担系统关系、闭环、分层结构和回流箭头
- HTML/CSS 承担时间线、证据条、重复实践行和短结论
- 桌面端保持单页演示；移动端改为可滚动阅读并使用移动 SVG
- 讲稿和 speaker notes 承载口述细节、事实边界与失败兜底

## Public boundary

- 保留公开安全的项目描述和高信号指标
- 不放私有面试材料、公司内部链接、同事姓名、绩效等级或内部文档引用
- 区分直接团队规模、机制影响范围、模型协作主责和系统交付责任
- 不把 XR-1 的 GenieSim 微调写成通用真机成功或模型优越性结论
- 不把仿真评测与真机验证合并成单一总分

## Acceptance

- `presentations/work-timeline.html` 恰好包含 8 个 `.slide`
- 桌面 1440×900 与移动 390×844 无明显溢出、重叠或不可读控件
- 键盘翻页、点击分区、hash、notes 和配色切换可用
- deck 不包含私有 interview 路径或旧的 9 页叙事
- `share/work-timeline-script.md` 路线与 8 页编号一致
- `npm run build:all` 通过，且仅由发布规则生成 `.vitepress/dist/` 内容

## Verification record

- 静态检查：slide count、残留 `+EOF`、私有路径、旧编号
- 浏览器检查：1440×900 和 390×844 全 8 页，重点检查 04—08 页 SVG 与证据条
- 交互检查：hash、notes、配色和前后翻页无 console error
- 仓库检查：`npm run build:all`

### Review corrections · 2026-09-24

- 首列内容补齐内边距，避免文字紧贴边框；移动标题独占一行
- P06 正常回流与异常分支分开，异常箭头落到人工兜底框；移动版补齐异常连线
- SVG 的连续步骤拆成独立连线，使每段连接都有箭头
- P07 改为数据、微调、验证三列，移除双箭头与面向编辑的 ownership 说明
- 1440×900、390×844 全 8 页已渲染检查，无横向溢出；1024×600 未复现整页左侧裁切
- `npm run build:all` 通过；局域网预览使用发布规则生成的最新输出
