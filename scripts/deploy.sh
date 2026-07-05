#!/bin/bash
# deploy.sh - 一键部署脚本
# 用法：在终端中运行 bash scripts/deploy.sh

set -e

PROJECT_DIR="/Users/tt/my-todo/焦虑症/小应用"
cd "$PROJECT_DIR"

echo "========================================="
echo "  27天情绪练习 - 一键部署"
echo "========================================="
echo ""

# 1. 文件整理
echo "【步骤 1/3】整理文件..."
bash scripts/rename-files.sh
echo ""

# 2. 检查 wrangler 是否安装
echo "【步骤 2/3】检查部署工具..."
if ! command -v npx &> /dev/null; then
    echo "❌ 未找到 npx，请先安装 Node.js: https://nodejs.org"
    exit 1
fi
echo ""

# 3. 部署到 Cloudflare Pages
echo "【步骤 3/3】部署到 Cloudflare Pages..."
echo "如果是第一次使用，会弹出浏览器让你登录 Cloudflare"
echo ""

npx wrangler pages deploy . --project-name=ebp27 --branch=main

echo ""
echo "========================================="
echo "  部署完成！"
echo "========================================="
echo ""
echo "在 iPhone 上打开 Safari，访问："
echo "  https://ebp27.pages.dev"
echo ""
echo "然后点击「分享」→「添加到主屏幕」"
echo "========================================="