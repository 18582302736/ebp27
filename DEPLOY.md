# EBP27 部署信息

## 访问地址

| 环境 | 地址 |
|------|------|
| 线上（GitHub Pages） | https://18582302736.github.io/ebp27/ |
| 本地开发 | http://localhost:8088 |

## 部署方式

- **平台**：GitHub Pages
- **仓库**：`18582302736/ebp27`
- **分支**：`main`，根目录 `/`
- **部署流程**：代码推送到 `main` 分支后，GitHub Pages 自动构建并发布

## 本地开发

```bash
# 启动本地服务器
cd /Users/tt/my-todo/焦虑症/小应用
python3 -m http.server 8088
```

## Service Worker 缓存说明

应用使用 Service Worker 实现离线缓存。SW 版本号定义在 `sw.js` 中：

```js
const CACHE_STATIC = 'ebp-static-v84';
```

### 更新代码后用户看不到新版本？

**原因**：浏览器端的 Service Worker 缓存了旧文件，清除 Safari 浏览器缓存无法清除 SW 缓存。

**解决方法**（用户侧）：

1. iPhone：设置 → Safari → 高级 → 网站数据 → 搜索 `github.io` → 左滑删除
2. 重新打开 `https://18582302736.github.io/ebp27/`

**解决方法**（开发者侧）：

修改 `sw.js` 中的 `CACHE_STATIC` 版本号（如 v4 → v5），提交推送即可强制所有用户更新缓存。

## 重要文件说明

| 文件 | 作用 |
|------|------|
| `sw.js` | Service Worker，控制离线缓存策略 |
| `index.html` | 首页（日历视图） |
| `day.html` | 每日详情页 |
| `js/lock.js` | 密码锁屏逻辑 |
| `js/data.js` | 课程数据 |
| `js/storage.js` | 本地存储（进度管理） |
| `js/app.js` | 日历页逻辑 |
| `js/day.js` | 每日详情页逻辑 |

## 默认密码

首次使用默认密码：`555000`

## .gitignore 说明

以下目录/文件不会被提交到 Git：
- `.DS_Store`、`.claude/`
- `deploy/` — 部署参考文件，不影响线上
- `test/`、`node_modules/`
