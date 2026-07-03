<div align="center">
  <img src="https://img.shields.io/badge/PrepAI-AI%20Interview%20Assistant-aa3bff?style=for-the-badge" alt="PrepAI Banner" />

  <h1>🚀 PrepAI</h1>
  <p><strong>The Ultimate AI-Powered Interview Preparation & Career Advancement Ecosystem</strong></p>

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#installation">Installation</a> •
    <a href="#environment-variables">Env Variables</a> •
    <a href="#contributing">Contributing</a>
  </p>

  <p>
    <img alt="React" src="https://img.shields.io/badge/react-%2320232a.svg?style=flat-square&logo=react&logoColor=%2361DAFB" />
    <img alt="NodeJS" src="https://img.shields.io/badge/node.js-6DA55F?style=flat-square&logo=node.js&logoColor=white" />
    <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=flat-square&logo=mongodb&logoColor=white" />
    <img alt="Express.js" src="https://img.shields.io/badge/express.js-%23404d59.svg?style=flat-square&logo=express&logoColor=%2361DAFB" />
    <img alt="TailwindCSS" src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=flat-square&logo=tailwind-css&logoColor=white" />
  </p>
</div>

---

## 💡 About The Project

**PrepAI** is a comprehensive, full-stack platform designed to help candidates land their dream jobs. It leverages advanced Large Language Models (LLMs) to provide an end-to-end preparation ecosystem. From optimizing resumes to conducting intense, real-time technical mock interviews, PrepAI is the ultimate tool for developers and professionals preparing for technical hiring.

It boasts a stunning, highly animated, and fully responsive user interface with seamless **Light and Dark mode** support.

---

## ✨ Key Features

- 🧠 **AI Mock Interviews**: Dynamic questions with real-time evaluation. Get scored on technical depth, communication, and confidence.
- 📄 **Resume Analysis**: ATS scoring, skill gap detection, and AI-powered suggestions to make your resume stand out in the 1% pile.
- 💻 **Interactive Coding Challenges**: LeetCode-style problems built with the Monaco editor, edge-case test generation, and AI code complexity review.
- 📈 **Performance Analytics**: Track your progress with advanced heatmaps, topic-wise scores, and actionable improvement trends.
- 🛣️ **Personalized Career Roadmaps**: AI-generated step-by-step career progression guides based on your current skills and target roles.
- 🌗 **Beautiful UI / UX**: A premium, playful, and engaging learning environment powered by Tailwind CSS and Framer Motion with automatic Light/Dark mode.
- 🔐 **Robust Authentication**: Secure JWT-based authentication, Google OAuth integration, email verification, and password resets.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS, CSS Variables
- **Animations**: Framer Motion
- **State Management**: Redux Toolkit, Zustand
- **Routing**: React Router DOM
- **Forms & Validation**: React Hook Form
- **Icons**: Lucide React
- **Editor**: @monaco-editor/react
- **Data Visualization**: Recharts

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Database**: MongoDB (Mongoose 9.x)
- **AI Integration**: Google Generative AI (Gemini), OpenAI API
- **Authentication**: JWT, bcryptjs, google-auth-library
- **File Uploads**: Multer, Cloudinary
- **Emails**: Nodemailer
- **Security**: Helmet, Express Rate Limit, CORS

---

## 📂 Project Structure

```text
ai-resume/
├── backend/                  # Node.js / Express backend
│   ├── src/
│   │   ├── config/           # Database & environment configurations
│   │   ├── controllers/      # Route controllers (Auth, Interview, etc.)
│   │   ├── middlewares/      # JWT protection, error handling
│   │   ├── models/           # Mongoose schemas (User, Resume, Interview)
│   │   ├── routes/           # Express routes
│   │   ├── services/         # AI integration services (Gemini/OpenAI)
│   │   ├── utils/            # Helper functions (email, jwt)
│   │   └── server.js         # Entry point
│   └── package.json
└── frontend/                 # React / Vite frontend
    ├── src/
    │   ├── context/          # React contexts (ThemeContext)
    │   ├── features/         # Feature-based components
    │   ├── layouts/          # Dashboard & Auth layouts
    │   ├── pages/            # Page components (Landing, Dashboard, Coding, etc.)
    │   ├── store/            # Redux store & slices
    │   ├── App.jsx           # Main router component
    │   └── index.css         # Global styles & Tailwind directives
    ├── tailwind.config.js    # Tailwind configuration & theme
    └── package.json
```

---

## 🚀 Installation & Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/ai-resume.git
cd ai-resume
```

### 2. Setup Backend
```bash
cd backend
npm install
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
```

### 4. Run the Development Servers
Open two terminal windows/tabs:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
Your application should now be running. The frontend will be accessible at `http://localhost:5173` and the backend API at `http://localhost:5000`.

---

## 🔑 Environment Variables

To run this project, you will need to add the following environment variables.

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Database
MONGO_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
GOOGLE_CLIENT_ID=your_google_oauth_client_id

# AI Providers
GEMINI_API_KEY=your_google_gemini_api_key
OPENAI_API_KEY=your_openai_api_key

# Email configuration (Nodemailer)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_EMAIL=your_smtp_email
SMTP_PASSWORD=your_smtp_password
FROM_EMAIL=noreply@prepai.com
FROM_NAME=PrepAI

# Cloudinary (File Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Made with ❤️ by <a href="#">Anshika</a></p>
</div>