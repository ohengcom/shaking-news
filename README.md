# Shaking News

**Turn news reading into healthy neck exercise!**

🔗 **Live Demo**: [https://sn.oheng.com](https://sn.oheng.com)

## 🌟 Features

### Core Functionality

- **Periodic Page Rotation**: Automatically tilts the page at configurable intervals
- **Adjustable Frequency**: 5-300 seconds (default: 30s)
- **Maximum Tilt Angle**: 5-45 degrees (default: 20°)
- **Font Size**: Small/Medium/Large options
- **Bilingual Support**: Chinese and English interface

### Data Sources

- **Customizable News Sources**: Add/remove RSS feeds and JSON endpoints
- **Built-in Source Management**: User-friendly interface for managing news sources
- **Format Support**: RSS, JSON, and various news API formats
- **Smart Caching**: 4-hour cache with rate limiting to respect API quotas

### User Features

- **Google Authentication**: Sign in to sync settings across devices
- **Cloud Sync**: Settings saved to cloud when logged in
- **AdSense Integration**: Optional ad display on page sides

## 🎯 Usage Instructions

1. **Visit** [sn.oheng.com](https://sn.oheng.com) and allow it to load news content
2. **Watch the gentle rotation** every 30 seconds (or your custom interval)
3. **Move your head along** with the page rotation for neck exercise
4. **Sign in** via the login button if you want to customize settings
5. **Customize settings** via the gear icon (login required)
6. **Add news sources** to personalize your content

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with React 19
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5
- **Hosting**: Azure Static Web Apps
- **Authentication**: Google OAuth 2.0
- **Ads**: Google AdSense

## 🌐 Deployment

### Azure Static Web Apps (Current)

The project is deployed on Azure Static Web Apps with GitHub Actions CI/CD.

1. **Push to GitHub** - triggers automatic deployment
2. **Azure builds** the Next.js static export
3. **Site available** at your custom domain

### Environment Variables

For local development, create `.env.local`:

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

Note: In the current production build, the Google Client ID is hardcoded for simplicity.

### Domain Configuration

Current production domain: `sn.oheng.com`

To use your own domain:

1. Update Google OAuth authorized origins in Google Cloud Console
2. Add your domain to Azure Static Web Apps custom domains
3. Update AdSense authorized sites if using ads

## 🔧 Development

### Prerequisites

- Node.js 20.9.0 or higher
- npm or pnpm

### Local Setup

```bash
# Clone the repository
git clone https://github.com/ohengcom/shaking-news.git
cd shaking-news

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

### Project Structure

```
├── app/                 # Next.js app directory
│   ├── page.tsx        # Main page component
│   ├── layout.tsx      # Root layout with AdSense/GA
│   └── globals.css     # Global styles
├── components/          # React components
│   └── settings-modal.tsx
├── hooks/               # Custom React hooks
│   └── use-shaking.ts  # Shaking animation logic
├── lib/                 # Utility libraries
│   ├── auth.ts         # Google authentication
│   ├── rss-parser.ts   # News feed parser
│   └── constants.ts    # App configuration
└── public/              # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

For issues, questions, or contributions:

- [Create an issue](https://github.com/ohengcom/shaking-news/issues) on GitHub
- Check existing documentation
- Review the code comments for implementation details

---

**Shaking News** - Where staying informed meets staying healthy! 🗞️💪

## 📖 Documentation

- [中文文档](README-zh.md) - Chinese documentation
