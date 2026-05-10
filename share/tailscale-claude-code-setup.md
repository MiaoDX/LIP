---
marp: true
---

# 开发者如何稳定使用 Claude Code / ChatGPT — Tailscale 全平台配置实战

**作者：缪东旭（MiaoDX）| 直觉机器漫谈**

---

这不是一篇理论文章。这是我在实际使用 Claude Code、ChatGPT API 过程中，踩坑后沉淀下来的配置手册。所有命令都经过验证，所有坑都是真实遇到的。

> **2026.05 更新**：
> - 新增 AWS 部署方案（章节 **三 BIS**），现在主推 Tokyo 区域，比 Singapore 还要快 ~20ms 实测。GCP 章节保留。
> - 服务端配置改成 **一组命令复制粘贴到底** 的形态，重复跑也安全，包含已知最佳的性能优化。
> - 新增 **附录**（章节七）：进阶选项与几条值得记下的排错。

---

## 一、问题是什么

Claude Code、ChatGPT、GitHub Copilot、Cursor —— 这些 AI 开发工具已经是很多人的日常生产力。但在国内访问它们时，**连接稳定性**是个绕不开的问题：

- 终端里 Claude Code 跑到一半断了
- API 调用超时
- 或者干脆连不上

我的解决方案是 **Tailscale** —— 一个基于 WireGuard 的 mesh 网络工具。它不需要你理解复杂的网络拓扑，装上就能用，全平台支持，让你的设备和海外的一台小服务器之间建立加密隧道。

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
│               │ Tokyo 或       │                    │
│               │ Singapore VPS  │                    │
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
❌ 直连（不稳定）
你的设备 ──(可能超时)──▶ Claude API

✅ 通过海外节点
你的设备 ══WireGuard 加密隧道══▶ 海外 VPS ──▶ Claude API
                                  实测 65-85ms 延迟
```

### 核心概念

| 概念 | 说明 |
| --- | --- |
| **tailnet** | 你的私有网络，所有装了 Tailscale 的设备自动组网 |
| **exit node** | 流量出口节点，你海外的 VPS 充当这个角色 |
| **split tunneling** | 让部分流量走 VPS、部分走本地网络 |

---

## 三、服务端配置：GCP Tokyo / Singapore VPS

### 为什么选 Tokyo 或 Singapore

- 离中国大陆近，延迟相对低
- **Tokyo 实测约 65-70ms，Singapore 约 85ms**（中国移动接入），Tokyo 更稳一点
- 日常开发完全够用
- GCP 对带宽比较慷慨，不会动不动限流

> 💡 **怎么选**：如果只用 AI 终端工具（Claude Code/ChatGPT API），两个都行；如果你也会跑视频会议或者 latency-sensitive 的场景，选 Tokyo（`asia-northeast1`）。

### 费用

| 项目 | 费用 |
| --- | --- |
| GCP e2-micro（Tokyo / Singapore） | ~$7-8/月 |
| GCP e2-micro（美国免费区） | 免费（延迟 150-200ms） |
| Tailscale 个人版 | 免费（100 台设备 / 3 个用户） |
| GCP 新用户试用额度 | $300 / 90 天 |

> 💡 GCP Always Free 额度包含一台 e2-micro，但**仅限美国区域**（us-west1 / us-central1 / us-east1）。如果你不介意延迟稍高，选美国区可以零成本。

### 步骤

#### 1. 创建 VM

在 GCP Console → Compute Engine → Create Instance:

- **区域**: `asia-northeast1` (Tokyo) 或 `asia-southeast1` (Singapore)
- **机型**: `e2-micro`
- **系统**: Ubuntu 24.04 LTS
- **磁盘**: 12GB Standard persistent disk（默认 10GB 长期会被 apt cache + journal 撑爆，多 2GB 一年才几毛钱）
- **防火墙**: 允许 HTTP/HTTPS（可选）

#### 2. 一键服务端配置

SSH 到你的 VPS 后，**复制粘贴下面整段**到终端。这一段做完所有事：开 IP 转发 → 装 Tailscale → 应用已知最佳的性能优化（GRO） → 启动并 advertise 为 exit node。**重复执行也安全**（重启后再跑、出问题再跑都没事）：

```bash
# === Tailscale 服务端一键配置（重复跑也安全）===

# 1. 开 IP 转发（让本机能转发别人的流量）
echo 'net.ipv4.ip_forward = 1' | sudo tee /etc/sysctl.d/99-tailscale.conf
echo 'net.ipv6.conf.all.forwarding = 1' | sudo tee -a /etc/sysctl.d/99-tailscale.conf
sudo sysctl -p /etc/sysctl.d/99-tailscale.conf

# 2. 装 Tailscale
curl -fsSL https://tailscale.com/install.sh | sh

# 3. UDP GRO 优化（消除一会儿 tailscale up 时会出现的 warning，吞吐量显著提升）
NETDEV=$(ip -o route get 8.8.8.8 | cut -f 5 -d " ")
sudo ethtool -K "$NETDEV" rx-udp-gro-forwarding on rx-gro-list off
sudo tee /etc/networkd-dispatcher/routable.d/50-tailscale-gro >/dev/null <<EOF
#!/bin/sh
ethtool -K $NETDEV rx-udp-gro-forwarding on rx-gro-list off
EOF
sudo chmod +x /etc/networkd-dispatcher/routable.d/50-tailscale-gro

# 4. 启动并注册为 exit node
sudo tailscale up --advertise-exit-node
```

最后一行执行后，终端会输出一个 URL，**在浏览器里打开、登录你的 Tailscale 账号完成认证**。

> 💡 关于 GRO 那一段：Tailscale 1.54+ 内核会建议你打开 `rx-udp-gro-forwarding`，官方 benchmark 显示能让转发吞吐量从 1.3 Gb/s 提到 10.7 Gb/s（接近 10 倍）。t4g.small/e2-micro 当然达不到这种数字，但能把"实例本身的带宽上限"打满。一行命令就做了，没理由不开。原理细节见附录 7.1。

#### 3. 在 Admin Console 里批准 exit node

1. 打开 <https://login.tailscale.com/admin>
2. → Machines → 找到你的 VPS
3. → 点击菜单 → Edit route settings
4. → 勾选 **"Use as exit node"** → Save
5. 顺手再做一件事：点该设备菜单 → **Disable key expiry**（避免 180 天后突然断网，下文 FAQ 详细说）

服务端就配完了。

---

## 三 BIS · 也可以用 AWS Tokyo / Singapore：差别只有两处

GCP 用了一段时间，最近迁到了 AWS，趁机把两边的差别记清楚。结论是：**整套流程几乎一致，AWS 真正需要单独处理的只有两件事**。如果你已经有 AWS 账号、或者想薅 2026 年 t4g.small 免费额度的羊毛，可以选这条路。

### 谁该选哪个？

| 场景 | 建议 |
| --- | --- |
| 想要永久免费、延迟 150-200ms 能接受 | GCP `us-central1` e2-micro Always Free |
| 中国访问、每月可接受 $7-8 | GCP `asia-northeast1` (Tokyo) e2-micro |
| 中国访问、想用 2026 年免费额度 | **AWS `ap-northeast-1` (Tokyo) t4g.small** ←我现在用的 |
| 已有公司账号 / 团队偏好 | 哪个都行，配置都不复杂 |

### 实测延迟对比（中国移动接入）

| 节点 | `tailscale ping` 直连延迟 |
| --- | --- |
| AWS Tokyo (`ap-northeast-1`) | **64-67ms**（最稳） |
| AWS Singapore (`ap-southeast-1`) | 84-87ms |
| GCP Singapore (`asia-southeast1`) | 84-89ms |

Tokyo 比 Singapore 稳定快 ~20ms。如果你的目标 API（Anthropic / OpenAI）服务器在美国西岸，Tokyo 到 us-west 的国际段路由也通常比 Singapore 到 us-west 短。

### 费用对比

| 项目 | GCP | AWS |
| --- | --- | --- |
| 实例 | e2-micro ~$7-8/月 | t4g.small **2026 年内免费**（每月 750h），之后 ~$13/月 |
| 静态 IP（绑定到运行中的实例） | 免费 | 免费<sup>※</sup> |
| 出站带宽（每月免费额度） | 1 GB | **100 GB** |
| 超出后单价 | ~$0.12/GB | ~$0.09-0.12/GB |
| 架构 | x86 | t4g 是 ARM Graviton（原生 ARM 编译省心） |

> ⭐ **2026 重点优惠**：AWS 把 t4g.small 的免费额度延长到了 **2026 年 12 月 31 日**（每个账号每月 750h 免费，新老账号都有，包含 Tokyo 和 Singapore 区域）。一手出处：[AWS T4g 产品页](https://aws.amazon.com/ec2/instance-types/t4/) | [re:Post 公告](https://repost.aws/articles/ARi_gf6vo6TuqNtMQdiYPKyA/announcing-amazon-ec2-t4g-free-trial-extension) | [覆盖区域列表（FAQ）](https://aws.amazon.com/ec2/faqs/#t4g-instances)。
>
> ※ Feb 2024 起 AWS 对所有 public IPv4 都收费 $0.005/h ≈ $3.6/月，但绑到运行中实例的 EIP 仍然免费。

带宽这点值得多说一句：纯 AI 工具用法两边都不会出账。但 AWS 的"100GB/月免费"额度让"全局模式"也敢放心用，不会担心一不小心 macOS 更新走通道把账单刷出来。

### AWS 配置：和 GCP 差别就两件事

下面这两件是 AWS 独有、GCP 没有的：

#### 差别 1：必须关闭 Source/Destination Check

这是 AWS 上做 exit node 最容易踩的坑，文档藏得很深。

AWS 每个 EC2 实例的网卡（ENI）默认会丢弃任何"源 IP 或目标 IP 不是本机"的包。但 exit node 的本质就是**转发别人的流量**，所以必须把这个检查关掉。

**操作**：EC2 Console → Instances → 选实例 → Actions → Networking → **Change source/destination check** → 选 **Stop**。

GCP 那边不需要这个动作。这是从 GCP 迁过来的人最常忽略的点。

> **现象**：如果忘了关，Tailscale 连得上、admin console 显示 exit node 已批准，但客户端切过去之后所有外网请求都超时。在 VPS 上 `tcpdump -i tailscale0` 能看到包进来，就是出不去。

#### 差别 2：用 Elastic IP，否则 stop/start 后 IP 会变

GCP 的 ephemeral IP 在某些情况下会保留；AWS 的 auto-assigned public IP **stop 后再 start 一定会变**（reboot 不会变，只有 stop+start 会）。我亲测过：

- 第一次启动：`13.228.77.99`
- Reboot：`13.228.77.99`（不变）
- Stop + Start：`13.212.71.145`（变了）

如果你用 ChatGPT 或 OpenAI API，IP 频繁变会被风控盯上（即便不被封号，也会多触发验证码）。所以分配一个 Elastic IP 绑定到实例：

**操作**：EC2 Console → Network & Security → Elastic IPs → **Allocate Elastic IP address** → 分配后 Actions → **Associate Elastic IP address** → 选你的实例 → Associate。

### AWS 完整配置流程

```bash
# === 0-2 步在 AWS Console 操作 ===

# 0. 创建实例
#    - Region: ap-northeast-1（Tokyo，更快）或 ap-southeast-1（Singapore）
#    - AMI: Ubuntu 24.04 LTS (ARM64)，owner 099720109477（Canonical 官方）
#    - Instance type: t4g.small（2026 年内免费，2 GiB RAM）
#    - 根盘: 12 GB gp3
#    - Key pair (login): "Proceed without a key pair"
#      （不需要 SSH key —— 后面用 Tailscale + EC2 Instance Connect）
#    - Network settings: 默认安全组允许 SSH from anywhere 即可
#      （没 key pair 攻击者扫到 22 端口也无法登录）

# 1. ★ Disable Source/Destination Check ★
#    EC2 Console → Actions → Networking → Change source/destination check → Stop

# 2. ★ 分配并绑定 Elastic IP ★
#    EC2 Console → Elastic IPs → Allocate → Associate → 选刚创建的实例

# === 3 步用 EC2 Instance Connect 登录后，复制粘贴一段命令 ===

# 3. Console → 选实例 → Connect → "EC2 Instance Connect" tab → Connect
#    然后把下面这一整段复制粘贴到 SSH 终端（重复跑也安全）：

echo 'net.ipv4.ip_forward = 1' | sudo tee /etc/sysctl.d/99-tailscale.conf
echo 'net.ipv6.conf.all.forwarding = 1' | sudo tee -a /etc/sysctl.d/99-tailscale.conf
sudo sysctl -p /etc/sysctl.d/99-tailscale.conf

curl -fsSL https://tailscale.com/install.sh | sh

NETDEV=$(ip -o route get 8.8.8.8 | cut -f 5 -d " ")
sudo ethtool -K "$NETDEV" rx-udp-gro-forwarding on rx-gro-list off
sudo tee /etc/networkd-dispatcher/routable.d/50-tailscale-gro >/dev/null <<EOF
#!/bin/sh
ethtool -K $NETDEV rx-udp-gro-forwarding on rx-gro-list off
EOF
sudo chmod +x /etc/networkd-dispatcher/routable.d/50-tailscale-gro

sudo tailscale up --advertise-exit-node

# === 最后两步在 admin console ===

# 4. 浏览器打开上一步输出的 URL 完成认证
# 5. login.tailscale.com/admin → Machines → 你的 VPS：
#    - Edit route settings → 勾选 "Use as exit node"
#    - 菜单 → Disable key expiry（避免 180 天后掉线）
```

5 个动作搞定。Console 操作 3 个（创建实例 / 关 SrcDst Check / 分配 EIP），SSH 里复制一段命令，admin console 再点两下。

### 验证

从客户端：

```bash
# 看实际连接路径是直连还是走中继
tailscale ping <你的-aws-hostname>
# 期望：pong from ... via 52.x.x.x:41641 in 65ms（直连）

# 切到 AWS 作为 exit node 后看出口 IP
curl ifconfig.me
# 期望：你的 Elastic IP
```

我从中国移动接入到 AWS Tokyo 的 `tailscale ping` 实测：

```
pong from aws-tk-arm via 54.95.50.5:41641 in 67ms
pong from aws-tk-arm via 54.95.50.5:41641 in 64ms
pong from aws-tk-arm via 54.95.50.5:41641 in 64ms
```

稳定 ~65ms，比 Singapore 快约 20ms。

> 💡 想自己跑一遍验证？附录 7.5 里有个 `bench-exit-node.sh` 脚本，测 TTFB + 带宽，附我的实测对比表。

### 关于 `tailscale ping` 输出里的 DERP — 长期容易被误读的一点

`tailscale ping` 偶尔会先输出几行 `via DERP(xxx)` 然后才看到 `via <IP>:41641`。**这是 Tailscale 的设计行为**，但**不影响你实际跑 Claude Code 的体验**。

Tailscale 官方文档明确写：
> "All connections start as relayed through a DERP server, and Tailscale then tries to upgrade them to a direct connection."

但是——**只要直连建立后，Tailscale 会用 keepalive 持续维护它**：

- WireGuard 协议层默认每 **25 秒** 发一个 keepalive 包，专门为穿越 NAT 而设计
- Tailscale magicsock 在活跃 peer 之间默认每 **2 秒** 互发心跳
- 这些 keepalive 比任何家用路由器/CGNAT 的 UDP 超时都要短，**NAT mapping 不会过期**

所以你**实际跑 Claude Code 时**：

- 写代码、跑脚本、过 10 分钟才发下一个 API 请求 → 直连一直保持，下一个请求零重建
- 出去吃午饭一小时再回来 → 直连大概率还在
- 起 tmux 持续 ping exit node 这种 trick → **不需要**，keepalive 已经在做

那为什么 `tailscale ping` 切换 peer 时还会看到 DERP？因为 `tailscale ping` 是**探测命令**，会去激活一个之前不活跃的 peer。如果你 tailnet 里有十几个设备，最近没用过的 peer 会被 magicsock 降级，新一次 `tailscale ping` 触发它重新激活，前几个包走 DERP 是预期的。

**判断标准**：看你**实际通过 exit node 跑 API 时**的体验，不用看 `tailscale ping` 的瞬时输出。

---

## 四、客户端配置：全平台

### macOS

从 [Mac App Store](https://apps.apple.com/app/tailscale/id1475387142) 或 [tailscale.com/download](https://tailscale.com/download) 下载安装。

1. 点击菜单栏图标登录
2. 菜单栏 → Tailscale 图标 → Exit Node → 选择你的 VPS
3. 完成。所有流量现在通过海外节点出去。

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

> ⚠️ **`--accept-dns=false` 只在客户端用**。**绝对不要**在服务端（exit node 那台 VPS）上设这个 flag —— 它会改变所有走该 exit node 的客户端的 DNS 行为，是个隐蔽的坑（Tailscale issue #5875）。VPS 那一侧保持默认就好。

### iOS

App Store 搜 Tailscale → 安装 → 登录 → 设置 → Exit Node → 选你的 VPS。一步到位。

### Android

Google Play 搜 Tailscale → 安装 → 登录 → 选择 Exit Node。Android 8.0 及以上支持。

> 💡 Android 有个额外能力：原生支持 **app 级别的分流**。在 Tailscale 设置里，你可以选择只让特定 app（比如 ChatGPT、浏览器）走 Tailscale，其他 app 走本地网络。这是 Android 独有的，其他平台目前做不到。

---

## 五、使用模式

所有流量都走 exit node。配置最简单，一条命令搞定：

```bash
sudo tailscale up --exit-node=<VPS_IP> --exit-node-allow-lan-access=true
```

手机和 Mac 上就是在 Tailscale 客户端 UI 里选一下 exit node。要切回去就关掉 exit node 选项。

**适合所有场景**：个人电脑、手机、笔记本。需要应用级分流的话用 Android 自带的 per-app routing，或者 Mac 的 Tailscale per-app 设置。

---

## 六、常见问题

**Q: 我在公司内网上班，开了 Tailscale 之后内网服务（Jira/GitLab）连不上怎么办？**

最简单的办法：**只在需要时打开 exit node**，平时关掉。Mac 和手机的 Tailscale 客户端 UI 都支持一键切换 exit node 开关。如果你需要让特定 app（比如终端里的 Claude Code）走通道、其他不走，Android 上有原生 per-app VPN 设置，Mac 可以在终端用 `HTTPS_PROXY` 环境变量配合本地代理。

如果非要全局走通道又同时访问公司内网，去 admin console → DNS 配 Split DNS（Restrict to domain → 公司域名 → 内网 DNS server，记得勾选 "Use with exit node"）。但实测这条路偶尔会出意外的 DNS 解析问题，不如按需切 exit node 省心。

**Q: Key 过期了怎么办？**

Tailscale 默认 node key **180 天**过期（老文章说 90 天，已经更新了），到期后 exit node 会从 tailnet 上掉下来——更糟糕的是 Tailscale 是 "fail close" 模式：客户端仍然认为该 exit node 在用，结果是"突然外网全断"。两种解决方法：

- **(推荐) admin console → Machines → 你的 VPS → 菜单 → Disable key expiry**——前面流程里第 5 步顺手做了的话就不用担心。
- 或者**给设备打 tag**（比如 `tag:exit-sg`）——带 tag 的设备**默认不会过期**。这是生产环境的正确做法（详见附录 7.2）。

**Q: 长时间不发 API 请求，下次会不会要重新建立连接？**

不会。Tailscale 在后台会一直用 keepalive 维护直连：WireGuard 每 25 秒一个 keepalive 包，magicsock 活跃 peer 之间每 2 秒一次心跳。你写代码 10 分钟、跑个长脚本、出去吃午饭，路径都一直是热的。详见三 BIS 末尾的"DERP 行为说明"。

**Q: 安全吗？**

Tailscale 用的是 WireGuard 加密，端到端加密，Tailscale 服务器本身看不到你的流量内容。但你的 exit node VPS 能看到解密后的流量（跟所有代理方案一样），所以**一定要用自己的 VPS**，不要用别人提供的 exit node。

---

## 七、附录：进阶选项 & 排错指南

> 主流程到这里就结束了。下面这些是给"想搞清楚为什么"或"出了奇怪问题"的玩家准备的，按需查阅。

### 7.1 为什么主流程里的那条 ethtool 命令是必要的

主流程里那条：

```bash
sudo ethtool -K "$NETDEV" rx-udp-gro-forwarding on rx-gro-list off
```

不做的话，`tailscale up` 每次启动会印一行 GRO warning。这是真实可观测的性能损失：Tailscale 自家 benchmark 显示打开 UDP GRO forwarding 后，转发吞吐量从 1.3 Gb/s 提升到 10.7 Gb/s（接近 10 倍）。t4g.small/e2-micro 当然达不到这种数字，但能"打满"实例本身的网络上限。

`networkd-dispatcher` 那段脚本是为了让重启后自动恢复（hook 在网卡 routable 时自动触发，Ubuntu 24.04 默认装了 networkd-dispatcher）。

> ⚠️ 注意 `rx-gro-list` 必须设为 **off**——它会和 GRO forwarding 冲突，开错了反而拖慢。

### 7.2 进阶：用 tag + autoApprovers 替代手动批准

每次重装 VPS 都要去 admin console 手动点"Use as exit node"和"Disable key expiry"很烦。Tailscale 的标准做法是用 **tag + autoApprovers**：

admin console → Access controls 里加：

```jsonc
{
  "tagOwners": {
    "tag:exit-sg": ["autogroup:admin"]
  },
  "autoApprovers": {
    "exitNode": ["tag:exit-sg"]
  },
  "acls": [
    { "action": "accept", "src": ["autogroup:member"], "dst": ["*:*"] }
  ]
}
```

然后 admin console 生成一个带 `tag:exit-sg` 的 auth key，VPS 上：

```bash
sudo tailscale up --advertise-exit-node \
  --advertise-tags=tag:exit-sg \
  --auth-key=tskey-auth-xxxxx
```

这样 exit node 自动批准、key 默认不过期。如果将来想限制只有部分设备能用这个 exit node，改 ACL 即可。

### 7.3 `tailscale ping` 切换 peer 时看到 DERP

**正常**，**不影响实际使用**。详见三 BIS 末尾的解释。简单说：Tailscale 会把不活跃的 peer 降级，`tailscale ping` 一个最近没用过的 peer 会触发重新激活，前几个包走 DERP 是预期的。但你**实际通过 exit node 跑 API** 时，每次请求都让该 peer 保持活跃，根本不会经历这个过程。

### 7.4 排错命令速查

```bash
systemctl status tailscaled --no-pager
journalctl -u tailscaled -e --since '1 hour ago'
sudo tailscale status              # 看 peer 状态
sudo tailscale netcheck            # 看本机网络条件
sudo tailscale ping <peer>         # 看到具体 peer 的实际路径
```

实践上 tailscaled 非常稳，更常见的问题是**实例本身被 stop/start 导致 IP 变了**——这就是为什么强烈推荐绑 EIP。

### 7.5 想自己测一下哪个 exit node 更快？

下面这个脚本测两件事：**TTFB**（首字节时间，对 API 调用最关键）+ **下载带宽**（用 Cloudflare 10MB 端点）。一次跑一个 exit node：

```bash
#!/bin/bash
# bench-exit-node.sh <exit-node-hostname>
# Example: ./bench-exit-node.sh aws-tk-arm

NODE=${1:?"Usage: $0 <exit-node-hostname>"}

echo "=== Switching to $NODE ==="
sudo tailscale up --exit-node="$NODE" --exit-node-allow-lan-access=true
sleep 2

echo
echo "=== Outbound IP ==="
curl -s --max-time 10 ifconfig.me
echo

echo
echo "=== TTFB to common targets (lower is better) ==="
for url in \
    https://api.anthropic.com/ \
    https://api.openai.com/ \
    https://github.com/ \
    https://www.google.com/ \
    ; do
    printf "%-35s " "$url"
    curl -w "TTFB:%{time_starttransfer}s (DNS:%{time_namelookup} Conn:%{time_connect} TLS:%{time_appconnect})\n" \
         -o /dev/null -s --max-time 10 "$url"
done

echo
echo "=== Throughput (Cloudflare 10MB) ==="
curl -o /dev/null --max-time 30 \
     -w "  %{size_download} bytes in %{time_total}s = %{speed_download} B/s\n" \
     "https://speed.cloudflare.com/__down?bytes=10000000"

echo
echo "=== Tailscale path (should be 'via <ip>:41641', not DERP) ==="
tailscale ping "$NODE" | head -3
```

存成 `bench-exit-node.sh`，`chmod +x`，然后：

```bash
./bench-exit-node.sh aws-tk-arm
./bench-exit-node.sh aws-sg-arm
```

#### 我的实测结果（中国移动接入，2026.05，多次运行）

| 指标 | AWS Tokyo | AWS Singapore | GCP Singapore |
|---|---|---|---|
| Tailscale ping (直连) | **63-67ms** | 80-85ms | 84-132ms |
| Anthropic API TTFB | 210-410ms | 330-350ms | 334-468ms |
| OpenAI API TTFB | 246-437ms | 324-393ms | 354-414ms |
| GitHub TTFB | 416-433ms | 271-426ms | 273-545ms |
| Google TTFB | 293-361ms | 300-601ms | 309-674ms |
| Cloudflare 10MB 下载 | **51 Mbps** | 39 Mbps | 49 Mbps |

**怎么读这张表**：

- **Tailscale ping 是最稳定的信号**——它就是你的 Mac 到 VPS 的物理 RTT，跟目标 API 无关。Tokyo 在这一项上稳定领先 ~20ms，物理上无法被反超。
- **下载带宽也很稳定**：Tokyo 50 Mbps 量级、Singapore 38 Mbps 量级，多轮测量都差不多。Tokyo 微胜。
- **TTFB 单次测量噪声大**：受 DNS 解析（macOS 缓存命中与否差好几个数量级）、TLS 握手、目标服务器当时负载等影响。我多跑几次同一个 URL，最快的那一次和最慢的那一次能差 200ms。所以表里给的是范围而不是单值。

**结论**：日常 Claude Code / ChatGPT 用 **Tokyo**——基线延迟和带宽都更好。这两个是物理决定的、不会随机波动。TTFB 多次测平均下来 Tokyo 也更快，但单次测可能会因为 DNS 抖动反超，属于噪声。

OpenAI 那一项有个细节：OpenAI 在亚洲多个城市都有边缘节点，所以从哪个 region 出去都不会差太多——Tokyo 通常微胜，但 Singapore 也不会差。Anthropic 服务器主要在美国，所以哪个亚洲 region 离美西更近就更占优——Tokyo 在物理位置上赢（北太平洋直线 vs Singapore 绕远）。

> 💡 **不建议用国内"测速网站"测 exit node**：那些站测的是"AWS → 国内服务器"的特定路径（比如教育网 CERNET 出口），跟你"本地 → AWS → Anthropic 美国"的实际链路完全无关。我用 USTC 测速测出来过 Tokyo 上传只有 1.94 Mbps 这种数字，但实际跑 API 完全没问题——纯粹是 USTC 那条 CERNET 链路当时拥塞，与你的使用场景没关系。

> 📌 **关于带宽的现实情况**：Claude Code / ChatGPT API 单次几十 KB，1 Mbps 都跑不到。带宽测试主要是 sanity check，确认你的隧道没出毛病。**决策的两个最稳定信号是 Tailscale ping（基线延迟）和带宽（吞吐上限）**——这两个物理决定，不随机抖动。TTFB 的单次值只是参考。

---

## 写在最后

整套配置从零开始大概 30 分钟（GCP 或 AWS 都差不多）。之后就是一个 `tailscale up` 的事。

工具是为了让你专注于真正重要的事 —— 写代码、做项目、解决问题。网络不应该是阻碍你使用 AI 工具的瓶颈。

如果你在配置过程中遇到问题，欢迎在评论区交流。[Tailscale 的文档](https://tailscale.com/docs) 写得很好，遇到具体问题直接搜通常都能找到答案。

---

*本文最初基于 2026 年 3 月在 GCP 的实际使用经验。2026 年 5 月增加了 AWS 路线、Tokyo 节点推荐、性能/排错附录。Tailscale、GCP、AWS 的产品可能会更新，请以官方文档为准。*
