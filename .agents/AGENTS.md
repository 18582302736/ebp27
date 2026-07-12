# AnxietyHeal For TT — 项目规则

## 版本号管理

**每次向 GitHub 推送代码前，必须同步更新版本号。**

版本号位于以下两个文件，两处必须同时更新，保持一致：
- `index.html` → 两个页脚 `<p class="app-version">` 内的版本字符串（如 `v2.0.1`）
- `day.html` → 页脚 `<p class="app-version">` 内的版本字符串
- `js/backup.js` → `BACKUP_APP_VERSION`，与页面版本保持一致
- `sw.js` → `CACHE_STATIC`，每次推送递增，确保用户取得最新资源

即使只调整一个字、一处样式或一行配置，只要需要推送，也必须至少增加 patch 版本号；禁止在版本号未变化时推送代码。

### 版本号规则（语义化版本）
- **patch（末位 +1）**：bug 修复、样式微调、文案修改，例如 v1.0.7 → v1.0.8
- **minor（中位 +1）**：新增功能、较大 UI 改版，例如 v1.0.7 → v1.1.0
- **major（首位 +1）**：架构重构、破坏性变更，例如 v1.0.7 → v2.0.0

### 当前版本
`v2.5.0`（截至 2026-07-12）

## 其他规则

- 每次 push 前先执行 `git pull --rebase origin main`，避免冲突
- 如果代理导致 push 失败，使用 `git push origin main`（已清除全局代理）
- 该项目部署在 GitHub Pages，仓库：`18582302736/ebp27`，主分支：`main`
