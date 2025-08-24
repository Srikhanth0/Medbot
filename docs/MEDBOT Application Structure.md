# MEDBOT Application Structure

## Application Overview
MEDBOT is a medical health monitoring application with the following key features:
- User authentication (social login + email/password)
- Health metrics dashboard with real-time monitoring
- AI chatbot with 3D character
- Data integration (ECG, prescriptions)
- Settings management
- Calendar with reminders

## Page Structure

### 1. Authentication Page (Desktop-2(1).png)
- **Route**: `/login`
- **Components**:
  - Logo header
  - Social login buttons (Facebook, Google)
  - Email/password form
  - Login button
- **Features**: Form validation, social authentication

### 2. Dashboard with Chatbot (Desktop-3.png)
- **Route**: `/dashboard`
- **Components**:
  - Sidebar navigation
  - Header with user greeting
  - 3D character display
  - Chat interface with messages
  - Message input with attachment
- **Features**: Real-time chat, 3D character interaction

### 3. Health Metrics Dashboard (Desktop-4.png)
- **Route**: `/health`
- **Components**:
  - Patient profile card
  - Health metric cards:
    - Blood Status (116/70) with chart
    - Heart Rate (110 BPM) with ECG
    - Blood Count (80-90) with wave chart
    - Glucose Level (230ml) with trend chart
  - Pie chart visualization
- **Features**: Real-time health data, interactive charts

### 4. Integration Page (Desktop-5.png)
- **Route**: `/integration`
- **Components**:
  - File upload areas (drag & drop)
  - ECG data upload section
  - Prescription upload section
  - Help text and format instructions
- **Features**: File upload, OCR processing, data validation

### 5. Settings Page (Desktop-6.png)
- **Route**: `/settings`
- **Components**:
  - Notification settings (toggles)
  - Privacy settings
  - Account management
  - Action buttons (Manage, Update, Change, Delete)
- **Features**: User preferences, account management

### 6. Calendar Page (Desktop-8.png)
- **Route**: `/calendar`
- **Components**:
  - Monthly calendar grid (12 months)
  - Add reminder button
  - Navigation arrows
  - Date highlighting
- **Features**: Event management, reminders, date selection

## Shared Components

### Sidebar Navigation
- **Icons**: Home, Analytics, Grid, Settings, Calendar, User
- **Active state**: Green highlight
- **Responsive**: Collapsible on mobile

### Header
- **User greeting**: "Good Morning! User"
- **Profile avatar**: Circular user image
- **Consistent across all pages**

### Color Scheme
- **Primary**: Teal/Cyan (#4A90A4)
- **Secondary**: Light purple/pink (#E8D5E8)
- **Accent**: Green (#4CAF50)
- **Background**: Dark teal gradient
- **Cards**: Light gray/white

## Technical Requirements
- Next.js 14+ with TypeScript
- Responsive design (desktop + mobile)
- Component-based architecture
- State management (Context API or Zustand)
- Chart library (Chart.js or Recharts)
- File upload handling
- 3D character integration (Three.js or similar)
- Calendar functionality
- Form validation

