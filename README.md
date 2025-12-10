# AI Text Summarizer

A React + Redux Toolkit application that enables users to register, login, and generate AI-based text summaries using Firebase authentication and Firestore storage.

## Features

- **User Authentication** - Register and login with Firebase Auth
- **AI Summaries** - Generate summaries using Google Gemini API
- **Summary History** - View all your generated summaries
- **State Management** - Redux Toolkit for global state
- **Data Persistence** - Firestore database for history storage
- **Protected Routes** - Secure pages only for logged-in users
- **Responsive Design** - Tailwind CSS styling

## Tech Stack

- **React 19** - UI library
- **Redux Toolkit** - State management
- **Firebase Auth** - User authentication
- **Firebase Firestore** - Database
- **Google Gemini API** - AI text summarization
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## Project Structure

```
text_summarizer/
├── src/
│   ├── pages/
│   │   ├── Register.jsx        - Registration page
│   │   ├── Login.jsx           - Login page
│   │   ├── Summary.jsx         - Summary generator page
│   │   └── History.jsx         - Summary history page
│   ├── components/
│   │   ├── Navbar.jsx          - Navigation bar
│   │   └── ProtectedRoute.jsx  - Route protection
│   ├── redux/
│   │   ├── store.js            - Redux store setup
│   │   ├── authSlice.js        - Auth state
│   │   ├── summarySlice.js     - Summary state
│   │   └── historySlice.js     - History state
│   ├── config/
│   │   └── firebase.js         - Firebase configuration
│   ├── App.jsx                 - Main app with routing
│   └── main.jsx                - App entry point
├── .env.example                - Environment variables template
├── Jenkinsfile                 - CI/CD pipeline
├── firebase.json               - Firebase hosting config
└── package.json
```

## Setup & Installation

### Prerequisites
- Node.js 18+
- Firebase account
- Cohere API key

### 1. Clone Repository
```bash
git clone <repo-url>
cd text_summarizer
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

Fill in your credentials:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run Locally
```bash
npm run dev
```

Open `http://localhost:5173`

## Firebase Setup

1. Create Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password)
3. Create Firestore database (Start in test mode)
4. Create collection: `summaries`
5. Add your credentials to `.env`

## Firestore Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /summaries/{document=**} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid != null;
    }
  }
}
```

## Redux State

### Auth Slice
- `user` - Current user object
- `loading` - Loading state
- `error` - Error messages

### Summary Slice
- `text` - Input text
- `summary` - Generated summary
- `loading` - API call status
- `error` - Error messages

### History Slice
- `items` - Array of summaries
- `loading` - Fetch status
- `error` - Error messages

## API Endpoints

### Firebase Auth
- Register: `auth.createUserWithEmailAndPassword()`
- Login: `auth.signInWithEmailAndPassword()`
- Logout: `auth.signOut()`

### Firestore
- Save Summary: `POST /summaries`
- Fetch History: `GET /summaries?userId=uid`
- Delete Summary: `DELETE /summaries/{id}`

### Google Gemini API
- Summarize: `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent`

## Available Scripts

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Firebase Hosting Deployment

### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login to Firebase
```bash
firebase login
```

### 3. Initialize Firebase Hosting
```bash
firebase init hosting
```

Select:
- Project: your-project
- Public directory: dist
- SPA: Yes
- Rewrite URLs: Yes

### 4. Build & Deploy
```bash
npm run build
firebase deploy
```

Your app will be live at: `https://your-project.web.app`

## Jenkins CI/CD

Push to `main` branch. Jenkins will:
1. Install dependencies
2. Lint code
3. Build app
4. Deploy to Firebase Hosting

Set `FIREBASE_TOKEN` environment variable in Jenkins.

## Environment Variables

| Variable | Description |
|----------|-------------|
| VITE_FIREBASE_API_KEY | Firebase API key |
| VITE_FIREBASE_AUTH_DOMAIN | Firebase auth domain |
| VITE_FIREBASE_PROJECT_ID | Firebase project ID |
| VITE_FIREBASE_STORAGE_BUCKET | Firebase storage bucket |
| VITE_FIREBASE_MESSAGING_SENDER_ID | Firebase messaging sender ID |
| VITE_FIREBASE_APP_ID | Firebase app ID |
| VITE_GEMINI_API_KEY | Google Gemini API key for summaries |

## Troubleshooting

**Firebase not connecting:**
- Check `.env` file has correct credentials
- Verify Firestore database rules

**Gemini API errors:**
- Check API key is valid
- Verify Gemini API is enabled in Google Cloud Console
- Check rate limits

**Auth errors:**
- Ensure Email/Password auth enabled in Firebase
- Check user email format

## License

MIT
