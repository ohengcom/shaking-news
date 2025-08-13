# 摇头新闻 / Shaking Head News

*Turn "shaking your head in dismay" at the news into healthy neck exercise!*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/ohengcoms-projects/v0-shaking-and-news)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/fnrXcVTl8GW)

## 🎯 Project Concept

Instead of just shaking your head in dismay while reading the news, why not actually shake your head for your health? This innovative news reader promotes cervical spine activity through clever page rotation design, transforming "head-shaking sighs" into "healthy head-shaking."

## ✨ Key Features

### 📰 News Display
- **Clean List Format**: Simple, distraction-free news presentation with red bullet points
- **Limited Display**: Shows first 15 news items to prevent information overload
- **Responsive Design**: Optimized for various screen sizes
- **Eye-friendly Colors**: Soothing green background (#f0f8f0) to reduce eye strain

### 🤸 Smart Neck Health System
- **Automatic Rotation**: Page tilts at random angles (-20° to -5° and 5° to 20°) every 30 seconds by default
- **Customizable Frequency**: Adjustable rotation intervals from 5 to 300 seconds
- **Isolated Movement**: Only the news section rotates while UI elements remain stable
- **Health-focused Design**: Promotes neck movement and reduces static posture

### 🌐 Multi-language Support
- **Chinese/English Interface**: Complete localization of all UI elements
- **Language-specific Data Sources**: Different news APIs for each language
- **Dynamic Content**: Status information and settings adapt to selected language

### ⚙️ Comprehensive Settings
- **Compact Settings Panel**: Right-side overlay (1/4 screen width) with semi-transparent background
- **Font Size Control**: Three options (Small/Medium/Large) for optimal readability
- **Rotation Frequency**: Customizable timing for neck exercise intervals
- **Status Display Toggle**: Option to show/hide rotation angle and countdown
- **Data Source Management**: Add, remove, and manage multiple news sources
- **Language Selection**: Switch between Chinese and English interfaces

## 🛠️ Technical Implementation

### Frontend Framework
- **Next.js 14**: App Router with TypeScript
- **Tailwind CSS**: Utility-first styling with custom animations
- **React Hooks**: State management and lifecycle handling

### Data Sources
- **Chinese News**: `https://news.ravelloh.top/latest.json`
  - JSON format with `date` and `content` array structure
- **English News**: `https://api.currentsapi.services/v1/latest-news`
  - CurrentsAPI with API key authentication
- **Fallback Content**: Comprehensive sample news when APIs are unavailable

### Animation System
- **CSS Transforms**: Smooth rotation transitions with `transform-origin: center`
- **Custom Keyframes**: Gentle sway and continuous rotation animations
- **Performance Optimized**: Hardware-accelerated transforms for smooth movement

### Error Handling
- **Network Resilience**: Graceful fallback when external APIs fail
- **CORS Management**: Proper handling of cross-origin request limitations
- **User Feedback**: Clear error messages and status indicators

## 📁 Project Structure

\`\`\`
├── app/
│   ├── globals.css          # Global styles and animations
│   ├── layout.tsx           # Root layout with font configuration
│   └── page.tsx             # Main application component
├── lib/
│   ├── rss-parser.ts        # News data fetching and parsing
│   └── utils.ts             # Utility functions
├── components/
│   └── ui/                  # Reusable UI components
└── styles/
    └── globals.css          # Additional global styles
\`\`\`

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation
\`\`\`bash
# Clone the repository
git clone https://github.com/ohengcom/shaking-head-news.git

# Navigate to project directory
cd shaking-head-news

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

### Environment Variables
For English news functionality, you may need to configure API keys:
\`\`\`env
# Optional: CurrentsAPI key for English news
CURRENTS_API_KEY=your_api_key_here
\`\`\`

## 🎮 Usage Instructions

### Basic Operation
1. **View News**: News automatically loads and displays in a clean list format
2. **Automatic Rotation**: Page begins tilting every 30 seconds by default
3. **Settings Access**: Click the gear icon in the bottom-right corner

### Settings Configuration
- **Language**: Switch between Chinese (中文) and English
- **Font Size**: Choose from Small (小), Medium (中), or Large (大)
- **Rotation Frequency**: Adjust timing from 5 to 300 seconds
- **Status Display**: Toggle rotation angle and countdown visibility
- **Data Sources**: Manage news feed URLs

### Health Benefits
- **Neck Exercise**: Regular rotation encourages neck movement
- **Posture Improvement**: Breaks static reading positions
- **Eye Strain Reduction**: Green background and movement reduce fatigue
- **Mindful Reading**: Gentle motion promotes relaxed news consumption

## 🌐 API Integration

### Chinese News Source
- **Endpoint**: `https://news.ravelloh.top/latest.json`
- **Format**: JSON with date and content array
- **Update Frequency**: Regular updates with latest Chinese news

### English News Source  
- **Endpoint**: `https://api.currentsapi.services/v1/latest-news`
- **Provider**: CurrentsAPI
- **Authentication**: API key required
- **Coverage**: International news in English

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables if needed
3. Deploy automatically on push to main branch

### Manual Deployment
\`\`\`bash
# Build the application
npm run build

# Start production server
npm start
\`\`\`

## 🤝 Contributing

This project was built collaboratively using v0.app. To contribute:

1. Continue development at: [v0.app/chat/projects/fnrXcVTl8GW](https://v0.app/chat/projects/fnrXcVTl8GW)
2. Changes are automatically synced to this repository
3. Submit issues or suggestions through GitHub Issues

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [v0.app](https://v0.app) - AI-powered development platform
- News data provided by various API services
- Inspired by the need for healthier news consumption habits

---

**Live Demo**: [https://vercel.com/ohengcoms-projects/v0-shaking-and-news](https://vercel.com/ohengcoms-projects/v0-shaking-and-news)

*Transform your news reading into a wellness activity! 📰💪*
