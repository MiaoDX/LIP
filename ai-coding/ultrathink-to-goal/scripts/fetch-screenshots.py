#!/usr/bin/env python3
"""
为 lecture 准备截图的 helper 脚本。

支持 3 种 source:
1. X / Twitter 公开帖(自动 crop 成 article-only)
2. 任意 URL 网页截图(viewport 截屏)
3. YouTube thumbnail(直接拉 i.ytimg.com)

不支持(在 sandbox 内尝试失败):
- YouTube 视频内时间点截图(reCAPTCHA / bot detection 拦)
- Spotify 视频播放截图(同上)
- 任何需要登录的页面

Usage:
    python3 fetch-screenshots.py <command> [args...]

Commands:
    tweet <tweet-url> <out-name>            # X/Twitter article-only crop
    page <url> <out-name> [width] [height]  # 通用页面截图
    yt-thumb <video-id> <out-name>          # YouTube maxres thumbnail

Examples:
    python3 fetch-screenshots.py tweet \\
        https://x.com/gdb/status/2050194039077495089 \\
        tweet_brockman_ralphloop.png

    python3 fetch-screenshots.py page \\
        https://www.endorlabs.com/research/ai-code-security-benchmark \\
        endorlabs_leaderboard.png 1280 1600

    python3 fetch-screenshots.py yt-thumb kwSVtQ7dziU karpathy_nopriors.jpg

环境要求:
    pip install playwright
    python3 -m playwright install chromium
    
    或如果 sandbox/CI 环境已预装 puppeteer Chrome,设置 CHROME_PATH 环境变量指向 binary。

输出目录:
    默认 ./screenshots/。可用 OUT_DIR 环境变量覆盖。
"""
from __future__ import annotations

import os
import sys
import urllib.request
from pathlib import Path

OUT_DIR = Path(os.environ.get("OUT_DIR", "./screenshots"))
CHROME_PATH = os.environ.get(
    "CHROME_PATH",
    "/home/claude/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome",
)
UA = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
)


def _launch_browser(playwright):
    """Use cached chrome if present (sandbox), else fall back to playwright bundled."""
    args = ["--no-sandbox"]
    if Path(CHROME_PATH).exists():
        return playwright.chromium.launch(executable_path=CHROME_PATH, headless=True, args=args)
    return playwright.chromium.launch(headless=True, args=args)


def screenshot_tweet(url: str, out_name: str) -> Path:
    """X/Twitter — locate the article element, crop to it.

    Note: avatars render as gray placeholders unless logged in. This is fine
    for slide use (the tweet text, verified badge, quote tweet, and engagement
    counts all render correctly).
    """
    from playwright.sync_api import sync_playwright

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out = OUT_DIR / out_name

    with sync_playwright() as p:
        browser = _launch_browser(p)
        # 660px viewport 让右侧 "New to X?" 栏自动隐藏
        ctx = browser.new_context(viewport={"width": 660, "height": 1400}, user_agent=UA)
        page = ctx.new_page()
        page.goto(url, wait_until="domcontentloaded", timeout=25000)
        page.wait_for_timeout(5000)
        try:
            article = page.locator("article").first
            article.screenshot(path=str(out))
            print(f"[ok] tweet → {out}")
        except Exception as e:
            page.screenshot(path=str(out), full_page=False)
            print(f"[fallback] article locator failed ({e}), saved viewport: {out}")
        browser.close()
    return out


def screenshot_page(url: str, out_name: str, width: int = 1280, height: int = 1600) -> Path:
    """Generic page screenshot at specified viewport."""
    from playwright.sync_api import sync_playwright

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out = OUT_DIR / out_name

    with sync_playwright() as p:
        browser = _launch_browser(p)
        ctx = browser.new_context(viewport={"width": width, "height": height}, user_agent=UA)
        page = ctx.new_page()
        page.goto(url, wait_until="domcontentloaded", timeout=25000)
        page.wait_for_timeout(3000)
        page.screenshot(path=str(out), full_page=False)
        browser.close()
    print(f"[ok] page → {out}")
    return out


def fetch_youtube_thumbnail(video_id: str, out_name: str) -> Path:
    """Pull maxresdefault.jpg directly from i.ytimg.com (public, no auth)."""
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out = OUT_DIR / out_name
    url = f"https://i.ytimg.com/vi/{video_id}/maxresdefault.jpg"
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=20) as resp:
        out.write_bytes(resp.read())
    print(f"[ok] yt-thumb → {out}")
    return out


# ---------------------------------------------------------------------------
# Helper for batching: a manifest-driven runner
# ---------------------------------------------------------------------------

def run_manifest(manifest_path: str) -> None:
    """Run a list of jobs from a TOML or JSON manifest.

    Manifest schema (JSON):
        [
          {"kind": "tweet", "url": "...", "name": "..."},
          {"kind": "page",  "url": "...", "name": "...", "width": 1280, "height": 1600},
          {"kind": "yt-thumb", "id": "kwSVtQ7dziU", "name": "..."}
        ]
    """
    import json
    with open(manifest_path) as f:
        jobs = json.load(f)
    for job in jobs:
        kind = job["kind"]
        try:
            if kind == "tweet":
                screenshot_tweet(job["url"], job["name"])
            elif kind == "page":
                screenshot_page(
                    job["url"], job["name"],
                    job.get("width", 1280), job.get("height", 1600),
                )
            elif kind == "yt-thumb":
                fetch_youtube_thumbnail(job["id"], job["name"])
            else:
                print(f"[skip] unknown kind: {kind}")
        except Exception as e:
            print(f"[fail] {job.get('name', '?')}: {e}")


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print(__doc__)
        return 1
    cmd = argv[1]
    if cmd == "tweet" and len(argv) == 4:
        screenshot_tweet(argv[2], argv[3])
    elif cmd == "page" and len(argv) >= 4:
        w = int(argv[4]) if len(argv) > 4 else 1280
        h = int(argv[5]) if len(argv) > 5 else 1600
        screenshot_page(argv[2], argv[3], w, h)
    elif cmd == "yt-thumb" and len(argv) == 4:
        fetch_youtube_thumbnail(argv[2], argv[3])
    elif cmd == "manifest" and len(argv) == 3:
        run_manifest(argv[2])
    else:
        print(__doc__)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
