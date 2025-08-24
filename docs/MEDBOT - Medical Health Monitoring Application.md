# MEDBOT - Medical Health Monitoring Application

## Overview
MEDBOT is a comprehensive medical health monitoring application built with Next.js, TypeScript, and modern web technologies. The application provides a complete healthcare dashboard with AI chatbot integration, health metrics monitoring, data integration capabilities, and user management features.

## Live Application
🚀 **Deployed URL**: https://kyecissk.manus.space

## Features

### 1. Authentication System
- **Social Login**: Facebook and Google integration
- **Email/Password**: Traditional login with form validation
- **User Management**: Secure authentication flow

### 2. Dashboard with AI Chatbot
- **3D Character**: Interactive 3D medical assistant built with Three.js
- **Real-time Chat**: Functional chat interface with message history
- **Responsive Design**: Optimized for desktop and mobile devices

### 3. Health Metrics Dashboard
- **Patient Profile**: Comprehensive patient information display
- **Health Cards**: Real-time monitoring of:
  - Blood Pressure (116/70)
  - Heart Rate (110 BPM)
  - Blood Count (80-90)
  - Glucose Level (230ml)
- **Interactive Charts**: Data visualization using Recharts
- **Health Overview**: Pie chart showing health status distribution

### 4. Data Integration
- **File Upload**: Drag and drop functionality for medical documents
- **ECG Data**: Support for ECG file processing
- **Prescription Management**: Upload and manage prescription documents
- **OCR Support**: Compatible formats for document processing

### 5. Settings Management
- **Notifications**: Toggle controls for push and email notifications
- **Privacy Settings**: Data sharing and privacy management
- **Account Management**: Personal information and password management
- **Security**: Account deletion and data management options

### 6. Calendar System
- **Monthly View**: Complete year calendar display
- **Event Management**: Add reminder functionality
- **Date Selection**: Interactive date picking
- **Responsive Grid**: Optimized calendar layout

## Technical Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS with custom theme
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React icons
- **Charts**: Recharts for data visualization
- **3D Graphics**: Three.js with React Three Fiber

### Key Dependencies
- **React Three Fiber**: 3D character rendering
- **React Three Drei**: 3D utilities and helpers
- **Date-fns**: Date manipulation and formatting
- **Framer Motion**: Animations and transitions

## Project Structure
```
medbot-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Calendar.tsx     # Calendar component
│   │   ├── Character3D.tsx  # 3D character component
│   │   ├── ChatInterface.tsx # Chat interface
│   │   ├── FileUpload.tsx   # File upload component
│   │   ├── Header.tsx       # Header component
│   │   ├── HealthMetricCard.tsx # Health metric cards
│   │   ├── Layout.tsx       # Main layout wrapper
│   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   └── ToggleSwitch.tsx # Toggle switch component
│   ├── pages/               # Application pages
│   │   ├── CalendarPage.tsx # Calendar page
│   │   ├── DashboardPage.tsx # Main dashboard
│   │   ├── HealthPage.tsx   # Health metrics page
│   │   ├── IntegrationPage.tsx # Data integration
│   │   ├── LoginPage.tsx    # Authentication page
│   │   └── SettingsPage.tsx # Settings management
│   ├── assets/              # Static assets
│   ├── App.tsx              # Main application component
│   ├── App.css              # Global styles and theme
│   └── main.tsx             # Application entry point
├── public/                  # Public assets
├── dist/                    # Production build
└── package.json             # Dependencies and scripts
```

## Color Scheme
- **Primary**: Teal/Cyan (#4A90A4)
- **Secondary**: Light Purple (#E8D5E8)
- **Accent**: Green (#4CAF50)
- **Background**: Dark Teal Gradient (#2A5A6B)
- **Cards**: Light Gray/White
- **Health Metrics**:
  - Blood Status: Red (#F44336)
  - Heart Rate: Green (#4CAF50)
  - Blood Count: Purple (#9C27B0)
  - Glucose Level: Orange (#FF5722)

## Component Features

### Sidebar Navigation
- **Icons**: Health, Dashboard, Analytics, Integration, Settings, Calendar, Profile
- **Active States**: Green highlight for current page
- **Responsive**: Collapsible design for mobile

### Health Metric Cards
- **Real-time Data**: Dynamic health monitoring
- **Interactive Charts**: Line and bar charts for trends
- **Color Coding**: Status-based color schemes
- **Responsive Layout**: Grid-based responsive design

### 3D Character
- **Interactive Model**: Built with Three.js primitives
- **Animations**: Subtle rotation and movement
- **Responsive**: Optimized for different screen sizes
- **Performance**: Efficient rendering with React Three Fiber

### Chat Interface
- **Message History**: Persistent chat conversations
- **Bot Responses**: Simulated AI responses
- **File Attachments**: Support for file sharing
- **Real-time Updates**: Instant message delivery

## Development Commands

### Local Development
```bash
cd medbot-app
pnpm install
pnpm run dev --host
```

### Production Build
```bash
pnpm run build
```

### Type Checking
```bash
pnpm run type-check
```

## Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Support**: iOS Safari, Chrome Mobile
- **WebGL Support**: Required for 3D character rendering

## Performance Optimizations
- **Code Splitting**: Dynamic imports for large components
- **Lazy Loading**: Optimized component loading
- **Image Optimization**: Compressed assets
- **Bundle Size**: Optimized build with tree shaking

## Security Features
- **Input Validation**: Form validation and sanitization
- **Authentication**: Secure login flow
- **Data Protection**: Privacy settings and controls
- **File Upload**: Secure file handling

## Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Responsive grid layouts
- **Desktop**: Full-featured desktop experience
- **Touch Support**: Touch-friendly interactions

## Future Enhancements
- **Real API Integration**: Connect to actual medical APIs
- **Advanced 3D Character**: More sophisticated animations
- **Voice Integration**: Speech-to-text capabilities
- **Real-time Notifications**: Push notification system
- **Data Analytics**: Advanced health analytics
- **Multi-language Support**: Internationalization

## Deployment
The application is deployed using Manus deployment service and is accessible at:
**https://kyecissk.manus.space**

## Support
For technical support or questions about the application, please refer to the component documentation or contact the development team.

---

*Built with ❤️ using modern web technologies for healthcare innovation.*

