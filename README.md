# 📚 Digital College Library Management System

[![React](https://img.shields.io/badge/React-18.0+-61dafb.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-14+-339933.svg)](https://nodejs.org/)
[![SQLite](https://img.shields.io/badge/SQLite-3.0+-003b57.svg)](https://www.sqlite.org/)
[![Express](https://img.shields.io/badge/Express-4.0+-000000.svg)](https://expressjs.com/)

A comprehensive full-stack web application for managing university library operations. Students can browse, search, and borrow books by academic year and semester, while librarians manage inventory, track borrowings, view analytics, and handle user registrations. Built with React frontend, Node.js/Express backend, and SQLite database for complete data persistence and role-based access control.

## Features

### Student Features
- **Registration and Login**: Students register with hall ticket, name, email, password, and contact number. Login uses hall ticket and password.
- **Book Browsing and Search**: View books filtered by their year and semester. Real-time search by title or author.
- **Borrowing Books**: Borrow available books (copies > 0). Requires contact number for history tracking.
- **Dashboard**: Displays available books in a grid with covers, titles, authors, and details. Borrow button for eligible books.

### Librarian Features
- **Registration and Login**: Librarians register/login with username, email, and password.
- **Book Management**: Full CRUD operations:
  - Add new books with title, author, year, semester, copies, and cover URL.
  - Update existing books.
  - Delete books.
  - Search across all books.
- **Borrowed Books Oversight**: View current borrowings with student details and dates.
- **Return Books**: Process returns, updating copies and history.
- **History Management**: View full borrow history and clear history if needed.
- **Analytics Dashboard**:
  - Total books, students, active borrowings, and history records.
  - Most Borrowed Books: Top 5 books borrowed 4+ times.
  - Low Stock Books: Books with ≤2 copies.
- **Student Management**: Update student contact information.

### General Features
- **Role-Based Access**: App routes users to StudentView or LibrarianView post-login.
- **Data Persistence**: All changes are stored in SQLite and persist across restarts.
- **Error Handling**: API responses include success flags and error messages.
- **Security**: Passwords hashed with bcrypt; unique constraints on emails/hall tickets/usernames.
- **UI/UX**: Dark theme, responsive grid for books, form validation, alerts for errors.

## Technologies Used

### Backend
- **Node.js** with **Express.js**: Server framework for handling HTTP requests and API routes.
- **SQLite3**: Lightweight relational database for storing books, users, borrowing records, and history.
- **bcrypt**: For secure password hashing during user registration and login.
- **cors**: To enable cross-origin resource sharing between frontend and backend.
- **body-parser**: For parsing JSON request bodies.

### Frontend
- **React.js**: For building interactive user interfaces with components.
- **CSS**: Inline and external styles for a dark-themed UI.
- **Fetch API**: For making HTTP requests to the backend.

### Database
- **SQLite**: File-based database (`backend/library.db`) with tables for books, students, librarians, borrowed_books, and borrow_history.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+ recommended)
- npm installed

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/digital-college-library.git
   cd digital-college-library
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm start
   ```
   Server runs on `http://localhost:5000`

3. **Frontend Setup** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm install canvas-confetti
   npm start
   ```
   App opens on `http://localhost:3000`

### Demo Credentials
- **Student**: Hall ticket: `CS001`, Password: `student123`
- **Librarian**: Username: `admin`, Password: `admin123`

## Usage

1. **Student Registration/Login**: Register or login as a student using hall ticket and password.
2. **Browse Books**: Select year and semester, search for books, and borrow available ones.
3. **Librarian Registration/Login**: Register or login as a librarian.
4. **Manage Books**: Add, update, or delete books; view analytics and history.
5. **Borrow/Return**: Librarians can oversee and process returns.

## Project Structure

- `backend/`: Server-side code
  - `server.js`: Main Express server with database initialization and API routes
  - `package.json`: Backend dependencies
- `frontend/`: Client-side code
  - `public/`: Static assets (HTML, images)
  - `src/`: React source code
    - `components/`: Reusable UI components (Login, Dashboard, etc.)
    - `App.js`: Root component with routing
- `database/`: SQLite database files (auto-generated)

## API Endpoints

All endpoints are prefixed with `/api/` and return JSON.

### Books
- `GET /api/books?year=X&semester=Y`: Fetch books (filtered by year/semester)
- `POST /api/books`: Add new book
- `PUT /api/books/:id`: Update book
- `DELETE /api/books/:id`: Delete book

### Borrowing
- `POST /api/borrow`: Borrow book
- `GET /api/borrowed`: List active borrowings
- `POST /api/return/:id`: Return borrowed book

### Authentication
- `POST /api/student/register`: Register student
- `POST /api/student/login`: Login student
- `POST /api/librarian/register`: Register librarian
- `POST /api/librarian/login`: Login librarian

### Other
- `GET /api/history`: Full borrow history
- `DELETE /api/history`: Clear history
- `GET /api/analytics`: Dashboard stats
- `PUT /api/student/contact`: Update student contact
- `DELETE /api/reset`: Reset students and borrowings (for testing)

## 📁 Project Structure

```
digital-college-library/
├── backend/
│   ├── server.js                 # Express server with API routes
│   ├── package.json             # Backend dependencies
│   └── library.db               # SQLite database (auto-generated)
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   ├── background.jpg
│   │   └── librarylogo.jpg
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── StudentDashboard.js
│   │   │   ├── LibrarianDashboard.js
│   │   │   └── ...
│   │   ├── App.js              # Root component
│   │   ├── index.js            # React entry point
│   │   └── index.css           # Global styles
│   └── package.json            # Frontend dependencies
├── .gitignore                  # Git ignore rules
├── README.md                   # Project documentation
└── TODO.md                     # Development notes
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a pull request.

### Ways to Contribute
- 🐛 **Bug Fixes**: Report and fix issues
- ✨ **Features**: Add new functionality
- 📚 **Documentation**: Improve docs and guides
- 🎨 **UI/UX**: Enhance user interface
- 🧪 **Testing**: Add tests and improve reliability

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for educational institutions**
