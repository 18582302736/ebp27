#!/bin/bash
# start.sh - 启动本地服务器（Mac 运行，iPhone 同 WiFi 访问）

cd "/Users/tt/my-todo/焦虑症/小应用"

LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || echo "未连接WiFi")
BONJOUR_NAME=$(scutil --get LocalHostName 2>/dev/null)

echo "========================================="
echo "  27天情绪练习 - 本地服务器"
echo "========================================="
echo ""

if [ -n "$BONJOUR_NAME" ]; then
  echo "📱 iPhone 请用这个地址访问（固定不变）："
  echo ""
  echo "   http://${BONJOUR_NAME}.local:8080"
  echo ""
  echo "   （数据会持久保存，IP变了也不丢失）"
else
  echo "📱 在 iPhone Safari 中打开以下地址："
  echo ""
  echo "   http://${LOCAL_IP}:8080"
fi

echo ""
echo "⚠️  确保 iPhone 和 Mac 连接同一个 WiFi"
echo "⚠️  保持此窗口打开，不要关闭"
echo "⚠️  按 Ctrl+C 可以停止服务器"
echo ""

python3 -m http.server 8080 --bind 0.0.0.0