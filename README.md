# CareerPath - Career Guidance Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue?style=for-the-badge)](https://your-github-username.github.io/careerpath/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

A modern, responsive career guidance platform that helps students navigate their educational and professional journey with expert mentorship and clear roadmaps.

## 🌟 Features

- **Interactive Career Exploration**: Discover various career paths with detailed information
- **Expert Mentorship**: Connect with industry professionals
- **Personalized Roadmaps**: Step-by-step guidance for career planning
- **Success Stories**: Real testimonials from successful students
- **Responsive Design**: Optimized for all devices
- **Modern UI/UX**: Clean, professional interface with smooth animations
- **User Authentication**: Secure login and registration system
- **Database Integration**: SQLite database for data persistence

## 🚀 Live Demo

Visit the live demo: [CareerPath Demo](https://your-github-username.github.io/careerpath/)

## 📋 Table of Contents

- [Features](#-features)
- [Technologies Used](#-technologies-used)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

## 🛠 Technologies Used

- **Frontend**:
  - HTML5
  - CSS3 (Custom + Tailwind CSS)
  - JavaScript (ES6+)
  - Font Awesome Icons

- **Backend**:
  - Node.js
  - Express.js
  - SQLite3
  - Body-parser & CORS

- **Styling & Animation**:
  - CSS Grid & Flexbox
  - CSS Animations & Transitions
  - Intersection Observer API
  - Particle Effects

## 📁 Project Structure

```
careerpath/
├── index2.html          # Main landing page
├── login.html           # Login/registration page
├── style.css           # Main stylesheet
├── server.js           # Backend server
├── package.json        # Node.js dependencies
├── README.md           # Project documentation
├── careerpath.db       # SQLite database (auto-generated)
└── assets/             # Static assets (if any)
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- Modern web browser
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-github-username/careerpath.git
   cd careerpath
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or for development with auto-restart
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### For GitHub Pages Deployment

1. Update the repository name in `index2.html` meta tags:
   ```html
   <link rel="canonical" href="https://your-github-username.github.io/careerpath/">
   ```

2. Enable GitHub Pages in repository settings
3. Deploy from `main` branch

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Main landing page |
| `GET` | `/login` | Login page |
| `POST` | `/api/login` | User authentication |
| `POST` | `/api/register` | User registration |
| `GET` | `/api/careers` | Get all careers |
| `POST` | `/api/careers` | Add new career |

## 🗄 Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Careers Table
```sql
CREATE TABLE careers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🎨 Color Scheme

The website uses a professional color palette:

- **Primary**: `#1a365d` (Deep Navy Blue)
- **Secondary**: `#2d3748` (Dark Gray)
- **Accent**: `#3182ce` (Professional Blue)
- **Background**: `#f7fafc` (Light Gray)
- **Text**: `#2d3748` (Dark Gray)

## 📱 Responsive Design

- **Mobile-first approach**
- **Breakpoint-based layouts**
- **Touch-friendly interactions**
- **Optimized performance**

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow consistent code formatting
- Add comments for complex logic
- Test on multiple devices/browsers
- Ensure responsive design
- Maintain performance standards

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**CareerPath Team**
- Project Link: [https://github.com/your-github-username/careerpath](https://github.com/your-github-username.github.io/careerpath)
- Email: info@careerpath.com

## 🙏 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS framework
- [Font Awesome](https://fontawesome.com/) for icons
- [Google Fonts](https://fonts.google.com/) for typography
- [Unsplash](https://unsplash.com/) for stock images
- [Express.js](https://expressjs.com/) for backend framework
- [SQLite3](https://www.sqlite.org/) for database

---

⭐ **Star this repo** if you found it helpful!

**Made with ❤️ for students, by developers**</content>
<parameter name="filePath">c:\Users\DAEREK\OneDrive\Desktop\minor_project\README.md