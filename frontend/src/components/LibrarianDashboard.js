import React, { useState, useEffect } from 'react';
import ManageBooks from './ManageBooks';

function LibrarianDashboard({ librarian, onLogout }) {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [history, setHistory] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [view, setView] = useState('borrowed'); // 'borrowed', 'manage', 'history'
  const [historyYear, setHistoryYear] = useState('');
  const [showTabs, setShowTabs] = useState(false);


  useEffect(() => {
    fetch('/api/borrowed')
      .then(res => res.json())
      .then(data => setBorrowedBooks(data));
    fetch('/api/history')
      .then(res => res.json())
      .then(data => setHistory(data));
    fetch('/api/analytics')
      .then(res => res.json())
      .then(data => setAnalytics(data));
  }, []);

  const returnBook = (borrowId) => {
    fetch(`/api/return/${borrowId}`, { method: 'POST' })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Book returned successfully!');
        setBorrowedBooks(borrowedBooks.filter(b => b.id !== borrowId));
        // Refetch analytics to update total transactions
        fetch('/api/analytics')
          .then(res => res.json())
          .then(data => setAnalytics(data));
      } else {
        alert(data.message);
      }
    });
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      fetch('/api/history', { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setHistory([]);
          alert('History cleared!');
        } else {
          alert(data.message);
        }
      });
    }
  };

  const resetData = () => {
    if (window.confirm('Are you sure you want to reset all data? This will delete all students, history, and borrowed books.')) {
      fetch('/api/reset', { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setBorrowedBooks([]);
          setHistory([]);
          setAnalytics({});
          alert('Data reset successfully!');
        } else {
          alert(data.message);
        }
      });
    }
  };

  const calculateFine = (borrowDate) => {
    const now = new Date();
    const borrow = new Date(borrowDate);
    const days = Math.floor((now - borrow) / (1000 * 60 * 60 * 24));
    return days > 0 ? days * 10 : 0; // 10 rupees per day after 1 day
  };

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <div style={{
        position: 'fixed',
        top: 0,
        left: showTabs ? '0' : '-250px',
        width: '250px',
        height: '100vh',
        backgroundColor: '#1a1a1a',
        transition: 'left 0.3s ease',
        zIndex: 10,
        borderRight: '1px solid #444'
      }}>
        <div style={{
          padding: '20px',
          paddingTop: '120px'
        }}>
          <button
            onClick={() => setView('borrowed')}
            style={{
              display: 'block',
              width: '100%',
              padding: '15px',
              marginBottom: '10px',
              backgroundColor: view === 'borrowed' ? '#007bff' : '#333',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            📖 Borrowed Books
          </button>
          <button
            onClick={() => setView('manage')}
            style={{
              display: 'block',
              width: '100%',
              padding: '15px',
              marginBottom: '10px',
              backgroundColor: view === 'manage' ? '#28a745' : '#333',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            📚 Manage Books
          </button>
          <button
            onClick={() => setView('history')}
            style={{
              display: 'block',
              width: '100%',
              padding: '15px',
              marginBottom: '10px',
              backgroundColor: view === 'history' ? '#ffc107' : '#333',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            📜 History
          </button>
        </div>
      </div>
      <div style={{
        position: 'fixed',
        top: '20px',
        left: showTabs ? '270px' : '20px',
        transition: 'left 0.3s ease',
        zIndex: 20
      }}>
        <img
          src="/librarylogo.jpg"
          alt="Library Logo"
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            cursor: 'pointer',
            border: '2px solid #e50914',
            boxShadow: '0 0 15px rgba(229, 9, 20, 0.3)'
          }}
          onClick={() => setShowTabs(!showTabs)}
        />
      </div>
      <div style={{
        marginLeft: showTabs ? '250px' : '0',
        transition: 'marginLeft 0.3s ease',
        padding: '20px',
        paddingTop: '120px',
        height: '100vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 0 15px rgba(255, 255, 255, 0.7)',
            marginBottom: '10px'
          }}>Welcome, {librarian.username}</h2>
          <button onClick={onLogout}>Logout</button>
        </div>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5), 0 0 30px rgba(76, 175, 80, 0.3), inset 0 0 30px rgba(76, 175, 80, 0.1)',
          border: '1px solid #444',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(76, 175, 80, 0.1) 0%, transparent 70%)',
            animation: 'galaxyGlow 4s ease-in-out infinite alternate',
            opacity: '0.5',
            pointerEvents: 'none'
          }}></div>
          <h4 style={{ margin: '0 0 10px 0', color: '#fff' }}>📚 Total Books</h4>
          <p style={{ fontSize: '28px', color: '#4caf50', fontWeight: 'bold' }}>{analytics.totalBooks || 0}</p>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5), 0 0 30px rgba(33, 150, 243, 0.3), inset 0 0 30px rgba(33, 150, 243, 0.1)',
          border: '1px solid #444',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(33, 150, 243, 0.1) 0%, transparent 70%)',
            animation: 'galaxyGlow 4s ease-in-out infinite alternate',
            opacity: '0.5',
            pointerEvents: 'none'
          }}></div>
          <h4 style={{ margin: '0 0 10px 0', color: '#fff' }}>👥 Total Students</h4>
          <p style={{ fontSize: '28px', color: '#2196f3', fontWeight: 'bold' }}>{analytics.totalStudents || 0}</p>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5), 0 0 30px rgba(255, 152, 0, 0.3), inset 0 0 30px rgba(255, 152, 0, 0.1)',
          border: '1px solid #444',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255, 152, 0, 0.1) 0%, transparent 70%)',
            animation: 'galaxyGlow 4s ease-in-out infinite alternate',
            opacity: '0.5',
            pointerEvents: 'none'
          }}></div>
          <h4 style={{ margin: '0 0 10px 0', color: '#fff' }}>📖 Currently Borrowed</h4>
          <p style={{ fontSize: '28px', color: '#ff9800', fontWeight: 'bold' }}>{analytics.totalBorrowed || 0}</p>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5), 0 0 30px rgba(233, 30, 99, 0.3), inset 0 0 30px rgba(233, 30, 99, 0.1)',
          border: '1px solid #444',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(233, 30, 99, 0.1) 0%, transparent 70%)',
            animation: 'galaxyGlow 4s ease-in-out infinite alternate',
            opacity: '0.5',
            pointerEvents: 'none'
          }}></div>
          <h4 style={{ margin: '0 0 10px 0', color: '#fff' }}>🔄 Total Transactions</h4>
          <p style={{ fontSize: '28px', color: '#e91e63', fontWeight: 'bold' }}>{analytics.totalHistory || 0}</p>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5), 0 0 30px rgba(156, 39, 176, 0.3), inset 0 0 30px rgba(156, 39, 176, 0.1)',
          border: '1px solid #444',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(156, 39, 176, 0.1) 0%, transparent 70%)',
            animation: 'galaxyGlow 4s ease-in-out infinite alternate',
            opacity: '0.5',
            pointerEvents: 'none'
          }}></div>
          <h4 style={{ margin: '0 0 10px 0', color: '#fff' }}>🏆 Most Borrowed Books</h4>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px', color: '#ccc' }}>
            {analytics.mostBorrowed && analytics.mostBorrowed.map((book, index) => (
              <li key={index}>{book.bookTitle} ({book.borrowCount})</li>
            ))}
          </ul>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5), 0 0 30px rgba(255, 193, 7, 0.3), inset 0 0 30px rgba(255, 193, 7, 0.1)',
          border: '1px solid #444',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(255, 193, 7, 0.1) 0%, transparent 70%)',
            animation: 'galaxyGlow 4s ease-in-out infinite alternate',
            opacity: '0.5',
            pointerEvents: 'none'
          }}></div>
          <h4 style={{ margin: '0 0 10px 0', color: '#fff' }}>⚠️ Low Stock Books</h4>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px', color: '#ccc' }}>
            {analytics.lowStock && analytics.lowStock.map((book, index) => (
              <li key={index}>{book.title} ({book.copies})</li>
            ))}
          </ul>
        </div>
      </div>
      <style>
        {`
          @keyframes galaxyGlow {
            0% { opacity: 0.3; transform: scale(1); }
            100% { opacity: 0.7; transform: scale(1.1); }
          }
        `}
      </style>
      {view === 'borrowed' ? (
        <div>
          <h3>Currently Borrowed Books</h3>
          {borrowedBooks.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#ccc', fontSize: '18px' }}>No books are currently borrowed.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Book Title</th>
                  <th>Student Name</th>
                  <th>Hall Ticket</th>
                  <th>Borrow Date</th>
                  <th>Fine</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {borrowedBooks.map(borrow => (
                  <tr key={borrow.id}>
                    <td>{borrow.bookTitle}</td>
                    <td>{borrow.studentName}</td>
                    <td>{borrow.hallTicket}</td>
                    <td>{borrow.borrowDate}</td>
                    <td style={{ color: calculateFine(borrow.borrowDate) > 0 ? '#f40612' : '#4caf50' }}>
                      {calculateFine(borrow.borrowDate)} Rs
                    </td>
                    <td><button onClick={() => returnBook(borrow.id)}>Return</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : view === 'manage' ? (
        <ManageBooks />
      ) : (
        <div>
          <h3>Borrow/Return History</h3>
          <div style={{ marginBottom: '10px' }}>
            <label>Filter by Year: </label>
            <select value={historyYear} onChange={(e) => setHistoryYear(e.target.value)}>
              <option value="">All Years</option>
              <option value="1">Year 1</option>
              <option value="2">Year 2</option>
              <option value="3">Year 3</option>
              <option value="4">Year 4</option>
            </select>
            <button onClick={clearHistory} style={{ marginLeft: '10px', backgroundColor: '#f40612', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Clear History</button>
            <button onClick={resetData} style={{ marginLeft: '10px', backgroundColor: '#ff9800', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Reset All Data</button>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Student Name</th>
                <th>Hall Ticket</th>
                <th>Contact</th>
                <th>Borrow Date</th>
                <th>Return Date</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const filteredHistory = history.filter(record => !historyYear || record.bookYear === parseInt(historyYear));
                return filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: '#ccc' }}>No history records found.</td>
                  </tr>
                ) : (
                  filteredHistory.map(record => (
                    <tr key={record.id}>
                      <td>{record.bookTitle}</td>
                      <td>{record.studentName}</td>
                      <td>{record.hallTicket}</td>
                      <td>{record.contact}</td>
                      <td>{record.borrowDate}</td>
                      <td style={{ color: record.returnDate ? '#4caf50' : '#f44336' }}>{record.returnDate || 'Not returned'}</td>
                    </tr>
                  ))
                );
              })()}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </div>
  );
}

export default LibrarianDashboard;
