# 开发者如何稳定使用 Claude Code / ChatGPT — Tailscale 全平台配置实战

**作者：缪东旭（MiaoDX）| 直觉机器漫谈**

---

这不是一篇理论文章。这是我在实际使用 Claude Code、ChatGPT API 过程中，踩坑后沉淀下来的配置手册。所有命令都经过验证，所有坑都是真实遇到的。

---

## 一、问题是什么

Claude Code、ChatGPT、GitHub Copilot、Cursor —— 这些 AI 开发工具已经是很多人的日常生产力。但在国内使用它们时，**连接稳定性**是个绕不开的问题：

- 终端里 Claude Code 跑到一半断了
- API 调用超时
- 或者干脆连不上

我的解决方案是 **Tailscale** —— 一个基于 WireGuard 的 mesh VPN。它不需要你理解复杂的网络拓扑，装上就能用，全平台支持。

---

## 二、整体架构

### 架构图

```
┌─────────────────────────────────────────────────────┐
│                 Tailscale Network                    │
│                                                     │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐      │
│  │ Mac 电脑  │    │ Linux    │    │ iPhone / │      │
│  │          │    │ 工作站   │    │ Android  │      │
│  └────┬─────┘    └────┬─────┘    └────┬─────┘      │
│       │               │               │             │
│       └───────────────┼───────────────┘             │
│                       │                             │
│               ┌───────▼────────┐                    │
│               │ GCP 新加坡 VPS  │                    │
│               │ (Exit Node)    │                    │
│               └───────┬────────┘                    │
│                       │                             │
└───────────────────────┼─────────────────────────────┘
                        │
                        ▼
              Claude / ChatGPT / GitHub
```

### 流量路径对比

```
❌ 无 Tailscale（直连，不稳定）
你的设备 ──(可能超时/被墙)──▶ Claude API

✅ 全局模式（Exit Node）
你的设备 ══WireGuard══▶ GCP VPS ──▶ Claude API
       加密隧道，80-90ms延迟

✅ 仅终端模式（SOCKS5 代理）
终端进程 ──socks5──▶ Tailscale ──▶ GCP VPS ──▶ Claude API
其他应用     ──▶ 本地网络（不受影响）
```

### 核心概念

| 概念 | 说明 |
|------|------|
| **tailnet** | 你的私有网络，所有装了 Tailscale 的设备自动组网 |
| **exit node** | 流量出口节点，你海外的 VPS 充当这个角色 |
| **split tunneling** | 让部分流量走 VPS、部分走本地网络 |

---

## 三、服务端配置：GCP 新加坡 VPS

### 为什么选 GCP 新加坡

- 离中国大陆近，延迟相对低
- 实测 ping 延迟大约 **80-90ms**，偶尔波动到 200ms
- 日常开发完全够用
- GCP 对带宽比较慷慨，不会动不动限流

### 费用

| 项目 | 费用 |
|------|------|
| GCP e2-micro（新加坡） | ~$7-8/月 |
| GCP e2-micro（美国免费区） | 免费（延迟 150-200ms） |
| Tailscale 个人版 | 免费（100 台设备 / 3 个用户） |
| GCP 新用户试用额度 | $300 / 90 天 |

> 💡 GCP Always Free 额度包含一台 e2-micro，但**仅限美国区域**（us-west1 / us-central1 / us-east1）。如果你不介意延迟稍高，选美国区可以零成本。

### 步骤

#### 1. 创建 VM

在 GCP Console → Compute Engine → Create Instance:

- **区域**: `asia-southeast1` (Singapore)
- **机型**: `e2-micro`
- **系统**: Ubuntu 24.04 LTS
- **磁盘**: 10GB Standard persistent disk
- **防火墙**: 允许 HTTP/HTTPS（可选）

#### 2. 安装 Tailscale 并配置 exit node

SSH 到你的 VPS 后执行：

```bash
# 安装 Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# 启动并注册为 exit node
sudo tailscale up --advertise-exit-node
```

终端会输出一个 URL，在浏览器里打开、登录你的 Tailscale 账号完成认证。

#### 3. 在 Admin Console 里批准 exit node

1. 打开 https://login.tailscale.com/admin
2. → Machines → 找到你的 VPS
3. → 点击菜单 → Edit route settings
4. → 勾选 **"Use as exit node"** → Save

#### 4. 开启 IP 转发

```bash
# 编辑 sysctl 配置
echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.d/99-tailscale.conf
echo 'net.ipv6.conf.all.forwarding = 1' | sudo tee -a /etc/sysctl.d/99-tailscale.conf
sudo sysctl -p /etc/sysctl.d/99-tailscale.conf
```

服务端就绑完了。一共四步，五分钟的事。

---

## 四、客户端配置：全平台

### macOS

从 [Mac App Store](https://apps.apple.com/app/tailscale/id1475387142) 或 [tailscale.com/download](https://tailscale.com/download) 下载安装。

1. 点击菜单栏图标登录
2. 菜单栏 → Tailscale 图标 → Exit Node → 选择你的 GCP VPS
3. 完成。所有流量现在通过新加坡出去。

### Linux (Ubuntu / Debian)

这是开发主力机，也是坑最多的平台（经验之谈）。

```bash
# 安装
curl -fsSL https://tailscale.com/install.sh | sh

# 启动并指定 exit node（替换为你 VPS 的 Tailscale IP）
sudo tailscale up --exit-node=<你的VPS的TailscaleIP> --exit-node-allow-lan-access=true
```

> ⚠️ `--exit-node-allow-lan-access=true` 很重要 —— 它让局域网流量不走 VPS，否则你连打印机都连不上。

查看你的 VPS Tailscale IP：在 admin console 的 Machines 页面可以看到，通常是 `100.x.x.x` 的地址。

#### 可能遇到的坑 — DNS 报错

```
Health check: Tailscale failed to set the DNS configuration:
running /usr/sbin/resolvconf ... Failed to resolve interface "tailscale"
```

解决方案：

```bash
# 方案 A：如果用 systemd-resolved（大多数现代 Ubuntu）
sudo systemctl restart systemd-resolved
sudo systemctl restart tailscaled

# 方案 B：如果不需要 Tailscale 管 DNS（最省事）
sudo tailscale set --accept-dns=false
```

### iOS

App Store 搜 Tailscale → 安装 → 登录 → 设置 → Exit Node → 选你的 VPS。一步到位。

### Android

Google Play 搜 Tailscale → 安装 → 登录 → 选择 Exit Node。Android 8.0 及以上支持。

> 💡 Android 有个额外能力：原生支持 **app 级别的 VPN 分流**。在 Tailscale 设置里，你可以选择只让特定 app（比如 ChatGPT、浏览器）走 Tailscale，其他 app 走本地网络。这是 Android 独有的，其他平台目前做不到。

---

## 五、两种使用模式

### 模式一：全局模式（推荐新手）

所有流量都走 exit node。配置最简单，一条命令搞定：

```bash
sudo tailscale up --exit-node=<VPS_IP> --exit-node-allow-lan-access=true
```

手机上就是在 Tailscale 里选一下 exit node。

**适合**：个人电脑、手机、不需要分流的场景。

### 模式二：仅终端模式（适合只用 Claude Code 的场景）

很多人的需求是：**只有 Claude Code 要走外网**，浏览器和其他应用走原来的网络。

**核心思路**：不开全局 exit node。只用 Tailscale 的内网组网能力把你的电脑和 VPS 连通，在 VPS 上跑一个 SOCKS5 代理，终端通过环境变量直接指向 VPS 的 Tailscale 内网 IP。干净、不侵入系统网络。

#### 第一步：在 VPS 上装一个轻量 SOCKS5 代理

用 **dante-server**（也叫 danted），一个成熟的 SOCKS5 实现：

```bash
# VPS 上执行
sudo apt install dante-server -y
```

编辑配置文件 `/etc/danted.conf`：

```conf
# 监听 Tailscale 内网接口，只有 tailnet 内的设备能访问
internal: tailscale0 port = 1080
external: eth0

# 不需要认证（因为只有 tailnet 内部能访问，已经足够安全）
socksmethod: none
clientmethod: none

client pass {
    from: 100.64.0.0/10 to: 0.0.0.0/0   # 只允许 Tailscale 网段
}

socks pass {
    from: 100.64.0.0/10 to: 0.0.0.0/0
}
```

启动：

```bash
sudo systemctl enable danted
sudo systemctl start danted
```

这个代理监听在 VPS 的 Tailscale 接口上（`tailscale0`），只有你 tailnet 里的设备能连，公网完全不可见。

#### 第二步：本地终端设置环境变量

```bash
# 假设你的 VPS Tailscale IP 是 100.69.90.25
export ALL_PROXY=socks5://100.69.90.25:1080
export HTTP_PROXY=socks5://100.69.90.25:1080
export HTTPS_PROXY=socks5://100.69.90.25:1080

# 验证
curl -I https://api.anthropic.com
```

只有设了环境变量的终端窗口走代理，其他终端和应用完全不受影响。不需要开 exit node，不需要改系统路由，不需要维护 SSH session。

#### 进阶：写个 alias 一键切换

```bash
# 加到你的 ~/.bashrc 或 ~/.zshrc（替换为你的 VPS Tailscale IP）
alias proxy-on='export ALL_PROXY=socks5://100.69.90.25:1080 HTTP_PROXY=socks5://100.69.90.25:1080 HTTPS_PROXY=socks5://100.69.90.25:1080 && echo "Proxy ON"'
alias proxy-off='unset ALL_PROXY HTTP_PROXY HTTPS_PROXY && echo "Proxy OFF"'
```

之后在任何终端里，`proxy-on` 开启，`proxy-off` 关闭。干净利落。

#### 为什么这比 SSH 隧道更好？

| 对比 | SSH 隧道 | Tailscale + danted |
|------|----------|-------------------|
| 加密 | SSH 加密 | WireGuard 加密 |
| 稳定性 | SSH session 断了要重连 | Tailscale 自动维护连接 |
| 开机自启 | ❌ 需要手动 | ✅ systemd 管理 |
| 配置复杂度 | 中等 | 一次配置，永久有效 |
| 资源占用 | 每个 session 占端口 | 单一 SOCKS5 端口 |

整个链路就是：**终端 → Tailscale 加密隧道 → VPS 上的 SOCKS5 → 出去**。

---

## 六、Split DNS：公司内网场景

> 这是个进阶话题，简单提一下。

如果你在公司办公，开了 Tailscale 后内网服务（Jira、GitLab、内部 API 等）可能会挂 —— 因为 DNS 请求也被转发到了 VPS。

**解决思路**：在 Tailscale Admin Console → DNS 页面，添加 Split DNS 规则：

| 设置项 | 值 |
|--------|-----|
| Nameserver | `10.231.182.8`（你公司的内网 DNS） |
| Restrict to domain | `company.internal` |
| Use with exit node | **ON**（关键！不开这个，用 exit node 时规则不生效） |

> 💡 如果你公司内网域名很多，每个都配一遍挺烦的。实际经验是这条路不太稳定 —— 你可能还需要手动添加路由规则让内网 IP 段走本地网关。如果场景比较复杂，建议直接用上面的「仅终端模式」，不动全局网络。

---

## 七、常见问题

**Q: 速度怎么样？**

实测新加坡节点，ping 延迟 80-90ms 常见，偶尔飙到 200ms。跑 Claude Code 完全没问题 —— API 调用本身就不是实时音视频，这个延迟感知不明显。

**Q: Tailscale 免费版够用吗？**

够。Personal 计划免费，100 台设备、3 个用户。个人开发者用不完。

**Q: GCP 免费额度能用吗？**

GCP 的 Always Free 包含一台 e2-micro，但仅限美国区域。如果选新加坡，大约 $7-8/月。首次注册 GCP 还有 $300 / 90 天的试用额度。

**Q: Key 过期了怎么办？**

Tailscale 的 auth key 默认 90 天过期，到期后设备会断开。去 admin console 重新认证就行。或者在 admin console 里关闭 key expiry（Machines → 你的设备 → Disable key expiry），适合长期运行的 VPS。

**Q: 安全吗？**

Tailscale 用的是 WireGuard 加密，端到端加密，Tailscale 服务器本身看不到你的流量内容。但你的 exit node VPS 能看到解密后的流量（跟所有代理方案一样），所以**一定要用自己的 VPS**，不要用别人提供的 exit node。

**Q: 为什么不直接用 VPN？**

| 对比 | 传统 VPN | Tailscale |
|------|----------|-----------|
| 配置复杂度 | 高（证书、路由、防火墙） | 低（装上登录就行） |
| 全平台支持 | 部分 | 全部 |
| mesh 网络 | ❌ | ✅ 设备间直连 |
| 内网穿透 | 需要额外配置 | 自动 |
| 免费方案 | 很少 | 个人版免费 |

---

## 八、配置清单 Checklist

```
□ GCP 账号注册 + 绑定支付方式
□ 创建 e2-micro VM（新加坡 / 或美国免费区）
□ VPS 上安装 Tailscale + advertise-exit-node
□ Admin Console 批准 exit node
□ VPS 开启 IP 转发
□ 本地设备安装 Tailscale + 登录
□ 选择使用模式：
  □ 全局模式：tailscale up --exit-node=... --exit-node-allow-lan-access=true
  □ 仅终端：VPS 装 danted + 环境变量指向 VPS Tailscale IP
□ 验证：curl https://api.anthropic.com 能通
□ （可选）VPS 关闭 key expiry
```

---

## 写在最后

整套配置从零开始大概 30 分钟。之后就是一个 `tailscale up` 或 `proxy-on` 的事。

工具是为了让你专注于真正重要的事 —— 写代码、做项目、解决问题。网络不应该是阻碍你使用 AI 工具的瓶颈。

如果你在配置过程中遇到问题，欢迎在评论区交流。[Tailscale 的文档](https://tailscale.com/docs) 写得很好，遇到具体问题直接搜通常都能找到答案。

---

*本文基于 2026 年 3 月的实际使用经验。Tailscale 和 GCP 的产品可能会更新，请以官方文档为准。*
