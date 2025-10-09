import React, { useState, useEffect } from 'react';
import ManageBooks from './ManageBooks';

function LibrarianDashboard({ librarian, onLogout }) {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [view, setView] = useState('dashboard'); // 'dashboard' or 'manage'

  useEffect(() => {
    fetch('/api/borrowed')
      .then(res => res.json())
      .then(data => setBorrowedBooks(data));
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

  const calculateFine = (borrowDate) => {
    const now = new Date();
    const borrow = new Date(borrowDate);
    const days = Math.floor((now - borrow) / (1000 * 60 * 60 * 24));
    return days > 5 ? (days - 5) * 10 : 0; // 10 rupees per day after 5 days
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Welcome, {librarian.username}</h2>
        <button onClick={onLogout}>Logout</button>
      </div>
      <nav style={{ marginBottom: '20px' }}>
        <button onClick={() => setView('dashboard')} style={{ marginRight: '10px' }}>Dashboard</button>
        <button onClick={() => setView('manage')}>Manage Books</button>
      </nav>
      {view === 'dashboard' ? (
        <div>
          <h3>Borrowed Books</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Book Title</th>
                <th>Student Hall Ticket</th>
                <th>Borrow Date</th>
                <th>Fine</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {borrowedBooks.map(borrow => (
                <tr key={borrow.id}>
                  <td>{borrow.bookTitle}</td>
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
        </div>
      ) : (
        <ManageBooks />
      )}
    </div>
  );
}

export default LibrarianDashboard;
