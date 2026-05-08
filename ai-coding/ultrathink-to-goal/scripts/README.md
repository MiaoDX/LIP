# 截图工作流

为 lecture 准备引用截图的小工具集合。

## 文件

- `fetch-screenshots.py` — Python 主脚本,支持 X tweet / 通用网页 / YouTube thumbnail 三种 source
- `screenshot-manifest.json` — 当前 lecture 已用到的截图清单,可作为批量任务驱动
- `youtube-frame-extract.sh` — YouTube 视频内时间点截图(本地跑,sandbox 内 yt-dlp 被 reCAPTCHA 拦)

## 单条调用

```bash
# X / Twitter(article-only crop,适合 slide)
python3 fetch-screenshots.py tweet \
    https://x.com/gdb/status/2050194039077495089 \
    tweet_brockman_ralphloop.png

# 通用网页截图
python3 fetch-screenshots.py page \
    https://www.endorlabs.com/research/ai-code-security-benchmark \
    endorlabs_leaderboard.png 1280 1600

# YouTube 缩略图(直拉 i.ytimg.com,无需 auth)
python3 fetch-screenshots.py yt-thumb kwSVtQ7dziU karpathy_nopriors.jpg
```

## 批量调用

```bash
python3 fetch-screenshots.py manifest screenshot-manifest.json
```

## YouTube 视频内时间点截图(本地用)

```bash
# 在本地工作站上(有 yt-dlp + cookies)
export COOKIES_FILE=~/yt-cookies.txt  # 可选
./youtube-frame-extract.sh kwSVtQ7dziU "0,372" karpathy_nopriors

# 输出:
#   karpathy_nopriors_t0.png    (00:00:00)
#   karpathy_nopriors_t372.png  (00:06:12)
```

## 已知限制(sandbox / CI 环境)

| 操作 | 状态 | 说明 |
|---|---|---|
| X tweet 截图 | ✅ | avatars 是灰色占位(未登录限制),其他完整 |
| 通用网页截图 | ✅ | 无需 auth 的页面均可 |
| YouTube thumbnail | ✅ | i.ytimg.com 直拉,公开静态资源 |
| YouTube 视频帧 | ❌ | reCAPTCHA / 数据中心 IP bot 检测;在本地工作站正常 |
| Spotify embed | ❓ | 未测试;预期与 YouTube 类似 |

## 依赖

```bash
pip install playwright yt-dlp
python3 -m playwright install chromium
# ffmpeg 系统包(用于视频帧抽取)
```

如果环境已预装 puppeteer Chrome(比如 Anthropic sandbox),可以跳过 `playwright install`,
直接设置 `CHROME_PATH` 指向已有的 chrome binary。

## CI 集成思路

一个简单的 routine 拓展方式:

1. 把 `screenshot-manifest.json` 当作单一 source of truth(谁加引用,谁加一行)
2. CI(或 daily routine)跑 `python3 fetch-screenshots.py manifest screenshot-manifest.json`
3. 检查输出和 git diff,有变化就提 PR(图源页面更新时也能自动 catch)

这样 lecture 准备过程中如果有新引语/新数据,只需要往 manifest 加一行,
其余由 routine 自己解。和公众号文章 002 里的那套 routine 流程契合。
