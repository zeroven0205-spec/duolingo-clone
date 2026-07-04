# Lingo 功能清单与实现审计

> **生成于 2026-07-04**
>
> 本文档从 [docs/plans/completed/](../plans/completed/) 11 个历史 plan 提取所有承诺功能，对照当前代码（v2.2.0 + tag v2.2.0）逐条审计实现状态。
>
> **审计范围**：仅代码 / 配置 / 文件层；运营 / 部署 / 外部依赖（ICP 备案、PostHog 自托管等）不在此列。

---

## 审计图例

| 符号 | 含义 |
| ---- | ---- |
| ✅ | 完全实现，代码可验证 |
| ⚠️ | 部分实现（半成品 / 仅文件存在 / 调用方缺失） |
| ❌ | 计划承诺但当前未实现 |
| 🚫 | 已被后续决策覆盖（如 v2.3.0 第一性原理剔除） |
| ➖ | 运营 / 外部项，不入代码审计 |

---

## v1.0.0 — 商业化基线（2026-07-01）

| 计划项 | 状态 | 证据 |
| ---- | ---- | ---- |
| ICP 备案 | ➖ | 运营项，无代码证据 |
| `/privacy-policy` 路由 | ✅ | [app/privacy-policy/page.tsx](../../app/privacy-policy/page.tsx) |
| `/terms-of-service` 路由 | ✅ | [app/terms-of-service/page.tsx](../../app/terms-of-service/page.tsx) |
| Cookie Banner | ✅ | [components/cookie-banner.tsx](../../components/cookie-banner.tsx) |
| `.env.example` 清理 | ✅ | `grep -rE "sk_live_\|sk_test_[A-Za-z0-9]{20,}"` 无匹配 |
| Stripe 国内适配（支付宝 / 微信） | ❌ | [lib/stripe.ts](../../lib/stripe.ts) 只接 Stripe |
| PostHog 自托管 | ➖ | 改用 PostHog Cloud（[lib/analytics.ts](../../lib/analytics.ts)） |
| 多语言 UI (i18n) | ✅ | 在 v1.1.0 完成 |
| PWA 配置 | ⚠️ | 框架在，runtimeCaching 直到 v2.2.0 才补 |
| **移动端 App** | 🚫 | 不再列路线图 |

---

## v1.1.0 — i18n + SEO（2026-07-01）

| 计划项 | 状态 | 证据 |
| ---- | ---- | ---- |
| `messages/en.json` | ✅ | 68 keys |
| `messages/zh.json` | ✅ | 68 keys，`pnpm check-i18n` 通过 |
| `public/sitemap.xml` | ✅ | 文件存在 |
| `public/robots.txt` | ✅ | 文件存在 |
| 隐私政策 + 服务条款 i18n | ✅ | 见 v1.0.0 |

---

## v1.2.0 — verify + Stripe + PostHog（2026-07-02）

| 计划项 | 状态 | 证据 |
| ---- | ---- | ---- |
| verify.sh 真实化 | ✅ | [scripts/verify.sh](../../scripts/verify.sh) 6 步全真 |
| 4 TS 错误修复 | ✅ | `npx tsc --noEmit` 通过 |
| ESLint config 修复 | ✅ | `pnpm lint` 通过 |
| Stripe 接入 | ✅ | [lib/stripe.ts](../../lib/stripe.ts) + webhook |
| Webhook 签名验证 | ✅ | [app/api/webhooks/stripe/route.ts](../../app/api/webhooks/stripe/route.ts) 用 `stripe.webhooks.constructEvent` |
| PostHog 接入 | ✅ | [lib/analytics.ts](../../lib/analytics.ts) |
| `user_registered` 埋点 | ✅ | [actions/user-progress.ts:58](../../actions/user-progress.ts) |
| `lesson_completed` 埋点 | ✅ | [actions/user-progress.ts:186](../../actions/user-progress.ts) |
| `subscription_started` 埋点 | ⚠️ | analytics.ts 定义但无 caller（Stripe webhook 未调） |
| `hearts_exhausted` 埋点 | ✅ | [actions/user-progress.ts:116](../../actions/user-progress.ts) |
| `churn_risk` 埋点 | ❌ | 未实现 |
| **`/account` 订阅管理页** | ❌ | 路由不存在 |

---

## v1.3.0 — Loop 状态更新（2026-07-01）

| 计划项 | 状态 | 证据 |
| ---- | ---- | ---- |
| Loop 状态 / 验证 / 日志 | ➖ | 维护版本，无代码变更 |

---

## v1.4.0 — PWA 离线 + 安全加固（2026-07-02）

| 计划项 | 状态 | 证据 |
| ---- | ---- | ---- |
| Hardcoded secrets 清理 | ✅ | grep 无匹配 |
| Stripe webhook 签名验证 | ✅ | 同 v1.2.0 |
| PWA 框架接入 | ✅ | [next.config.ts](../../next.config.ts) `withPWA()` |
| `public/manifest.json` | ✅ | 文件存在 |
| **runtimeCaching** | ✅ | **v2.2.0 补齐**（4 条规则：fonts/static/course-api/images） |
| SW 更新提示 | ✅ | [components/update-toast.tsx](../../components/update-toast.tsx) |
| 连续签到数据模型（streak + lastLoginDate） | ✅ | schema 中已存在 |
| **`streakHistory: jsonb`** | ❌ | **v2.3.0 场景 B 触发前置**（[ROADMAP](../ROADMAP.md) 已记） |
| 日语 / 韩语 UI | 🚫 | v2.2.0 第一性原理剔除 |

---

## v1.5.0 — B2B 学校版 + 增长分析（2026-07-02）

| 计划项 | 状态 | 证据 |
| ---- | ---- | ---- |
| 多租户 schema | ⚠️ | [db/schema-tenant.ts](../../db/schema-tenant.ts) 存在 |
| `tenants` / `tenant_members` / `classrooms` 表 | ⚠️ | schema 存在，**生产 DB 未迁移**（需 `pnpm db:push`） |
| 教师 Dashboard `/teacher` | ✅ | [app/(main)/teacher/page.tsx](../../app/(main)/teacher/page.tsx) |
| Classrooms API | ✅ | [app/api/classrooms/route.ts](../../app/api/classrooms/route.ts) |
| **多租户实际隔离** | ❌ | 所有 query 仍按 `userId` 过滤，未接入 `tenantId` |
| PostHog 自托管 | ➖ | 改用 PostHog Cloud |
| 关键指标 Dashboard | 🚫 | 数据基建不属于代码债 |

---

## v1.6.0 — 自适应学习 + AI 发音（2026-07-02）

| 计划项 | 状态 | 证据 |
| ---- | ---- | ---- |
| Spaced Repetition 算法 | ✅ | [lib/spaced-repetition.ts](../../lib/spaced-repetition.ts) |
| 复习队列 API | ✅ | [app/api/review-queue/route.ts](../../app/api/review-queue/route.ts) |
| 词汇进度 schema | ⚠️ | [db/schema-word-progress.ts](../../db/schema-word-progress.ts) 存在，**生产 DB 未迁移** |
| Web Speech API 发音评估 | ✅ | [lib/speech-evaluation.ts](../../lib/speech-evaluation.ts)（v2.2.0 从 `speech评估.ts` 重命名） |
| **AI 发音实际接入到 lesson** | ❌ | lib 存在，无 UI 调用方 |
| **复习队列 UI** | ✅ | **v2.2.0 接通**（[app/(main)/review/page.tsx](../../app/(main)/review/page.tsx)） |

---

## v1.7.0 — 中间件合并 + 可观测性（2026-07-02）

| 计划项 | 状态 | 证据 |
| ---- | ---- | ---- |
| verify.sh 真实化 | ✅ | 同 v1.2.0 |
| 签到逻辑接入 | ✅ | [app/(main)/learn/page.tsx](../../app/(main)/learn/page.tsx) 调 `updateStreakAndClaimRewards` |
| PWA manifest + 配置 | ✅ | 同 v1.4.0 |
| PostHog 接入 | ✅ | 同 v1.2.0 |
| **结构化日志（pino / winston）** | ❌ | **生产问题排查无 request 级 trace** |
| 文档状态修正 | ✅ | 已分 `active/` + `completed/` |

---

## v1.8.0 — 签到 UI + 好友（2026-07-02）

| 计划项 | 状态 | 证据 |
| ---- | ---- | ---- |
| `StreakToast` 组件 | ✅ | [components/streak-toast.tsx](../../components/streak-toast.tsx) |
| Learn 页面调用签到 | ✅ | 同 v1.7.0 |
| `StreakBadge` 组件 | ✅ | [components/streak-badge.tsx](../../components/streak-badge.tsx)（v2.2.0 重写为纯展示） |
| 好友 schema | ⚠️ | [db/schema-social.ts](../../db/schema-social.ts) 存在，**生产 DB 未迁移** |
| 好友 API | ✅ | [app/api/friends/route.ts](../../app/api/friends/route.ts) |
| 好友页面 `/friends` | ✅ | [app/(main)/friends/page.tsx](../../app/(main)/friends/page.tsx) + friends-list.tsx |
| **每日学习挑战（好友比赛）** | ❌ | 只有基础好友列表，无挑战 |
| 班级 PK | 🚫 | 不再列路线图 |

---

## v1.9.0 — Bug 修复 + 稳定性（2026-07-02）

| 计划项 | 状态 | 证据 |
| ---- | ---- | ---- |
| `/privacy` / `/terms` 公开 | ✅ | [middleware.ts](../../middleware.ts) 含 `/privacy` `/privacy-policy` `/terms` `/terms-of-service` |
| i18n 切换修复 | ✅ | [components/locale-loader.tsx](../../components/locale-loader.tsx) 切完 reload |
| Demo 页面 `/demo` | ✅ | [app/(marketing)/demo/page.tsx](../../app/(marketing)/demo/page.tsx) |
| Clerk dev modal 隐藏 | ✅ | CHANGELOG 提及，CSS 隐藏 |
| 语言按钮 toast | ⚠️ | CHANGELOG 提及；当前 [app/page.tsx](../../app/page.tsx) 行为待核 |

---

## v2.0.0 — 工程化质量 + 测试（2026-07-02）

| 计划项 | 状态 | 证据 |
| ---- | ---- | ---- |
| verify.sh 包管理器修复 | ✅ | `pnpm exec vitest --run` |
| ESLint config 修复 | ✅ | lint clean |
| Spaced Repetition 测试 | ✅ | [tests/spaced-repetition.test.ts](../../tests/spaced-repetition.test.ts) |
| Streak 测试 | ✅ | [tests/streak.test.ts](../../tests/streak.test.ts) |
| Analytics 测试 | ✅ | [tests/analytics.test.ts](../../tests/analytics.test.ts) |
| Shop 测试 | ✅ | [tests/shop.test.ts](../../tests/shop.test.ts)（v2.2.0 加） |
| Feature flag 测试 | ✅ | [tests/feature-flag.test.ts](../../tests/feature-flag.test.ts)（v2.2.0 加） |
| **AGENTS.md 100+ 行** | ❌ | **当前 33 行**（计划说"100+"） |
| CI workflow（GitHub Actions） | ❌ | `.github/workflows/` 目录存在但未配置 verify 流程 |

---

## v2.1.0 — 游戏化 + 留存机制（2026-07-04）

| 计划项 | 状态 | 证据 |
| ---- | ---- | ---- |
| Streak 可视化（庆祝 + 保护） | ✅ | [components/streak-celebration.tsx](../../components/streak-celebration.tsx) + schema 字段 |
| Streak Freeze / Shield | ✅ | [actions/shop.ts](../../actions/shop.ts) + `streakProtectionUntil` 字段 |
| XP Boost 商品 | ⚠️ | 字段已写，**v2.2.0 才真正生效** |
| Hearts Pack | ⚠️ | **v2.2.0 才修复满血拒绝** |
| 商店 UI | ✅ | [app/(main)/shop/items.tsx](../../app/(main)/shop/items.tsx) |
| 排行榜周期 tabs | ✅ | [app/(main)/leaderboard/period-tabs.tsx](../../app/(main)/leaderboard/period-tabs.tsx) |
| 任务完成动画 | ✅ | [components/quests-list.tsx](../../components/quests-list.tsx) |

---

## v2.2.0 — 收尾 + 接通半成品（2026-07-04，已 tag）

详见 [plans/completed/v2.2.0-gamification.md](../plans/completed/v2.2.0-gamification.md) 与 [plans/active/v2.2.0-content-and-cleanup.md](../plans/active/v2.2.0-content-and-cleanup.md)。

| 计划项 | 状态 | 证据 |
| ---- | ---- | ---- |
| DEBT-1 XP Boost 实际生效 | ✅ | [actions/challenge-progress.ts](../../actions/challenge-progress.ts) `applyPointsAward` |
| DEBT-2 Hearts Pack 满血拒绝 | ✅ | [actions/shop.ts](../../actions/shop.ts) + items.tsx |
| DEBT-3 Shop 埋点 3 事件 | ✅ | user-streak.ts + shop.ts + 隐式触发 |
| DEBT-4 Feature flag 框架 | ✅ | [lib/feature-flag.ts](../../lib/feature-flag.ts) |
| WIRE-1 复习队列 UI | ✅ | [app/(main)/review/page.tsx](../../app/(main)/review/page.tsx) |
| WIRE-2 间隔重复 box 标签 | ✅ | [components/review-session.tsx](../../components/review-session.tsx) 用 `getBoxLabel` |
| WIRE-3 zh/en 文案校对 | ✅ | [scripts/check-i18n.ts](../../scripts/check-i18n.ts) |
| WIRE-4 PWA runtimeCaching | ✅ | [next.config.ts](../../next.config.ts) |
| HYGIENE-1 文件重命名 | ✅ | `speech-evaluation.ts` |
| HYGIENE-2 Shop 测试 | ✅ | 5 测试文件 |

---

## 真缺口汇总（按第一性原理筛选）

> **筛选原则**：只列**影响产品功能 / 代码可维护性**的缺口。
> 运营 / 部署 / 外部依赖 / 数据基建（dashboard）不计。
> 已被 v2.3.0 第一性原理剔除的不计。

| 缺口 | 来源 plan | 严重度 | 建议归属 |
| ---- | ---- | ---- | ---- |
| **结构化日志缺失**（pino / winston / next/log） | v1.7.0 GAP-OBS | 🔴 高 — PostHog 在埋，但服务端 runtime 错无 trace | **v2.3.0 场景 C 注入**（工程卫生） |
| **AGENTS.md 33 行**（计划 100+） | v2.0.0 LING-P2-AGENTS | 🟡 中 — 影响 AI 协作效率 | **v2.3.0 场景 C 注入** |
| `streakHistory: jsonb` 缺失 | v1.4.0 LING-P2-STREAK-1 | 🟡 中 — 成就系统前置条件 | 已是 [ROADMAP 场景 B 触发前置](../ROADMAP.md) |
| `subscription_started` 埋点无 caller | v1.2.0 LING-P1-3 | 🟢 低 — Stripe webhook 调一下即可 | **v2.3.0 场景 C 注入**（同埋点修复批次） |
| `churn_risk` 埋点未实现 | v1.2.0 LING-P1-3 | 🟢 低 — 需 D7 调度，先不急 | 暂搁置，等运营数据需求 |
| AI 发音实际接入到 lesson UI | v1.6.0 LING-P2-SPEECH-1 | 🚫 | v2.2.0 第一性原理剔除（无资产、浏览器兼容性差） |
| `/account` 订阅管理页 | v1.2.0 LING-P1-2 | 🚫 | 当前 Stripe Customer Portal 链接可替代 |
| 好友每日学习挑战 | v1.8.0 LING-P1-FRIENDS-3 | 🚫 | 好友使用率未达 [ROADMAP 触发条件](../ROADMAP.md)（需 ≥20%） |
| B2B 多租户实际隔离 | v1.5.0 LING-P0-B2B-1 | 🚫 | 当前产品定位非 B2B（v2.3.0 第一性原理：先做 zh/en 用户） |
| 班级 PK | v1.8.0 LING-P2-SOCIAL-2 | 🚫 | 不再列路线图 |

---

## 部署项（运营 / 不入版本）

| 项 | 说明 | 触发条件 |
| ---- | ---- | ---- |
| 生产 DB 迁移 `pnpm db:push` | `db/schema-word-progress.ts` / `schema-social.ts` / `schema-tenant.ts` / `user_progress.streakProtectionUntil` 等已定义 | 上线前必做 |
| PostHog dashboard 配置 | 6 个事件已埋但 dashboard 没建 | 上线后第一周 |

---

## 历史噪声（已在 v2.3.0 第一性原理剔除）

这些不应作为"缺口"提出，已被决策覆盖：

- ❌ 日语 / 韩语 / 任何第三种 UI 语言
- ❌ 音频听写 / 跟读等新题型（无资产、浏览器兼容性差）
- ❌ 暗色模式（审美问题，非产品问题）
- ❌ Framer Motion 动画
- ❌ 完整 PWA 离线（Background Sync / 推送 / IndexedDB）
- ❌ AI 对话 / 智能发音（无 LLM 预算 / 数据脱敏方案）
- ❌ 私有化部署 / 课程编辑器 / Open API / 证书系统
- ❌ React Native 移动端
- ❌ NFT 证书
- ❌ 班级 PK / 学习小组