import React, { useState } from 'react';
import Home from './components/Home';
import Login from './components/Login';
import StudentView from './components/StudentView';
import LibrarianView from './components/LibrarianView';

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'login', 'student', 'librarian'
  const [user, setUser] = useState(null);

  const handleLogoClick = () => {
    setCurrentPage('login');
  };

  const handleLogin = (userType, credentials) => {
    if (userType === 'student') {
      fetch('/api/student/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser({
            type: 'student',
            ...data.student
          });
          setCurrentPage('student');
        } else {
          alert(data.message);
        }
      })
      .catch(err => {
        console.error('Login error:', err);
        alert('Login failed. Please try again.');
      });
    } else {
      fetch('/api/librarian/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser({
            type: 'librarian',
            ...data.librarian
          });
          setCurrentPage('librarian');
        } else {
          alert(data.message);
        }
      })
      .catch(err => {
        console.error('Login error:', err);
        alert('Login failed. Please try again.');
      });
    }
  };

  const handleRegister = (userType, credentials) => {
    if (userType === 'student') {
      fetch('/api/student/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser({
            type: 'student',
            ...data.student
          });
          setCurrentPage('student');
        } else {
          alert(data.message);
        }
      })
      .catch(err => {
        console.error('Registration error:', err);
        alert('Registration failed. Please try again.');
      });
    } else {
      fetch('/api/librarian/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setUser({
            type: 'librarian',
            ...data.librarian
          });
          setCurrentPage('librarian');
        } else {
          alert(data.message);
        }
      })
      .catch(err => {
        console.error('Registration error:', err);
        alert('Registration failed. Please try again.');
      });
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  const handleBack = () => {
    setCurrentPage('home');
  };

  return (
    <div>
      {currentPage === 'home' && <Home onLogoClick={handleLogoClick} />}
      {currentPage === 'login' && <Login onLogin={handleLogin} onRegister={handleRegister} onBack={handleBack} />}
      {currentPage === 'student' && <StudentView user={user} onLogout={handleLogout} />}
      {currentPage === 'librarian' && <LibrarianView user={user} onLogout={handleLogout} />}
    </div>
  );
}

export default App;
