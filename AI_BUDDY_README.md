# 🤖 My AI Buddy - Iomad LMS Assistant

A powerful, GPT-4 powered AI assistant integrated into your Iomad LMS dashboard. The chatbot understands and responds intelligently to queries in **English and Arabic**, and fetches live data from the Iomad backend via its Web Service APIs.

## 🌍 Features

### Multilingual Support
- **Auto-language detection** for English and Arabic
- **Culturally appropriate responses** for Saudi Arabia and UAE
- **Accurate translations** and context-aware phrasing

### Role-Aware Behavior
- **Super Admin**: Full system access and analytics
- **School Admin**: School-specific data and management
- **Cluster Admin**: Multi-school oversight
- **Trainer**: Course and student management
- **Trainee**: Personal progress and course access

### Natural Language Understanding
The AI can handle queries like:
- "How many students completed Course A?"
- "أظهر لي كل المدارس في منطقتي التعليمية"
- "What's the attendance for Grade 6 today?"
- "ما هي الدورات المتاحة للمدرب أحمد؟"

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- OpenAI API key

### 1. Environment Setup

Create a `.env` file in the root directory:

```bash
# OpenAI API Configuration


# Iomad API Configuration
VITE_MOODLE_API_URL=https://iomad.bylinelms.com/webservice/rest/server.php
VITE_MOODLE_TOKEN=4a2ba2d6742afc7d13ce4cf486ba7633

# Backend API Configuration
VITE_BACKEND_API_URL=http://localhost:3001/api
```

### 2. Install Dependencies

```bash
# Frontend dependencies
npm install

# Backend dependencies (optional - for production)
cd server
npm install
cd ..
```

### 3. Start Development Server

```bash
# Start frontend (Vite dev server)
npm run dev

# Start backend (optional - for production)
cd server
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **Chatbot API**: http://localhost:3001/api/chatbot/chat

## 🏗️ Architecture

### Frontend Components
```
src/
├── components/
│   ├── MyAIBuddyChat.tsx      # Main chat interface
│   ├── AIBuddyFAB.tsx         # Floating action button
│   └── ...
├── context/
│   ├── ChatContext.tsx         # Chat state management
│   ├── AuthContext.tsx         # User authentication
│   └── ...
├── services/
│   └── chatbotService.ts       # OpenAI & Iomad API integration
└── ...
```

### Backend Structure
```
server/
├── server.js                   # Express server
├── chatbotRoutes.js           # Chatbot API endpoints
├── package.json               # Backend dependencies
└── ...
```

## 🔧 Configuration

### OpenAI API Setup
1. Get your API key from [OpenAI Platform](https://platform.openai.com/)
2. Add it to your `.env` file
3. The chatbot will use GPT-4 for intelligent responses

### Iomad API Integration
The system is pre-configured to work with:
- **API URL**: https://iomad.bylinelms.com/webservice/rest/server.php
- **Token**: 4a2ba2d6742afc7d13ce4cf486ba7633

### Language Detection
The system automatically detects input language:
- **English**: Latin characters
- **Arabic**: Arabic Unicode ranges

## 📱 Usage

### Accessing the Chat
1. **Floating Button**: Click the AI Buddy button in the bottom-right corner
2. **Language Toggle**: Use the globe icon to switch between English/Arabic
3. **Clear Chat**: Use the X button to start a new conversation

### Example Queries

#### English
```
"How many courses are available?"
"Show me all schools in my district"
"What's my progress in Course A?"
"Who are the trainers for this month?"
```

#### Arabic
```
"كم عدد الدورات المتاحة؟"
"أظهر لي جميع المدارس في منطقتي"
"ما هو تقدمي في الدورة أ؟"
"من هم المدربون لهذا الشهر؟"
```

## 🔒 Security

### API Key Protection
- **Never commit API keys** to version control
- **Use environment variables** for sensitive data
- **Rotate keys regularly** for production

### User Authentication
- **JWT-based authentication** with user roles
- **Role-based access control** for different features
- **Secure API endpoints** with proper validation

## 🚀 Deployment

### Frontend (Vite)
```bash
npm run build
# Deploy dist/ folder to your hosting service
```

### Backend (Express)
```bash
cd server
npm install
npm start
# Deploy to your Node.js hosting service
```

### Environment Variables for Production
```bash
OPENAI_API_KEY=your_production_openai_key
NODE_ENV=production
PORT=3001
```

## 🧪 Testing

### Manual Testing
1. **Language Detection**: Try typing in both English and Arabic
2. **Role-based Responses**: Test with different user roles
3. **Data Fetching**: Verify Iomad API integration
4. **Error Handling**: Test with invalid inputs

### API Testing
```bash
# Test chatbot endpoint
curl -X POST http://localhost:3001/api/chatbot/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "How many courses are available?", "user": {"role": "admin"}}'
```

## 🐛 Troubleshooting

### Common Issues

#### OpenAI API Errors
- **Check API key**: Verify it's valid and has credits
- **Rate limits**: Ensure you're not exceeding limits
- **Network**: Check internet connectivity

#### Iomad API Errors
- **Token validity**: Verify the Iomad token is still valid
- **API permissions**: Ensure the token has required permissions
- **Network**: Check connectivity to Iomad server

#### Frontend Issues
- **Build errors**: Run `npm install` and clear cache
- **CORS issues**: Check backend CORS configuration
- **Environment variables**: Verify all required vars are set

## 📈 Performance

### Optimization Tips
- **Caching**: Implement Redis for conversation history
- **Rate limiting**: Add rate limiting for API endpoints
- **CDN**: Use CDN for static assets
- **Database**: Consider MongoDB for chat history

### Monitoring
- **Logs**: Monitor OpenAI API usage
- **Errors**: Track failed requests
- **Performance**: Monitor response times

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style
- **TypeScript**: Use strict typing
- **ESLint**: Follow linting rules
- **Prettier**: Maintain consistent formatting
- **Comments**: Document complex logic

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Getting Help
- **Documentation**: Check this README first
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub discussions for questions

### Contact
- **Email**: support@aibuddy.com
- **GitHub**: Create issues in the repository

---

**Made with ❤️ for the Saudi Arabia and UAE education sector** 