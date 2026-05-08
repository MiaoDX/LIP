#!/usr/bin/env bash
# YouTube 视频内时间点截图 helper
#
# 在 sandbox / CI 里 yt-dlp 通常会被 YouTube reCAPTCHA 拦,
# 这个脚本设计在本地工作站上跑(或装了 yt-dlp + 浏览器 cookies 的环境)。
#
# Usage:
#   ./youtube-frame-extract.sh <video-url-or-id> <timestamps-comma-separated> <out-prefix>
#
# Example:
#   ./youtube-frame-extract.sh kwSVtQ7dziU "0,372" karpathy_nopriors
#   # → karpathy_nopriors_t0.png   (00:00:00, 钩子开场)
#   # → karpathy_nopriors_t372.png (00:06:12, "I'm the binding constraint")
#
# 时间戳以秒计;在 outline 0 节和 0.5 节都引用了 podcast 的具体时间点,这个脚本能精确截到。
#
# Requires: yt-dlp, ffmpeg
#
# 如果遇到 "Sign in to confirm you're not a bot",可以:
#   1. 在浏览器登录 youtube,导出 cookies(Get cookies.txt 之类的扩展)
#   2. 用 --cookies cookies.txt 调 yt-dlp
#   3. 或者从已下载的本地 mp4 跳过 yt-dlp 这一步

set -euo pipefail

if [[ $# -lt 3 ]]; then
    echo "Usage: $0 <video-url-or-id> <timestamps-csv> <out-prefix>"
    echo "Example: $0 kwSVtQ7dziU '0,372' karpathy_nopriors"
    exit 1
fi

URL_OR_ID="$1"
TIMESTAMPS="$2"
OUT_PREFIX="$3"
TMPDIR="${TMPDIR:-/tmp}/yt-extract-$$"
mkdir -p "$TMPDIR"
trap 'rm -rf "$TMPDIR"' EXIT

# 处理 URL or video ID
if [[ "$URL_OR_ID" =~ ^https?:// ]]; then
    URL="$URL_OR_ID"
else
    URL="https://www.youtube.com/watch?v=$URL_OR_ID"
fi

# 下载最低分辨率的视频(360p 足够截单帧)
echo "Downloading $URL ..."
COOKIES_ARG=""
if [[ -f "${COOKIES_FILE:-}" ]]; then
    COOKIES_ARG="--cookies $COOKIES_FILE"
fi
yt-dlp $COOKIES_ARG \
    -f 'worst[height>=360]/worst' \
    -o "$TMPDIR/video.%(ext)s" \
    "$URL"

VIDEO_FILE=$(ls "$TMPDIR"/video.* | head -1)
echo "Got: $VIDEO_FILE"

# 拆 timestamps 然后用 ffmpeg 截每一帧
IFS=',' read -ra STAMPS <<< "$TIMESTAMPS"
for ts in "${STAMPS[@]}"; do
    out="${OUT_PREFIX}_t${ts}.png"
    ffmpeg -y -loglevel error \
        -ss "$ts" \
        -i "$VIDEO_FILE" \
        -vframes 1 \
        "$out"
    echo "Saved: $out (timestamp ${ts}s)"
done

echo "Done."
