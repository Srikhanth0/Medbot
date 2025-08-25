# Gemini AI Chatbot Setup

This project includes a secure backend proxy for the Google Gemini AI API to handle API keys safely.

## Quick Setup

### 1. Get Your Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the API key

### 2. Configure Environment Variables
1. Copy `env.example` to `.env`:
   ```bash
   copy env.example .env
   ```
2. Edit `.env` and add your API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   PORT=3001
   ```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start the Server
```bash
# Start only the Gemini API server
npm run dev:server

# Or start all services (Three.js + MEDBOT + Gemini)
npm run dev
```

### 5. Test the Chatbot
Open `gemini-chat.html` in your browser or access it via:
```
http://localhost:3000/gemini-chat.html
```

## How It Works

### Backend Proxy (`server.js`)
- **Secure API Key Handling**: API key is stored server-side in `.env`
- **CORS Enabled**: Allows frontend to communicate with the server
- **Error Handling**: Proper error responses and logging
- **Health Check**: `/api/health` endpoint for server status

### Frontend (`gemini-chat.html`)
- **Modern UI**: Beautiful gradient design with glassmorphism
- **Real-time Chat**: Instant message sending and receiving
- **Error Handling**: User-friendly error messages
- **Connection Status**: Shows server connection status

## 📡 API Endpoints

### POST `/api/gemini`
Send a message to Gemini AI:
```javascript
fetch('http://localhost:3001/api/gemini', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Hello, Gemini!' })
});
```

### GET `/api/health`
Check server status:
```javascript
fetch('http://localhost:3001/api/health');
```

## Security Features

- ✅ **API Key Protection**: Never exposed to frontend
- ✅ **Environment Variables**: Secure configuration management
- ✅ **CORS Configuration**: Controlled cross-origin requests
- ✅ **Error Handling**: No sensitive data in error messages

## Integration with Existing Apps

### Three.js Viewer Integration
You can integrate the Gemini chatbot into your Three.js viewer:

```javascript
// In your Three.js app
async function askGemini(question) {
  const response = await fetch('http://localhost:3001/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: question })
  });
  const data = await response.json();
  return data.reply;
}
```

### MEDBOT App Integration
Add AI chat functionality to your React app:

```javascript
// In your React component
const [aiResponse, setAiResponse] = useState('');

const askAI = async (question) => {
  try {
    const response = await fetch('http://localhost:3001/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: question })
    });
    const data = await response.json();
    setAiResponse(data.reply);
  } catch (error) {
    console.error('AI Error:', error);
  }
};
```

## Troubleshooting

### Common Issues:

1. **"Cannot connect to server"**
   - Make sure the server is running: `npm run dev:server`
   - Check if port 3001 is available

2. **"Failed to get response from Gemini"**
   - Verify your API key in `.env`
   - Check if the API key has proper permissions

3. **CORS Errors**
   - Server includes CORS headers
   - Make sure you're accessing from the correct origin

### Debug Mode:
Add this to your `.env` for detailed logging:
```
DEBUG=true
```

##  Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Your Gemini API key | Required |
| `PORT` | Server port | 3001 |
| `DEBUG` | Enable debug logging | false |

## Development Workflow

1. **Start Development**: `npm run dev` (starts all services)
2. **Test Chatbot**: Open `gemini-chat.html`
3. **Integrate**: Add AI features to your existing apps
4. **Deploy**: Ensure `.env` is properly configured in production

##  Ready to Use!

Your Gemini AI chatbot is now ready! The backend proxy keeps your API key secure while providing a clean interface for AI interactions. 
