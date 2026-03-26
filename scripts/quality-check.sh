#!/bin/bash
# 文章质量检查脚本
# 定期扫描 lessons/ 和 drafts/ 目录，评估文章质量

LIP_DIR="${1:-/data/workspace/LIP}"
LESSONS_DIR="$LIP_DIR/lessons"
DRAFTS_DIR="$LIP_DIR/drafts"
REPORT_FILE="$LIP_DIR/.quality-report.md"

# 生成报告
echo "# 文章质量检查报告" > "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "生成时间: $(date '+%Y-%m-%d %H:%M:%S')" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# 统计
total_lessons=$(find "$LESSONS_DIR" -maxdepth 1 -name "*.md" | wc -l)
total_drafts=$(find "$DRAFTS_DIR/lessons" -name "*.md" 2>/dev/null | wc -l)

echo "## 统计" >> "$REPORT_FILE"
echo "- Lessons 文章数: $total_lessons" >> "$REPORT_FILE"
echo "- Drafts 文章数: $total_drafts" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# 评估函数
evaluate_article() {
    local file=$1
    local word_count=$(wc -w < "$file")
    local has_headers=$(grep -c "^##" "$file" 2>/dev/null | head -1 || echo "0")
    local has_code=$(grep -c "^\`\`\`" "$file" 2>/dev/null | head -1 || echo "0")
    local has_checklist=$(grep -c "\- \[" "$file" 2>/dev/null | head -1 || echo "0")
    
    # 评分
    local score=0
    [ "$word_count" -gt 300 ] && ((score+=2))
    [ "$word_count" -gt 800 ] && ((score+=1))
    [ "$has_headers" -ge 2 ] && ((score+=2))
    [ "$has_code" -ge 2 ] && ((score+=1))
    [ "$has_checklist" -ge 1 ] && ((score+=1))
    
    # 评级
    local grade
    if [ "$score" -ge 6 ]; then grade="A"
    elif [ "$score" -ge 4 ]; then grade="B"
    elif [ "$score" -ge 2 ]; then grade="C"
    else grade="D"; fi
    
    echo "| $(basename "$file" .md) | $word_count | $has_headers | $has_code | $has_checklist | $score/7 | $grade |"
}

# 检查 Lessons
echo "## Lessons 目录评估" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "| 文章 | 字数 | 标题 | 代码块 | 清单 | 评分 | 等级 |" >> "$REPORT_FILE"
echo "|------|------|------|--------|------|--------|------|" >> "$REPORT_FILE"
for file in "$LESSONS_DIR"/*.md; do
    [ -f "$file" ] && [[ "$(basename "$file")" != "index.md" ]] && [[ "$(basename "$file")" != ".quality-report.md" ]] && evaluate_article "$file" >> "$REPORT_FILE"
done
echo "" >> "$REPORT_FILE"

# 检查 Drafts
if [ -d "$DRAFTS_DIR/lessons" ] && [ "$total_drafts" -gt 0 ]; then
    echo "## Drafts 目录评估" >> "$REPORT_FILE"
    echo "" >> "$REPORT_FILE"
    echo "| 文章 | 字数 | 标题 | 代码块 | 清单 | 评分 | 等级 |" >> "$REPORT_FILE"
    echo "|------|------|------|--------|------|--------|------|" >> "$REPORT_FILE"
    for file in "$DRAFTS_DIR/lessons"/*.md; do
        [ -f "$file" ] && evaluate_article "$file" >> "$REPORT_FILE"
    done
    echo "" >> "$REPORT_FILE"
fi

# 建议
echo "## 建议" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "- 等级 A/B: 保留在 Lessons" >> "$REPORT_FILE"
echo "- 等级 C: 考虑移入 Drafts 待完善" >> "$REPORT_FILE"
echo "- 等级 D: 考虑删除或重写" >> "$REPORT_FILE"

echo "报告已生成: $REPORT_FILE"
