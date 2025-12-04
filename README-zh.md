# 摇头新闻

**将新闻阅读变成健康的颈部运动！**

🔗 **在线体验**: [https://sn.oheng.com](https://sn.oheng.com)

## 🌟 功能特色

### 核心功能

- **定时页面旋转**：按可配置的间隔自动倾斜页面
- **可调节频率**：5-300 秒（默认：30 秒）
- **最大倾斜角度**：5-45 度（默认：20°）
- **字体大小**：小/中/大选项
- **双语支持**：中英文界面

### 数据源

- **可定制新闻源**：添加/删除 RSS 源和 JSON 端点
- **内置源管理**：用户友好的新闻源管理界面
- **格式支持**：RSS、JSON 和各种新闻 API 格式
- **智能缓存**：4 小时缓存，带限流以尊重 API 配额

### 用户功能

- **Google 登录**：登录后可跨设备同步设置
- **云端同步**：登录后设置保存到云端
- **AdSense 集成**：页面两侧可选广告显示

## 🎯 使用说明

1. **访问** [sn.oheng.com](https://sn.oheng.com) 并等待新闻内容加载
2. **观察轻柔旋转** 每 30 秒（或您的自定义间隔）
3. **跟随页面旋转移动头部** 进行颈部运动
4. **点击登录按钮** 登录以自定义设置
5. **通过齿轮图标自定义设置**（需要登录）
6. **添加新闻源** 个性化您的内容

## 🛠️ 技术栈

- **框架**: Next.js 16 + React 19
- **样式**: Tailwind CSS 4
- **语言**: TypeScript 5
- **托管**: Azure Static Web Apps
- **认证**: Google OAuth 2.0
- **广告**: Google AdSense

## 🌐 部署

### Azure Static Web Apps（当前）

项目部署在 Azure Static Web Apps 上，使用 GitHub Actions CI/CD。

1. **推送到 GitHub** - 触发自动部署
2. **Azure 构建** Next.js 静态导出
3. **网站可用** 于您的自定义域名

### 环境变量

本地开发时，创建 `.env.local`：

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

注意：当前生产构建中，Google Client ID 已硬编码以简化配置。

### 域名配置

当前生产域名：`sn.oheng.com`

使用您自己的域名：

1. 在 Google Cloud Console 中更新 OAuth 授权来源
2. 在 Azure Static Web Apps 中添加自定义域名
3. 如使用广告，更新 AdSense 授权网站

## 🔧 开发

### 前置要求

- Node.js 20.9.0 或更高版本
- npm 或 pnpm

### 本地设置

```bash
# 克隆仓库
git clone https://github.com/ohengcom/shaking-news.git
cd shaking-news

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 生产构建

```bash
npm run build
```

### 项目结构

```
├── app/                 # Next.js app 目录
│   ├── page.tsx        # 主页面组件
│   ├── layout.tsx      # 根布局（含 AdSense/GA）
│   └── globals.css     # 全局样式
├── components/          # React 组件
│   └── settings-modal.tsx
├── hooks/               # 自定义 React hooks
│   └── use-shaking.ts  # 摇头动画逻辑
├── lib/                 # 工具库
│   ├── auth.ts         # Google 认证
│   ├── rss-parser.ts   # 新闻源解析器
│   └── constants.ts    # 应用配置
└── public/              # 静态资源
```

## 🤝 贡献

1. Fork 仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 进行更改
4. 彻底测试
5. 提交更改 (`git commit -m 'Add amazing feature'`)
6. 推送到分支 (`git push origin feature/amazing-feature`)
7. 开启 Pull Request

## 📄 许可证

此项目是开源的，在 MIT 许可证下可用。

## 🆘 支持

如有问题、疑问或贡献：

- 在 GitHub 上[创建 issue](https://github.com/ohengcom/shaking-news/issues)
- 查看现有文档
- 查看代码注释了解实现细节

---

**摇头新闻** - 保持信息灵通与保持健康的完美结合！🗞️💪

## 📖 文档

- [English Documentation](README.md) - 英文文档
