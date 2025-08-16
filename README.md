# Shaking News

**Turn news reading into healthy neck exercise!** 

<!-- Updated project name from "Shaking Head News" to "Shaking News" -->

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

## 📖 Documentation

- [中文文档](README-zh.md) - Chinese documentation
