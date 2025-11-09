# 🏥 MedMindr - Smart Medication Tracker

<div align="center">

![MedMindr](https://img.shields.io/badge/MedMindr-v1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19.1.1-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646cff.svg)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.1-38bdf8.svg)

**A comprehensive, user-friendly medication tracking application built with React**

[Features](#features) | [Quick Start](#quick-start) | [Deploy](#deployment)

</div>

## ✨ Features

### 📋 **Medication Management**
- ✅ Add prescription and over-the-counter medications
- ✅ Flexible scheduling (daily, weekly, as-needed)
- ✅ Custom time periods and dosage tracking
- ✅ Provider and pharmacy information management

### 📅 **Smart Calendar Interface**
- ✅ Monthly and weekly calendar views
- ✅ Visual medication adherence indicators
- ✅ One-click medication marking
- ✅ Historical data visualization
- ✅ Today's auto-modal for quick access

### 📊 **Health Tracking**
- ✅ Pain level tracking (0-4 scale)
- ✅ Emotional well-being monitoring
- ✅ Symptom logging with notes
- ✅ Visual emoji indicators on calendar
- ✅ Comprehensive daily logs

### 🎯 **User Experience**
- ✅ Interactive guided tour for new users
- ✅ Responsive design (mobile + desktop)
- ✅ Print-friendly reports
- ✅ Comprehensive demo data (15+ months)
- ✅ No login required - works offline

### 🛡️ **Privacy & Security**
- ✅ 100% client-side application
- ✅ Data stored locally in browser
- ✅ No servers or databases required
- ✅ Complete privacy control

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Development Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd medication-tracker

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the application.

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎮 Demo Experience

MedMindr includes comprehensive demo data showcasing:

- **5 Different Medications**: Prescription and OTC drugs
- **15+ Months of Data**: September 2024 - Present
- **Realistic Adherence Patterns**: Varying compliance rates
- **200+ Daily Log Entries**: Pain, emotions, symptoms, notes
- **Interactive Tour**: Guided walkthrough for new users

## 🌐 Deployment

### Quick Deploy Options

| Platform | Command | Features |
|----------|---------|----------|
| **Vercel** | `npx vercel --prod` | ✅ Free, Fast, Auto HTTPS |
| **Netlify** | `npx netlify deploy --prod --dir=dist` | ✅ Free, Form handling |
| **GitHub Pages** | Push to main branch | ✅ Free, Auto-deploy |

### Automated Deployment

The project includes:
- 🔄 GitHub Actions workflow for auto-deployment
- 📋 Comprehensive deployment guide (`DEPLOYMENT.md`)
- 🛠️ Ready-to-use deployment script (`deploy.sh`)

```bash
# Use the deployment script
./deploy.sh
```

## 🧪 Testing

```bash
# Run development server
npm run dev

# Build and preview
npm run build && npm run preview

# Lint code
npm run lint
```

## 🔧 Tech Stack

- **Frontend**: React 19.1.1 + Vite 7.1.7
- **Styling**: Tailwind CSS 3.4.1
- **Icons**: Lucide React 0.546.0
- **Storage**: Browser localStorage
- **Build**: Vite with optimized chunking
- **Deploy**: Vercel/Netlify/GitHub Pages ready

## 📞 Support

- 📧 **Issues**: [GitHub Issues](../../issues)
- 📖 **Documentation**: See `DEPLOYMENT.md` for deployment help
- 💡 **Feature Requests**: [GitHub Discussions](../../discussions)

---

<div align="center">

**Made with ❤️ for better medication adherence**

⭐ **Star this repo if MedMindr helps you!** ⭐

</div>
