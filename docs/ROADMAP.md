# Lingo 产品路线图

> **写于 2026-07-04，从第一性原理重写。**
>
> 本文档不预先承诺超出 1 个版本的日期或功能。原则：
> 1. **先做扎实，再扩范围**
> 2. **zh/en 用户体验优先**——UI 只支持这两种语言，扩张语言前先把它们的体验打磨透
> 3. **不无节制加 feature**——每个版本必须有明确的"完成标准"，否则不开工

---

## 已交付

| 版本 | 日期 | 内容 |
| ---- | ---- | ---- |
| v1.0.0 | 2026-07-01 | 商业化基线（Clerk + Stripe + 游戏化骨架） |
| v1.1.0 | 2026-07-01 | i18n (en/zh) + SEO |
| v1.2.0 - v1.7.0 | 2026-07-02 | Stripe webhook / PWA / B2B 租户 / 自适应 / 中间件合并 |
| v1.8.0 | 2026-07-02 | Streak UI + 好友 |
| v1.9.0 | 2026-07-02 | Bug 修复 + 稳定性 |
| v2.0.0 | 2026-07-02 | 工程化质量 + 测试覆盖 |
| v2.1.0 | 2026-07-04 | 游戏化机制（Streak 庆祝/保护、Shop、排行榜周期、Quests） |
| **v2.2.0** | **2026-07-04** | **v2.1.0 遗留收尾 + 接通半成品（XP Boost 实际生效 / Hearts Pack 满血拒绝 / Shop 埋点 / 复习队列 UI / PWA 缓存 / i18n 校对）** |

---

## 当前：v2.2.0 验收 + 数据收集

v2.2.0 已发 tag `v2.2.0`，等待生产数据回流。

**观察窗口**：v2.2.0 上线后 4 周。

**关注指标**（写入 PostHog dashboard 后每周回看）：

| 指标 | 看什么 | 用于触发 |
| ---- | ---- | ---- |
| `/review` 页面 UV / 完成率 | 用户是否真的走完复习 | 场景 A 触发 |
| Unit 1-2 完成率 | 用户是否卡在内容末梢 | 场景 A 触发 |
| `streak_freeze_consumed` / `shop_item_purchased` 频次 | 用户粘性是否值得做成就 | 场景 B 触发 |
| 用户反馈（客服 / GitHub / 邮件）≥ 3 条具体痛点 | 是否值得做 UX 打磨 | 场景 C 触发 |
| zh/en 文案完整度（`pnpm check-i18n` + 实际跑页面） | i18n 是否到 90% | 场景 B / C 触发 |

---

## 下一版本（v2.3.0）：场景分支

v2.3.0 **不是计划**，是 3 个互斥的 scope 分支。**哪个触发条件成立，做哪个**；都不成立 = v2.3.0 不存在。

### 场景 A · 课程纵深 `content_depth`

**触发**：v2.2.0 复习路径显示用户完成 2 单元后无可学内容；或 30%+ 用户在 Unit 2 完成前流失。

| 项 | 估时 |
| ---- | ---- |
| seed 扩充 Spanish Unit 3-5（基础 → 进阶 → 主题词汇） | 2d |
| 给 Spanish Unit 1-2 补 SELECT/ASSIST 题密度（每单元 ≥10 题） | 1d |
| **合计** | **~3d** |

**不做**：新语言 / 新题型 / CMS 导入。

**验收**：Spanish 5 单元 + 每单元 ≥10 题 + `pnpm db:push` 后旧用户进度保留。

---

### 场景 B · 成就系统 `achievements`

**触发**：v2.2.0 上线 4 周后，PostHog 显示 `shop_item_purchased` / `streak_freeze_consumed` 任一频次 ≥ 5/DAU，或用户主动要求"看自己最高 streak / 总学习天数"。

| 项 | 估时 |
| ---- | ---- |
| **必做前置**：`db/schema.ts` 加 `streakHistory: jsonb`（v1.4.0 遗留债） | 0.25d |
| 成就定义常量 `ACHIEVEMENTS = [...]`（10 条：streak 7/30/100、total xp 1k/10k 等） | 0.5d |
| `actions/check-achievements.ts` server action：lesson / streak / shop 完成后评估并发放 | 1d |
| `/achievements` 页面 + 锁定/解锁 badge UI | 1d |
| 埋点：`achievement_unlocked` PostHog 事件 | 0.25d |
| **合计** | **~3d** |

**不做**：NFT 证书 / 第三方分享 / 排行榜成就墙。

**验收**：满 7 天 streak 自动解锁"1 周连击"badge，DB 里 `streakHistory` 追加一条；`/achievements` 页面可见锁定/解锁状态。

---

### 场景 C · UX 打磨 `ux_polish`

**触发**：用户反馈 ≥ 3 条提到具体痛点（字体小 / 移动端布局错 / 键盘焦点丢失 / 暗色模式请求）；或 zh/en UI 完整度评分 ≥ 90%。

| 项 | 估时 |
| ---- | ---- |
| 暗色模式（`next-themes` + Tailwind dark: classes） | 1d |
| 键盘焦点环修复（a11y 基础） | 0.5d |
| 移动端 hero / lesson 区响应式 audit（≤ 3 处断点修复） | 1d |
| i18n 补全 zh/en 漏翻 + 占位符校验（接 v2.2.0 check-i18n 发现的项） | 0.5d |
| **合计** | **~3d** |

**不做**：Framer Motion（动画是审美问题）/ 完整 PWA 离线 / 国际化键盘布局。

**验收**：用户切到暗色后颜色对比度 WCAG AA；移动端 360px 宽无横向滚动；`pnpm check-i18n` 零差异。

---

### 场景 D · 工程卫生 `engineering_hygiene`

**触发**：[feature-inventory.md](product/feature-inventory.md) 审计发现 ≥ 1 项高严重度代码债（无外部数据依赖），或 PostHog dashboard 配完前必须先有结构化日志。

**当前已确认的真缺口**（来自 [feature-inventory.md](product/feature-inventory.md) 审计）：

| 项 | 来源 plan | 估时 |
| ---- | ---- | ---- |
| **结构化日志**（pino / winston / next/log） — server actions / API routes 加 request-id + userId + duration | v1.7.0 GAP-OBS（**7 个 plan 跨度未实施**） | 0.5d |
| **AGENTS.md 扩展到 100+ 行** — 当前 33 行，覆盖测试 / 部署 / 调试 / schema 迁移指引 | v2.0.0 LING-P2-AGENTS | 0.25d |
| `subscription_started` 埋点 caller — Stripe webhook 调一下 | v1.2.0 LING-P1-3 | 0.1d |
| **合计** | | **~0.85d** |

**不做**：
- ❌ `/account` 订阅管理页（Stripe Customer Portal 链接可替代）
- ❌ 多租户实际隔离（产品定位非 B2B）
- ❌ D7 调度 churn_risk 埋点（需调度基础设施，先搁置）

**验收**：
- 任一 server action 报错时，PostHog 收到对应事件 + console 输出一行结构化 log（含 reqId / userId / action / duration）
- `wc -l AGENTS.md` ≥ 100
- Stripe webhook `checkout.session.completed` 事件触发 `subscription_started` 埋点

**为什么单独成一个场景**：这些是低风险、低估时的"卫生债"。**应在场景 A/B/C 任一启动前完成**，否则接 A/B/C 时调试会很难（场景 B 成就系统尤其依赖日志）。可与场景 A/B/C 任意一个**合并发布**。

---

### 决策树

```
v2.2.0 上线 + 观察 4 周
    │
    ├─ 用户卡在 Unit 2 / 复习队列空 → 启用场景 A
    ├─ PostHog 显示高粘性 + 用户要成就 → 启用场景 B
    ├─ UI 反馈 ≥ 3 条 / zh-en 完整度达标 → 启用场景 C
    │
    ├─ 任意启动前 / 调试困难 → 启用场景 D（可与 A/B/C 合并发布）
    │
    └─ 都不触发 → v2.3.0 跳过，继续打磨现有功能
```

```
v2.2.0 上线 + 观察 4 周
    │
    ├─ 用户卡在 Unit 2 / 复习队列空 → 启用场景 A
    ├─ PostHog 显示高粘性 + 用户要成就 → 启用场景 B
    ├─ UI 反馈 ≥ 3 条 / zh-en 完整度达标 → 启用场景 C
    └─ 都不触发 → v2.3.0 跳过，继续打磨现有功能
```

### 兜底触发（未在场景 A/B/C/D 中）

| 决策 | 触发条件 |
| ---- | ---- |
| 新增 UI 语言 / 课程语种 | zh/en 留存指标稳定 + UI 完整度评分 ≥ 90%（同 C） |
| PWA 完整离线 | 移动端占比 ≥ 30%（目前没有数据） |
| AI 对话 / 智能发音 | 有 LLM API 预算 + 数据脱敏方案 |
| 好友 / 学习小组深化 | 已有好友功能使用率 ≥ 20% |

> 这些触发条件**未成立前不规划**。一旦成立，单独成项，不挤进 A/B/C/D。

---

## 不再列在路线图

以下功能在历史 ROADMAP 里出现过，**v2.2.0 之后的版本不再主动规划**——
需要时单独立项评估：

- 私有化部署 / 课程编辑器 / Open API / 证书系统
- React Native 移动端
- NFT 证书
- 学习小组 / 班级模式

理由：这些是**不同的产品**，不是 duolingo-clone 的下一版本。开新项目时再讨论。

---

## 原则

### 1. 不预先承诺日期超过 1 个版本

原因：v2.1.0 的 12 人日估时就和实际偏离（最终估时 4.5 人日的 v2.2.0 是修正）。
日期承诺会逼出"凑功能"。

### 2. 每个版本必须有"完成标准"

见 v2.2.0 的 Acceptance 段。无法验证的功能不进版本。

### 3. 范围扩展必须显式说明成本

加一个 P1 就要砍掉一个 P1 或 P2。不允许"全部都做"。

### 4. zh/en 用户优先

UI 当前只支持 zh/en。任何把 zh/en 用户体验做扎实之前的功能（如新语言、
新题型）都不进版本。

### 5. v2.3.0 不存在，直到触发条件成立

不允许"反正做了也行"心态。3 个场景都未触发 = v2.3.0 跳过 = 继续打磨 v2.2.0
已有的功能。这是 ROADMAP 第一节原则"先做扎实，再扩范围"的延伸。

---

## 文档位置

| 文档 | 用途 |
| ---- | ---- |
| [README.md](../README.md) | 项目入口 |
| [AGENTS.md](../AGENTS.md) | AI 协作约束 |
| [CHANGELOG.md](../CHANGELOG.md) | 版本历史 |
| [plans/](plans/) | 各版本详细计划 |
| [deployment/v2.1.0.md](deployment/v2.1.0.md) | 上线提示（v2.1.0 模板） |
| [plans/active/v2.2.0-content-and-cleanup.md](plans/active/v2.2.0-content-and-cleanup.md) | v2.2.0 详细计划 |

**最后更新**: 2026-07-04
**下次回顾**: v2.2.0 上线后 4 周（收集触发数据）