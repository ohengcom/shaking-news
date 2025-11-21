# Shaking News

**Turn news reading into healthy neck exercise!** 

<!-- Updated project name from "Shaking Head News" to "Shaking News" -->

## 🌟 Features

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
