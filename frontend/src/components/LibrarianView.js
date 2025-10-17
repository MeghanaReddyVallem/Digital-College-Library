import React from 'react';
import LibrarianDashboard from './LibrarianDashboard';

function LibrarianView({ user, onLogout }) {
  return (
    <div style={{ padding: '20px' }}>
      <LibrarianDashboard librarian={user} onLogout={onLogout} />
    </div>
  );
}

export default LibrarianView;
