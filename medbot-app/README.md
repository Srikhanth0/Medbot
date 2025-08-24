# MEDBOT - AI Health Assistant

A modern React-based health monitoring application with AI-powered assistance.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Gemini API key from Google AI Studio

### Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the `medbot-app` directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3001
   VITE_API_BASE_URL=http://localhost:3001
   ```

3. **Start Development Servers**
   ```bash
   # Option 1: Use the startup script (recommended)
   npm run start
   
   # Option 2: Start both servers manually
   npm run dev:full
   
   # Option 3: Start servers separately
   # Terminal 1: Vite dev server
   npm run dev
   # Terminal 2: AI server
   npm run ai-server
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - AI API: http://localhost:3001
   - Health Check: http://localhost:3001/api/health

## 🛠️ Troubleshooting

### WebSocket Connection Issues
If you see WebSocket errors:
1. Make sure both servers are running
2. Clear browser cache (Ctrl+F5)
3. Try incognito/private browsing mode
4. Check if port 5173 is available

### API "No Response" Errors
1. Verify your `.env` file has the correct `GEMINI_API_KEY`
2. Check the AI server logs for errors
3. Test the API endpoint: http://localhost:3001/api/test

### Tailwind CSS Not Working
1. Restart the development server after configuration changes
2. Verify `tailwind.config.js` and `postcss.config.js` exist
3. Check that `src/index.css` imports Tailwind directives

### Layout Alignment Issues
The app uses Flexbox for responsive layouts:
- Mobile: Single column layout with bottom navigation
- Desktop: Sidebar + main content layout
- All components are responsive and adapt to screen size

## 📁 Project Structure

```
medbot-app/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── utils/         # Utility functions
│   └── index.css      # Global styles with Tailwind
├── public/            # Static assets
├── server.js          # AI API server
└── start-dev.js       # Development startup script
```

## 🎨 Features

- **AI Health Assistant**: Powered by Google Gemini
- **3D Character**: Interactive 3D model with Three.js
- **Responsive Design**: Works on mobile and desktop
- **Modern UI**: Built with Tailwind CSS
- **Real-time Chat**: Interactive AI conversations

## 🔧 Development

### Available Scripts
- `npm run dev` - Start Vite development server
- `npm run ai-server` - Start AI API server
- `npm run dev:full` - Start both servers with concurrently
- `npm run start` - Use the startup script with error handling
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **3D Graphics**: Three.js
- **AI**: Google Gemini API
- **Backend**: Express.js + Node.js

## 🐛 Common Issues & Solutions

### PowerShell Execution Policy
If you get execution policy errors:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Port Conflicts
If ports are in use:
1. Check what's using the port: `netstat -ano | findstr :5173`
2. Kill the process or change ports in config files

### CORS Issues
The server is configured to allow requests from:
- http://localhost:5173
- http://127.0.0.1:5173

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review server logs for error messages
3. Test individual components in isolation 