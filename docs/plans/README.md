# Plans 索引

## Active

| 版本 | 状态 | 目标分数 | 说明 |
| ---- | ---- | -------- | ---- |
| [v1.8.0-streak-ui-social.md](./active/v1.8.0-streak-ui-social.md) | **Active** | 8.0/10 | 签到 UI + 好友系统 |

## Completed

| 版本 | 日期 | 说明 |
| ---- | ---- | ---- |
| [v1.0.0-commercialization.md](./completed/v1.0.0-commercialization.md) | 2026-07-01 | 商业化基线（partial）|
| [v1.1.0-i18n-seo.md](./completed/v1.1.0-i18n-seo.md) | 2026-07-01 | i18n + SEO |
| [v1.2.0-verify-stripe.md](./completed/v1.2.0-verify-stripe.md) | 2026-07-02 | verify 真实化 + Stripe + PostHog |
| [v1.3.0-loop-state.md](./completed/v1.3.0-loop-state.md) | 2026-07-01 | Loop 状态更新（无功能变更）|
| [v1.4.0-pwa-offline.md](./completed/v1.4.0-pwa-offline.md) | 2026-07-02 | PWA 离线 + manifest |
| [v1.5.0-b2b-school.md](./completed/v1.5.0-b2b-school.md) | 2026-07-02 | B2B 多租户 + 教师 Dashboard |
| [v1.6.0-adaptive-ai.md](./completed/v1.6.0-adaptive-ai.md) | 2026-07-02 | 自适应学习 + AI 发音 |
| [v1.7.0-infrastructure-observability.md](./completed/v1.7.0-infrastructure-observability.md) | 2026-07-02 | 中间件合并 + 基础设施 |

---

## Roadmap 概览

```
v1.0.0 ✅ 商业化基线 (partial)
v1.1.0 ✅ i18n + SEO
v1.3.0 ✅ Loop 状态更新（无功能变更）
v1.2.0 ✅ verify 真实化 + Stripe + PostHog
v1.4.0 ✅ PWA 离线 + manifest
v1.5.0 ✅ B2B 多租户 + 教师 Dashboard
v1.6.0 ✅ 自适应学习 + AI 发音
v1.7.0 ✅ 中间件合并 + 基础设施
v1.8.0 🔄 签到 UI + 好友系统 ← 当前
v2.0.0 📋 商业化发布
```

---

## 已实现的功能

| 版本 | 功能 |
| ---- | ---- |
| v1.0.0 | 隐私政策、服务条款、Cookie Banner |
| v1.1.0 | i18n (en/zh)、sitemap/robots |
| v1.2.0 | verify.sh 真实化、PostHog 埋点、Stripe Webhook |
| v1.3.0 | Loop 状态更新（无功能变更）|
| v1.4.0 | PWA manifest、Service Worker 配置、UpdateToast |
| v1.5.0 | 多租户 Schema、教师 Dashboard、班级管理 |
| v1.6.0 | Spaced Repetition、Web Speech API、签到奖励逻辑 |
| v1.7.0 | 中间件合并（Clerk + locale）|
| v1.8.0 | 签到 UI 接入、好友系统（进行中）|

---

## 遗留任务

| 优先级 | 任务 | 影响 |
| ------ | ---- | ---- |
| 🔴 P0 | 签到 UI 调用 updateStreakAndClaimRewards | 签到奖励无法生效 |
| 🟡 P1 | 好友系统完整实现 | 社交化未完成 |
| 🟡 P1 | 数据库迁移（tenant tables）| B2B 功能无法使用 |
| 🟢 P2 | README/CHANGELOG 更新 | 文档过时 |

---

## 缺失文档

- ~~v1.1.0 i18n SEO~~ - 已创建
- ~~v1.3.0~~ - 已创建（Loop 状态更新记录）

详见: [monetization-plan-2026-07-01.md](../business/monetization-plan-2026-07-01.md)
