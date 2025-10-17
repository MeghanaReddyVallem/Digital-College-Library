import React, { useState, useEffect } from 'react';
import ManageBooks from './ManageBooks';

function LibrarianDashboard({ librarian, onLogout }) {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [history, setHistory] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [view, setView] = useState('borrowed'); // 'borrowed', 'manage', 'history'
  const [historyYear, setHistoryYear] = useState('');

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
    return days > 1 ? (days - 1) * 10 : 0; // 10 rupees per day after 1 day
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Welcome, {librarian.username}</h2>
        <button onClick={onLogout}>Logout</button>
      </div>
      <nav style={{ marginBottom: '20px' }}>
        <button onClick={() => setView('borrowed')} style={{ marginRight: '10px' }}>Borrowed Books</button>
        <button onClick={() => setView('manage')} style={{ marginRight: '10px' }}>Manage Books</button>
        <button onClick={() => setView('history')}>History</button>
      </nav>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', border: '1px solid #444' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#fff' }}>📚 Total Books</h4>
          <p style={{ fontSize: '28px', color: '#4caf50', fontWeight: 'bold' }}>{analytics.totalBooks || 0}</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', border: '1px solid #444' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#fff' }}>👥 Total Students</h4>
          <p style={{ fontSize: '28px', color: '#2196f3', fontWeight: 'bold' }}>{analytics.totalStudents || 0}</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', border: '1px solid #444' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#fff' }}>📖 Currently Borrowed</h4>
          <p style={{ fontSize: '28px', color: '#ff9800', fontWeight: 'bold' }}>{analytics.totalBorrowed || 0}</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', border: '1px solid #444' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#fff' }}>🔄 Total Transactions</h4>
          <p style={{ fontSize: '28px', color: '#e91e63', fontWeight: 'bold' }}>{analytics.totalHistory || 0}</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', border: '1px solid #444' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#fff' }}>🏆 Most Borrowed Books</h4>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px', color: '#ccc' }}>
            {analytics.mostBorrowed && analytics.mostBorrowed.map((book, index) => (
              <li key={index}>{book.bookTitle} ({book.borrowCount})</li>
            ))}
          </ul>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)', padding: '20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.5)', border: '1px solid #444' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#fff' }}>⚠️ Low Stock Books</h4>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px', color: '#ccc' }}>
            {analytics.lowStock && analytics.lowStock.map((book, index) => (
              <li key={index}>{book.title} ({book.copies})</li>
            ))}
          </ul>
        </div>
      </div>
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
  );
}

export default LibrarianDashboard;
