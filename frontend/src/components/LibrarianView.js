import React, { useState } from 'react';
import LibrarianLogin from './LibrarianLogin';
import LibrarianDashboard from './LibrarianDashboard';

function LibrarianView() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [librarian, setLibrarian] = useState(null);

  const handleLogin = (librarianData) => {
    setLibrarian(librarianData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLibrarian(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      {isLoggedIn ? (
        <LibrarianDashboard librarian={librarian} onLogout={handleLogout} />
      ) : (
        <LibrarianLogin onLogin={handleLogin} />
      )}
    </div>
  );
}

export default LibrarianView;
