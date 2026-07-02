# Plans 索引

## Active

| 版本 | 状态 | 目标分数 | 说明 |
| ---- | ---- | -------- | ---- |
| [v1.9.0-bugfix-stability.md](./active/v1.9.0-bugfix-stability.md) | **Active** | 8.0/10 | Bug 修复 + 稳定性 |

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
| [v1.8.0-streak-ui-social.md](./completed/v1.8.0-streak-ui-social.md) | 2026-07-02 | 签到 UI + 好友系统 |

---

## Roadmap 概览

```
v1.0.0 ✅ 商业化基线 (partial)
v1.1.0 ✅ i18n + SEO
v1.2.0 ✅ verify 真实化 + Stripe + PostHog
v1.3.0 ✅ Loop 状态更新（无功能变更）
v1.4.0 ✅ PWA 离线 + manifest
v1.5.0 ✅ B2B 多租户 + 教师 Dashboard
v1.6.0 ✅ 自适应学习 + AI 发音
v1.7.0 ✅ 中间件合并 + 基础设施
v1.8.0 ✅ 签到 UI + 好友系统 ← 全部完成！
v2.0.0 📋 商业化发布（待规划）
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
| v1.5.0 | 多租户 Schema、教师 Dashboard、班级管理 API |
| v1.6.0 | Spaced Repetition、Web Speech API、签到奖励逻辑 |
| v1.7.0 | 中间件合并（Clerk + locale）|
| v1.8.0 | StreakBadge、StreakToast、好友系统、/friends 页面 |

---

## 遗留任务

| 优先级 | 任务 | 影响 |
| ------ | ---- | ---- |
| 🟡 P1 | 数据库迁移（pnpm db:push）| 新 Schema 无法生效 |
| 🟢 P2 | README/CHANGELOG 更新 | 文档同步 |

---

## 新增代码文件 (v1.8.0)

```
components/streak-toast.tsx    # 签到奖励 Toast 提示
components/streak-badge.tsx   # 连续签到徽章
app/(main)/friends/page.tsx  # 好友页面
app/(main)/friends/friends-list.tsx
app/api/friends/route.ts     # 好友 API
db/schema-social.ts          # 好友数据模型
```

详见: [monetization-plan-2026-07-01.md](../business/monetization-plan-2026-07-01.md)
