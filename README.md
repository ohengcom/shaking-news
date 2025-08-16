# Shaking News

**Turn news reading into healthy neck exercise!** 

<!-- Updated project name from "Shaking Head News" to "Shaking News" -->

... Content omitted to save tokens. You MUST run SearchRepo to get the full and current version before editing ...

## 🌟 Features

### Core Functionality
- **📰 News Display**: Real-time news from multiple sources with intelligent caching
- **🔄 Automatic Page Rotation**: Gentle tilting every 30 seconds (customizable 10-120s)
- **🎯 Customizable Tilt Angles**: Adjustable maximum tilt from 5° to 45° (default: 20°)
- **🌍 Multi-language Support**: Chinese and English with automatic source switching
- **💾 Intelligent Caching**: 4-hour cache with background pre-loading to minimize API calls
- **📱 Responsive Design**: Optimized for all screen sizes

### User Experience
- **🔐 Google SSO Authentication**: Secure login with Google accounts
- **☁️ Cloud Settings Sync**: Automatic synchronization of user preferences
- **🎨 Customizable Interface**: Font size adjustment, compact layout options
- **📊 Status Information**: Optional display of rotation status and news metadata
- **📢 Advertisement Integration**: Optional ad display with user control
- **⚡ Performance Optimized**: Pre-loading and aggressive caching for smooth experience

### Health & Wellness
- **💪 Neck Exercise Integration**: Transform news consumption into gentle neck movements
- **⏰ Customizable Frequency**: Adjustable rotation intervals for comfort
- **🎯 Controlled Motion**: Safe, gentle tilting within user-defined limits
- **📈 Wellness Focus**: Promotes better posture and neck health during screen time

## 🛠 Technical Implementation

### Frontend Architecture
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS v4 with custom animations
- **UI Components**: shadcn/ui component library
- **Authentication**: Google OAuth 2.0 integration
- **State Management**: React hooks with localStorage persistence

### News Integration
- **Chinese News**: `news.ravelloh.top/latest.json` (JSON format)
- **English News**: RSS2JSON service with BBC RSS feed (CORS-friendly)
- **Caching Strategy**: 4-hour TTL with background refresh every 2 hours
- **Fallback Content**: Comprehensive sample news when APIs unavailable

### Performance Features
- **Aggressive Caching**: Minimizes API calls with intelligent cache management
- **Pre-loading System**: Background news fetching for seamless user experience
- **Request Limiting**: Built-in API quota management and rate limiting
- **Error Handling**: Graceful degradation with informative fallback content

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Google Cloud Console project for OAuth (optional)
- Google Analytics account for tracking (optional)

### Installation

1. **Clone or download the project**
2. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

3. **Configure environment variables** (optional):
   \`\`\`bash
   # .env.local
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
   \`\`\`

4. **Run the development server**:
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open [http://localhost:3000](http://localhost:3000)**

### Google OAuth Setup (Optional)

1. **Create Google Cloud Project**
2. **Enable Google+ API**
3. **Create OAuth 2.0 credentials**
4. **Add authorized origins**:
   - `http://localhost:3000` (development)
   - `https://www.888388.xyz` (production)

### Google Analytics Setup (Optional)

The project includes Google Analytics integration with tracking ID `G-1TWP6S7S8H`. Analytics will automatically track page views and user interactions.

## 📁 Project Structure

\`\`\`
shaking-news/
├── app/
│   ├── layout.tsx          # Root layout with fonts and metadata
│   ├── page.tsx           # Main application component
│   └── globals.css        # Global styles and animations
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── auth-button.tsx    # Google authentication component
│   ├── cache-manager-ui.tsx # Cache management interface
│   └── settings-panel.tsx  # Settings configuration panel
├── lib/
│   ├── auth.ts           # Authentication service
│   ├── cache-manager.ts  # Caching system
│   ├── news-preloader.ts # Background news fetching
│   ├── rss-parser.ts     # News parsing and processing
│   └── utils.ts          # Utility functions
└── public/
    ├── favicon.ico       # Website favicon
    └── *.png            # Various icon sizes
\`\`\`

## ⚙️ Configuration Options

### User Settings
- **Language**: Chinese/English with automatic news source switching
- **Rotation Frequency**: 10-120 seconds (default: 30s)
- **Maximum Tilt Angle**: 5-45 degrees (default: 20°)
- **Font Size**: Small/Medium/Large options
- **Display Options**: Status information and advertisement toggles

### Data Sources
- **Customizable News Sources**: Add/remove RSS feeds and JSON endpoints
- **Source Management**: Built-in interface for managing news sources
- **Format Support**: RSS, JSON, and various news API formats

## 🎯 Usage Instructions

1. **Visit the website** and allow it to load news content
2. **Watch the gentle rotation** every 30 seconds (or your custom interval)
3. **Move your head along** with the page rotation for neck exercise
4. **Customize settings** via the gear icon (login required for cloud sync)
5. **Add news sources** to personalize your content
6. **Enable/disable features** like status display and advertisements

## 🌐 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub repository**
2. **Connect to Vercel**
3. **Configure environment variables**:
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
4. **Deploy automatically**

### Domain Configuration

The project is configured for deployment at `www.888388.xyz`. Update the following for your domain:
- Google OAuth authorized origins
- Any hardcoded domain references
- Analytics configuration

## 🔧 Development

### Adding News Sources
\`\`\`typescript
// In app/page.tsx
const newSource = {
  name: "Source Name",
  url: "https://api.example.com/news",
  language: "en" // or "zh"
};
\`\`\`

### Customizing Animations
\`\`\`css
/* In app/globals.css */
@keyframes custom-tilt {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(var(--tilt-angle)); }
}
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

For issues, questions, or contributions:
- Create an issue on GitHub
- Check existing documentation
- Review the code comments for implementation details

---

**Shaking News** - Where staying informed meets staying healthy! 🗞️💪

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
