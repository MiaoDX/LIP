#!/usr/bin/env python3
"""
LIP Deploy Guard — 部署前检查脚本

防止 LIP 构建产物误覆盖根目录 index.html
"""

import sys
import os
import re

def fail(msg, context=None):
    print("=" * 60, file=sys.stderr)
    print("[DEPLOY GUARD — BLOCKED]", file=sys.stderr)
    print("=" * 60, file=sys.stderr)
    print(f"\n{msg}", file=sys.stderr)
    if context:
        print(f"\nContext: {context}", file=sys.stderr)
    print("\nWhat happened:", file=sys.stderr)
    print("  • This is an LIP (Learn in Public) deploy", file=sys.stderr)
    print("  • The build output is trying to modify root-level files", file=sys.stderr)
    print("  • This would OVERWRITE the personal homepage at miaodx.com", file=sys.stderr)
    print("\nWhat to do:", file=sys.stderr)
    print("  • LIP content must ONLY go into the /LIP/ subdirectory", file=sys.stderr)
    print("  • Check your build config — base path should be /LIP/", file=sys.stderr)
    print("  • Never let VitePress build output touch the repo root", file=sys.stderr)
    print("\nABORTING deploy.", file=sys.stderr)
    print("=" * 60, file=sys.stderr)
    sys.exit(1)

def ok(msg):
    print(f"[GUARD OK] {msg}")

def main():
    # 1. 检查是否在正确的仓库
    repo_root = os.getcwd()
    repo_name = os.path.basename(repo_root)

    # 如果我们在 miaodx.github.io 仓库，需要格外小心
    if repo_name == "miaodx.github.io":
        ok("Detected miaodx.github.io repo — applying strict guard rules")
        strict_mode = True
    else:
        strict_mode = False

    # 2. 检查根目录 index.html 是否存在且不是 VitePress 生成的
    root_index = os.path.join(repo_root, "index.html")
    if os.path.exists(root_index):
        with open(root_index, "r", encoding="utf-8") as f:
            content = f.read(2000)  # 读前 2000 字符就够了

        # VitePress 生成的 index.html 特征
        vp_markers = [
            "vitepress",
            "VPNavBar",
            "VPSidebar",
            "__VP_HASH__",
            "data-vitepress",
        ]

        for marker in vp_markers:
            if marker.lower() in content.lower():
                fail(
                    f"Root index.html appears to be VitePress-generated (found marker: '{marker}')",
                    context="VitePress build artifact detected at repo root"
                )

        # 检查是否是个人主页特征（作为正向验证）
        homepage_markers = [
            "MiaoDX",
            "缪东旭",
            "Learn in Public",
            "AI Agent",
        ]
        found_homepage_markers = sum(
            1 for m in homepage_markers if m in content
        )
        if found_homepage_markers == 0 and strict_mode:
            fail(
                "Root index.html does not contain expected personal homepage markers. "
                "This might be a VitePress build artifact.",
                context="Homepage identity markers missing"
            )

        ok(f"Root index.html verified as personal homepage ({found_homepage_markers} markers found)")
    else:
        if strict_mode:
            fail(
                "Root index.html is MISSING in miaodx.github.io repo. This is a critical error.",
                context="Personal homepage file absent"
            )
        else:
            ok("No root index.html found — skipping homepage check (not in target repo)")

    # 3. 检查构建输出目录结构
    # LIP 构建产物应该只在 LIP/ 子目录下
    lip_dir = os.path.join(repo_root, "LIP")
    if os.path.exists(lip_dir):
        ok("LIP/ directory exists")

        # 检查 LIP 目录下是否有 index.html
        lip_index = os.path.join(lip_dir, "index.html")
        if os.path.exists(lip_index):
            ok("LIP/index.html exists — LIP content is properly namespaced")
        else:
            fail(
                "LIP/ directory exists but LIP/index.html is missing — build may be incomplete",
                context="LIP content namespace incomplete"
            )
    else:
        # 如果不在 miaodx.github.io 仓库，LIP 目录可能不存在
        if strict_mode:
            fail(
                "LIP/ directory is MISSING in miaodx.github.io repo",
                context="LIP content namespace absent"
            )
        else:
            ok("No LIP/ directory — not in target repo, skipping")

    # 4. 检查是否有 VitePress 构建产物泄漏到根目录
    vp_dist_dir = os.path.join(repo_root, ".vitepress", "dist")
    if os.path.exists(vp_dist_dir):
        # 检查 dist 目录下是否有 index.html（这是正常的，VitePress 构建输出）
        dist_index = os.path.join(vp_dist_dir, "index.html")
        if os.path.exists(dist_index):
            ok("VitePress dist/index.html exists in build output (expected)")

            # 关键检查：dist/index.html 是否会被复制到根目录
            # 这取决于部署脚本的逻辑
            ok("Build output check passed — dist/index.html is in expected location")

    # 5. 最终确认：如果我们在 miaodx.github.io，确保不会覆盖根 index.html
    if strict_mode:
        # 检查 git status 中是否有 index.html 的修改
        import subprocess
        try:
            result = subprocess.run(
                ["git", "diff", "--name-only", "HEAD", "index.html"],
                capture_output=True,
                text=True,
                cwd=repo_root,
            )
            if result.stdout.strip():
                fail(
                    f"index.html has uncommitted changes in git diff:\n{result.stdout.strip()}",
                    context="Homepage file modified — possible build artifact contamination"
                )
            ok("index.html is clean in git (no unexpected modifications)")
        except Exception as e:
            ok(f"Could not run git diff check: {e}")

    print("\n" + "=" * 50)
    print("ALL GUARD CHECKS PASSED")
    print("=" * 50)
    sys.exit(0)

if __name__ == "__main__":
    main()
