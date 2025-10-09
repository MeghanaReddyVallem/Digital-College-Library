import React, { useState } from 'react';
import StudentView from './components/StudentView';
import LibrarianView from './components/LibrarianView';

function App() {
  const [view, setView] = useState('student'); // 'student' or 'librarian'

  return (
    <div>
      <header className="netflix-header">
        <h1>Digital College Library</h1>
        <nav>
          <button onClick={() => setView('student')} style={{ marginRight: '10px' }}>
            Student View
          </button>
          <button onClick={() => setView('librarian')}>Librarian View</button>
        </nav>
      </header>
      <main className="container">
        {view === 'student' ? <StudentView /> : <LibrarianView />}
      </main>
    </div>
  );
}

export default App;
