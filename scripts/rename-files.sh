#!/bin/bash
# rename-files.sh - 将原始文件重命名并复制到 assets 目录

set -e

SRC="/Users/tt/my-todo/焦虑症/2.情绪EBP"
DEST="/Users/tt/my-todo/焦虑症/小应用/assets"

echo "=== 创建目标目录 ==="
mkdir -p "$DEST/reading-audio"
mkdir -p "$DEST/mindfulness-audio"
mkdir -p "$DEST/worksheets"

copy_file() {
  local src="$1"
  local dest="$2"
  if [ -f "$src" ]; then
    cp "$src" "$dest"
    echo "  $dest ✓"
  else
    echo "  ⚠ 未找到: $src"
  fi
}

echo "=== 复制阅读书写练习音频 ==="
copy_file "$SRC/阅读书写练习音频/1 记录视觉幸福小事 情绪日记.MP3" "$DEST/reading-audio/day-01.mp3"
copy_file "$SRC/阅读书写练习音频/2 记录味觉幸福小事 情绪日记.MP3" "$DEST/reading-audio/day-02.mp3"
copy_file "$SRC/阅读书写练习音频/3 记录触觉幸福小事 情绪日记.MP3" "$DEST/reading-audio/day-03.mp3"
copy_file "$SRC/阅读书写练习音频/4 记录嗅觉幸福小事 情绪日记.MP3" "$DEST/reading-audio/day-04.mp3"
copy_file "$SRC/阅读书写练习音频/5 记录行走的体验 情绪日记.MP3" "$DEST/reading-audio/day-05.mp3"
copy_file "$SRC/阅读书写练习音频/6收集开心清单 情绪日记.MP3" "$DEST/reading-audio/day-06.mp3"
copy_file "$SRC/阅读书写练习音频/7 记录成就清单 情绪日记.MP3" "$DEST/reading-audio/day-07.mp3"
copy_file "$SRC/阅读书写练习音频/8 小结投入当下，积累积极资源 情绪日记.MP3" "$DEST/reading-audio/day-08.mp3"
copy_file "$SRC/阅读书写练习音频/9 用语言和数字，描述你的情绪 情绪日记.MP3" "$DEST/reading-audio/day-09.mp3"
copy_file "$SRC/阅读书写练习音频/10 认识情绪的功能 情绪日记.MP3" "$DEST/reading-audio/day-10.mp3"
copy_file "$SRC/阅读书写练习音频/11 看清情绪产生的过程 情绪日记.MP3" "$DEST/reading-audio/day-11.mp3"
copy_file "$SRC/阅读书写练习音频/12 认识情绪如何维持和变化 情绪日记.MP3" "$DEST/reading-audio/day-12.mp3"
copy_file "$SRC/阅读书写练习音频/13 给想法起个名字 情绪日记.MP3" "$DEST/reading-audio/day-13.mp3"
copy_file "$SRC/阅读书写练习音频/14 小结  接纳，让情绪自然来去 情绪日记.MP3" "$DEST/reading-audio/day-14.mp3"
copy_file "$SRC/阅读书写练习音频/15 识别行为模式 情绪日记.MP3" "$DEST/reading-audio/day-15.mp3"
copy_file "$SRC/阅读书写练习音频/16 澄清期待 情绪日记.MP3" "$DEST/reading-audio/day-16.mp3"
copy_file "$SRC/阅读书写练习音频/17 向价值的方向行动 情绪日记.MP3" "$DEST/reading-audio/day-17.mp3"
copy_file "$SRC/阅读书写练习音频/18 制定你的行动计划 情绪日记.MP3" "$DEST/reading-audio/day-18.mp3"
copy_file "$SRC/阅读书写练习音频/19 把应对情绪压力的技能，融入生活 情绪日记.MP3" "$DEST/reading-audio/day-19.mp3"
copy_file "$SRC/阅读书写练习音频/20 把向着价值行动的技能，融入生活 情绪日记.MP3" "$DEST/reading-audio/day-20.mp3"
copy_file "$SRC/阅读书写练习音频/21 培育情绪技能树 情绪日记.MP3" "$DEST/reading-audio/day-21.mp3"
copy_file "$SRC/阅读书写练习音频/22 拓展阅读从心理学家的视角，理解幸福 情绪日记.MP3" "$DEST/reading-audio/day-22.mp3"
copy_file "$SRC/阅读书写练习音频/23 拓展阅读从心理学家的视角，理解情绪 情绪日记.MP3" "$DEST/reading-audio/day-23.mp3"
copy_file "$SRC/阅读书写练习音频/24 拓展阅读  从心理学家的视角，理解觉察与接纳 情绪日记.MP3" "$DEST/reading-audio/day-24.mp3"
copy_file "$SRC/阅读书写练习音频/25 日常练习  情绪共处 正念基础练习.MP3" "$DEST/reading-audio/day-25.mp3"
copy_file "$SRC/阅读书写练习音频/26 我的初心与承诺 我的初心与承诺.MP3" "$DEST/reading-audio/day-26.mp3"
copy_file "$SRC/阅读书写练习音频/27 情绪小锦囊 正念练习.MP3" "$DEST/reading-audio/day-27.mp3"

echo "=== 复制正念基础练习音频 ==="
copy_file "$SRC/正念基础练习/1.正念初体验：呼吸 正念基础练习.MP3" "$DEST/mindfulness-audio/day-01.mp3"
copy_file "$SRC/正念基础练习/2.用正念的方式进食 正念基础练习.MP3" "$DEST/mindfulness-audio/day-02.mp3"
copy_file "$SRC/正念基础练习/3.让注意力重回当下 正念基础练习.MP3" "$DEST/mindfulness-audio/day-03.mp3"
copy_file "$SRC/正念基础练习/4.感受呼吸的气味 正念基础练习.MP3" "$DEST/mindfulness-audio/day-04.mp3"
copy_file "$SRC/正念基础练习/5.在行走中休息大脑 正念基础练习.MP3" "$DEST/mindfulness-audio/day-05.mp3"
copy_file "$SRC/正念基础练习/6.从想法回到呼吸 正念基础练习.MP3" "$DEST/mindfulness-audio/day-06.mp3"
copy_file "$SRC/正念基础练习/7.允许想法自由来去 正念基础练习.MP3" "$DEST/mindfulness-audio/day-07.mp3"
copy_file "$SRC/正念基础练习/8.用行走在情绪中着陆 正念基础练习.MP3" "$DEST/mindfulness-audio/day-08.mp3"
copy_file "$SRC/正念基础练习/9 和身体重建连接 正念基础练习.MP3" "$DEST/mindfulness-audio/day-09.mp3"
copy_file "$SRC/正念基础练习/10 放下头脑的担忧 正念基础练习.MP3" "$DEST/mindfulness-audio/day-10.mp3"
copy_file "$SRC/正念基础练习/11 掌控注意的方向 正念基础练习.MP3" "$DEST/mindfulness-audio/day-11.mp3"
copy_file "$SRC/正念基础练习/12 了解身体与情绪的关系 正念基础练习.MP3" "$DEST/mindfulness-audio/day-12.mp3"
copy_file "$SRC/正念基础练习/13 不评判地和感受共处 正念基础练习.MP3" "$DEST/mindfulness-audio/day-13.mp3"
copy_file "$SRC/正念基础练习/14 自我关怀的力量 正念基础练习.MP3" "$DEST/mindfulness-audio/day-14.mp3"
copy_file "$SRC/正念基础练习/15 允许感受自然起伏 正念基础练习.MP3" "$DEST/mindfulness-audio/day-15.mp3"
copy_file "$SRC/正念基础练习/16 正念地面对情绪 正念基础练习.MP3" "$DEST/mindfulness-audio/day-16.mp3"
copy_file "$SRC/正念基础练习/17 正念地面对想法 正念基础练习.MP3" "$DEST/mindfulness-audio/day-17.mp3"
copy_file "$SRC/正念基础练习/18 感受瑜伽中的内心体验 正念基础练习.MP3" "$DEST/mindfulness-audio/day-18.mp3"
copy_file "$SRC/正念基础练习/19 和不适感和平相处 正念础练习.MP3" "$DEST/mindfulness-audio/day-19.mp3"
copy_file "$SRC/正念基础练习/20 总结  身体扫描练习 正念础练习.MP3" "$DEST/mindfulness-audio/day-20.mp3"
copy_file "$SRC/正念基础练习/21 总结 正念综合练习 正念基础练习.MP3" "$DEST/mindfulness-audio/day-21.mp3"
copy_file "$SRC/正念基础练习/22 日常练习 正念呼吸 正念基练习.MP3" "$DEST/mindfulness-audio/day-22.mp3"
copy_file "$SRC/正念基础练习/23 日常练习 身体扫描 正念基练习.MP3" "$DEST/mindfulness-audio/day-23.mp3"
copy_file "$SRC/正念基础练习/24 日常练习 正念行走 正念基础练习.MP3" "$DEST/mindfulness-audio/day-24.mp3"
copy_file "$SRC/正念基础练习/25 日常练习  情绪共处 正念基础练习.MP3" "$DEST/mindfulness-audio/day-25.mp3"
copy_file "$SRC/正念基础练习/26 我的初心与承诺 我的初心与承诺.MP3" "$DEST/mindfulness-audio/day-26.mp3"
copy_file "$SRC/正念基础练习/27 情小锦囊 正念练习.MP3" "$DEST/mindfulness-audio/day-27.mp3"

echo "=== 复制书写练习 PDF ==="
for i in $(seq 1 25); do
  copy_file "$SRC/阅读书写练习/第${i}天.pdf" "$(printf "$DEST/worksheets/day-%02d.pdf" $i)"
done

echo ""
echo "=== 文件统计 ==="
echo "阅读音频: $(ls -1 "$DEST/reading-audio" 2>/dev/null | wc -l | tr -d ' ') 个"
echo "正念音频: $(ls -1 "$DEST/mindfulness-audio" 2>/dev/null | wc -l | tr -d ' ') 个"
echo "书写练习: $(ls -1 "$DEST/worksheets" 2>/dev/null | wc -l | tr -d ' ') 个"
echo ""
echo "=== 完成 ==="