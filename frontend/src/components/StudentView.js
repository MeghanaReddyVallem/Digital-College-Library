import React from 'react';
import StudentDashboard from './StudentDashboard';

function StudentView({ user, onLogout }) {
  return (
    <div style={{ padding: '20px' }}>
      <StudentDashboard student={user} onLogout={onLogout} />
    </div>
  );
}

export default StudentView;
