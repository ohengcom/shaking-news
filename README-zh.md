# 摇头新闻

**将新闻阅读变成健康的颈部运动！**

## 🌟 功能特色

### 核心功能
- **📰 新闻显示**：来自多个源的实时新闻，智能缓存
- **🔄 自动页面旋转**：每30秒轻柔倾斜（可自定义10-120秒）
- **🎯 可调倾斜角度**：最大倾斜角度可调节5°至45°（默认：20°）
- **🌍 多语言支持**：中英文切换，自动切换新闻源
- **💾 智能缓存**：4小时缓存，后台预加载，最小化API调用
- **📱 响应式设计**：适配所有屏幕尺寸

### 用户体验
- **🔐 Google SSO认证**：使用Google账户安全登录
- **☁️ 云端设置同步**：用户偏好自动同步
- **🎨 可定制界面**：字体大小调节，紧凑布局选项
- **📊 状态信息**：可选显示旋转状态和新闻元数据
- **📢 广告集成**：可选广告显示，用户可控制
- **⚡ 性能优化**：预加载和积极缓存，流畅体验

### 健康与养生
- **💪 颈部运动集成**：将新闻消费转化为轻柔颈部运动
- **⏰ 可定制频率**：可调节旋转间隔，确保舒适
- **🎯 受控运动**：在用户定义范围内安全、轻柔倾斜
- **📈 健康专注**：在屏幕时间内促进更好的姿势和颈部健康

## 🛠 技术实现

### 前端架构
- **框架**：Next.js 14 with App Router
- **样式**：Tailwind CSS v4 with 自定义动画
- **UI组件**：shadcn/ui 组件库
- **认证**：Google OAuth 2.0 集成
- **状态管理**：React hooks with localStorage 持久化

### 新闻集成
- **中文新闻**：`news.ravelloh.top/latest.json`（JSON格式）
- **英文新闻**：RSS2JSON服务配合BBC RSS源（支持CORS）
- **缓存策略**：4小时TTL，每2小时后台刷新
- **备用内容**：API不可用时提供完整示例新闻

### 性能特性
- **积极缓存**：智能缓存管理最小化API调用
- **预加载系统**：后台新闻获取，无缝用户体验
- **请求限制**：内置API配额管理和速率限制
- **错误处理**：优雅降级，提供信息丰富的备用内容

## 🚀 快速开始

### 前置要求
- Node.js 18+ 和 npm/yarn
- Google Cloud Console 项目用于OAuth（可选）
- Google Analytics 账户用于跟踪（可选）

### 安装步骤

1. **克隆或下载项目**
2. **安装依赖**：
   \`\`\`bash
   npm install
   \`\`\`

3. **配置环境变量**（可选）：
   \`\`\`bash
   # .env.local
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   \`\`\`

4. **运行开发服务器**：
   \`\`\`bash
   npm run dev
   \`\`\`

5. **打开 [http://localhost:3000](http://localhost:3000)**

### Google OAuth 设置（可选）

1. **创建 Google Cloud 项目**
2. **启用 Google+ API**
3. **创建 OAuth 2.0 凭据**
4. **添加授权来源**：
   - `http://localhost:3000`（开发环境）
   - `https://www.888388.xyz`（生产环境）

### Google Analytics 设置（可选）

项目包含Google Analytics集成，跟踪ID为`G-1TWP6S7S8H`。Analytics将自动跟踪页面浏览和用户交互。

## 📁 项目结构

\`\`\`
shaking-news/
├── app/
│   ├── layout.tsx          # 根布局，包含字体和元数据
│   ├── page.tsx           # 主应用组件
│   └── globals.css        # 全局样式和动画
├── components/
│   ├── ui/                # shadcn/ui 组件
│   ├── auth-button.tsx    # Google 认证组件
│   ├── cache-manager-ui.tsx # 缓存管理界面
│   └── settings-panel.tsx  # 设置配置面板
├── lib/
│   ├── auth.ts           # 认证服务
│   ├── cache-manager.ts  # 缓存系统
│   ├── news-preloader.ts # 后台新闻获取
│   ├── rss-parser.ts     # 新闻解析和处理
│   └── utils.ts          # 工具函数
└── public/
    ├── favicon.ico       # 网站图标
    └── *.png            # 各种图标尺寸
\`\`\`

## ⚙️ 配置选项

### 用户设置
- **语言**：中英文切换，自动切换新闻源
- **旋转频率**：10-120秒（默认：30秒）
- **最大倾斜角度**：5-45度（默认：20°）
- **字体大小**：小/中/大选项
- **显示选项**：状态信息和广告切换

### 数据源
- **可定制新闻源**：添加/删除RSS源和JSON端点
- **源管理**：内置新闻源管理界面
- **格式支持**：RSS、JSON和各种新闻API格式

## 🎯 使用说明

1. **访问网站**并允许加载新闻内容
2. **观察轻柔旋转**每30秒（或您的自定义间隔）
3. **跟随页面旋转移动头部**进行颈部运动
4. **通过齿轮图标自定义设置**（需要登录以进行云同步）
5. **添加新闻源**个性化您的内容
6. **启用/禁用功能**如状态显示和广告

## 🌐 部署

### Vercel 部署（推荐）

1. **推送到GitHub仓库**
2. **连接到Vercel**
3. **配置环境变量**：
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
4. **自动部署**

### 域名配置

项目配置为部署在`www.888388.xyz`。为您的域名更新以下内容：
- Google OAuth 授权来源
- 任何硬编码的域名引用
- Analytics 配置

## 🔧 开发

### 添加新闻源
\`\`\`typescript
// 在 app/page.tsx 中
const newSource = {
  name: "源名称",
  url: "https://api.example.com/news",
  language: "zh" // 或 "en"
};
\`\`\`

### 自定义动画
\`\`\`css
/* 在 app/globals.css 中 */
@keyframes custom-tilt {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(var(--tilt-angle)); }
}
\`\`\`

## 🤝 贡献

1. Fork 仓库
2. 创建功能分支
3. 进行更改
4. 彻底测试
5. 提交拉取请求

## 📄 许可证

此项目是开源的，在MIT许可证下可用。

## 🆘 支持

如有问题、疑问或贡献：
- 在GitHub上创建issue
- 查看现有文档
- 查看代码注释了解实现细节

---

**摇头新闻** - 保持信息灵通与保持健康的完美结合！🗞️💪

## 📖 文档

- [English Documentation](README.md) - 英文文档
