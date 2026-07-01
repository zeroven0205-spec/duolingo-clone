# duolingo-clone 8 维评分 + Verify 诊断 (2026-07-01)

> **复评时间**: 2026-07-01 07:49 (Asia/Shanghai)
> **复评者**: Mavis orchestrator (harness-engineering 路径 B/C)
> **数据来源**: 6 步 verify 实跑 + AGENTS.md + CHANGELOG + 商业化基线 v1.0.0
> **基础**: 新项目评估, 无 baseline

---

## 0. 项目概览

| 维度 | 内容 |
|---|---|
| **业务定位** | **Lingo** - 商业化语言学习平台（Duolingo 仿版） |
| **目标客户** | C 端语言学习用户（多语言市场）|
| **收入模式** | B2C 订阅（Free + Plus ¥30/月 + Super ¥168/年 + Family ¥388/年） |
| **技术栈** | Next.js 15 + React 19 + Clerk v7.4.3 + Drizzle ORM + Neon DB + Vitest + Vercel |
| **当前版本** | **v1.1.0 active** (dev 分支) — i18n + SEO + business completeness |
| **当前路径** | Path A/B 混合（新项目 + 商业化基线）|
| **当前自动化等级** | 未明确（AGENTS.md 仅 51 行，无 L0-L4 声明） |
| **当前 active plan** | 无独立 active/ 目录（仅 docs/ + plans/）|
| **当前部署** | [lingo-clone.vercel.app](https://lingo-clone.vercel.app/) |
| **本报告评分** | **5.56/10** |

---

## 1. verify 真值 (2026-07-01 实跑) 🚨

### 1.1 verify.sh 实际跑（假 verify）

```bash
$ bash scripts/verify.sh
Running verify gate...
[1/6] Type checking...
[2/6] Running tests...
[3/6] Linting...
[4/6] Building...
[5/6] Checking docs...
[6/6] Checking paths...
✓ All checks passed
EC: 0
```

**🚨 假 verify！** 6 步全是 `echo`，没有任何实际检查，set -e 永不触发，最后 echo "All checks passed" — **典型虚假信心反模式（PCD）**

完整 verify.sh 源码：
```bash
#!/bin/bash
set -e
echo "Running verify gate..."
echo "[1/6] Type checking..."
echo "[2/6] Running tests..."
echo "[3/6] Linting..."
echo "[4/6] Building..."
echo "[5/6] Checking docs..."
echo "[6/6] Checking paths..."
echo "✓ All checks passed"
```

### 1.2 实际 type-check 实跑

```bash
$ npx tsc --noEmit
app/layout.tsx(35,9): error TS2353: Object literal may only specify known properties, and 'layout' does not exist in type 'Appearance<Theme>'.
components/modals/exit-modal.tsx(18,32): error TS2307: Cannot find module './locale-provider' or its corresponding type declarations.
components/modals/hearts-modal.tsx(18,32): error TS2307: Cannot find module './locale-provider' or its corresponding type declarations.
components/modals/practice-modal.tsx(17,32): error TS2307: Cannot find module './locale-provider' or its corresponding type declarations.
EC: 1
```

**4 个 TS 错误**:
- `app/layout.tsx` line 35: `layout` 不在 Clerk `Appearance<Theme>` 类型中（Clerk API 误用）
- 3 个 modals 找不到 `./locale-provider`（路径错 — 实际在 `components/locale-provider.tsx`）

### 1.3 实际 lint 实跑

```bash
$ npm run lint
JSON.stringify (<anonymous>)
at @eslint/eslintrc/.../config-validator.js:308:45
EC: 1
```

**ESLint config schema 损坏** — `eslint.config.mjs` 包含非法配置

### 1.4 secret-scan

```bash
$ bash scripts/secret-scan.sh
Running secret scan...
✓ Secret scan passed
EC: 0
```

✅ PASS（用了 .gitleaks.toml + CI 集成）

---

## 2. 8 维评分 (2026-07-01)

### 2.1 评分矩阵

| 维度 | 分 | 评分依据 |
|---|---:|---|
| **1. 工程化** | **3.0** | verify.sh 假 verify (PCD-1) + 实际 type-check FAIL 4 错误 + ESLint config 损坏 |
| **2. 安全** | **7.0** | Clerk auth + .env.example + cookie banner + privacy-policy + terms-of-service |
| **3. 文档** | **7.5** | AGENTS + README + CHANGELOG + CONTRIBUTING + CODE_OF_CONDUCT + SECURITY + i18n 多语言 |
| **4. 代码组织** | **7.0** | Next.js route groups: (auth)/(main)/(marketing)/admin/api + actions/ + components/ + db/ + lib/ + store/ + i18n/ |
| **5. 部署运维** | **6.0** | Dockerfile + Vercel 自动部署 + 无 CI workflow 实际跑 |
| **6. 项目管理** | **6.5** | CHANGELOG + RELEASE_CHECKLIST + git tag 管理 + sitemap/robots |
| **7. AI 友好度** | **4.5** | AGENTS 浅（51 行） + .harness/config.json 仅 G1 一条规则 |
| **8. 可观测性** | **3.0** | 无 metrics endpoint + 无 audit log |
| **总分 (均)** | **5.56** | — |

**算术复核**: (3.0+7.0+7.5+7.0+6.0+6.5+4.5+3.0)/8 = 44.5/8 = **5.5625 → 5.56** ✓

### 2.2 维度排序

🥇 **最强**: 文档 7.5 / 安全 7.0 / 代码组织 7.0
🥉 **最弱**: 工程化 3.0（verify 假）/ 可观测性 3.0 / AI 友好度 4.5

---

## 3. 商业化路径已就位

| 商业化要素 | 状态 | 证据 |
|---|---|---|
| **隐私政策页** | ✅ | `app/privacy-policy/page.tsx` |
| **服务条款页** | ✅ | `app/terms-of-service/page.tsx` |
| **Cookie 同意横幅** | ✅ | `components/cookie-banner.tsx` |
| **GDPR Cookie 合规** | ✅ | banner.tsx + cookie-banner.tsx |
| **多语言 i18n** | ✅ | `messages/en.json` + `messages/zh.json` |
| **sitemap.xml** | ✅ | v1.1.0 commit |
| **robots.txt** | ✅ | v1.1.0 commit |
| **支付/订阅 (hearts-modal)** | ✅ | Duolingo 红心机制 = 订阅钩子 |
| **Clerk 用户认证** | ✅ | `@clerk/nextjs` v7.4.3 |
| **Vercel 部署** | ✅ | 已部署 https://lingo-clone.vercel.app/ |
| **Open Graph / Icon** | ✅ | apple-icon.png, icon1.png, icon2.png |
| **Dockerfile** | ✅ | 182 bytes |
| **CONTRIBUTING.md** | ✅ | 8.5K 标准 PR/issue 流程 |
| **CODE_OF_CONDUCT.md** | ✅ | Contributor Covenant |
| **SECURITY.md** | ✅ | 漏洞报告流程 |
| **LICENSE** | ✅ | MIT |

**业务核心**: Duolingo 仿版语言学习 SaaS

---

## 4. P0/P1/P2/P3 问题清单

### 4.1 P0 (1 RB + 1 PCD = 2 项)

| 编号 | 类目 | 描述 | 证据 | 修复路径 |
|---|---|---|---|---|
| **LING-P0-RB-1** | RB | **verify.sh 是假 verify（6 步全是 echo）** | `scripts/verify.sh` 完整内容 | 替换为真实命令（`npx tsc --noEmit` + `npm test` + `npm run lint` + `npm run build` + docs-lint + paths-lint）|
| **LING-P0-PCD-1** | PCD | **实际 type-check FAIL 4 错误** | `app/layout.tsx` + 3 个 modals | (a) Clerk `layout` 用法 → 改用 `elements`；(b) modals import path → `../locale-provider` |

### 4.2 P1 (3 项)

| 编号 | 描述 |
|---|---|
| **LING-P1-1** | ESLint config schema 损坏（`npm run lint` ConfigValidator error）|
| **LING-P1-2** | Stripe 未接入（hearts-modal 已实现订阅钩子，但跳 /store 无支付）|
| **LING-P1-3** | 无数据埋点（PostHog / Mixpanel / Amplitude）|

### 4.3 P2 (3 项)

| 编号 | 描述 |
|---|---|
| LING-P2-1 | 无 Sentry 错误监控 |
| LING-P2-2 | 无 A/B 测试框架 |
| LING-P2-3 | AI 友好度浅（AGENTS 仅 51 行 + .harness/config.json 仅 G1 一条规则）|

### 4.4 P3 (1 项)

| 编号 | 描述 |
|---|---|
| LING-P3-1 | 多语言扩展（en + zh → +es/fr/ja/de/it/pt/ko/ar）|

---

## 5. 版本迭代路径

```
v1.0.0 商业化基线 (Completed, b23aa05)
  ↓ legal pages + cookie banner + AGENTS + verify pipeline
v1.1.0 i18n + SEO (active)
  ↓ en + zh + sitemap/robots
v1.2.0 verify 真实化 + Stripe 接入 (Planned, 1-2 周)
  ↓ verify.sh 真命令 + Stripe + PostHog
v1.3.0 增长优化 (Planned, 2-3 周)
  ↓ 付费墙 + 转化漏斗 + A/B 测试
v1.4.0 留存优化 (Planned, 3 周)
  ↓ 学习连续性 + 推送 + Streak
v1.5.0 内容扩展 (Planned, 4 周)
  ↓ +es/fr/ja/de + 听写/口语
v2.0.0 商业化发布 (Planned, 10-12 周累计)
  ↓ 营销 + 多语言 + 留存
```

---

## 6. 数据可信度

- **均值**: **5.56** (算术复核 (3.0+7.0+7.5+7.0+6.0+6.5+4.5+3.0)/8 = 44.5/8 = 5.5625)
- **verify 真值**: 0/6 真跑（verify.sh 假）, 1 实际 type-check FAIL
- **P0 总数**: 2 (1 RB + 1 PCD)
- **限制**: 未跑 N≥3 复跑（memory §3.12 双独立 verifier）, 商业化分析为推测

---

## 7. 立即行动（本周 6-8h）

1. **verify 真实化**（3h）— 替换 verify.sh + 修 type-check 4 错误 + 修 ESLint config
2. **支付接入**（3h）— Stripe 测试环境 + webhook + 订阅管理 + HeartsModal 跳 Stripe
3. **数据埋点**（2h）— PostHog / Mixpanel + 注册 / 学习完成 / 付费 / 流失事件

详细商业化方案见 `docs/business/monetization-plan-2026-07-01.md`