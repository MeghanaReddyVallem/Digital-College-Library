import React, { useState, useEffect } from 'react';

function StudentView() {
  const [semester, setSemester] = useState('1');
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);

  useEffect(() => {
    // Fetch books for the selected semester
    fetch(`/api/books?semester=${semester}`)
      .then(res => res.json())
      .then(data => setBooks(data));
  }, [semester]);

  const borrowBook = (bookId, hallTicket) => {
    fetch('/api/borrow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId, hallTicket })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Book borrowed successfully!');
        // Update books list
        setBooks(books.map(book => book.id === bookId ? { ...book, copies: book.copies - 1 } : book));
      } else {
        alert(data.message);
      }
    });
  };

  return (
    <div>
      <h2>Student View</h2>
      <select value={semester} onChange={e => setSemester(e.target.value)}>
        {Array.from({ length: 8 }, (_, i) => (
          <option key={i+1} value={i+1}>Semester {i+1}</option>
        ))}
      </select>
      <div className="grid">
        {books.map(book => (
          <div key={book.id} className="poster" onClick={() => {
            if (book.copies > 0) {
              const hallTicket = prompt('Enter Hall Ticket Number:');
              if (hallTicket) borrowBook(book.id, hallTicket);
            }
          }}>
            <img src={book.cover} alt={book.title} />
            <div className="poster-title">{book.title}</div>
            <div style={{ padding: '10px', backgroundColor: '#000', color: '#e5e5e5' }}>
              <p>Author: {book.author}</p>
              <p>Copies: {book.copies}</p>
              {book.copies > 0 ? (
                <button>Borrow</button>
              ) : (
                <p style={{ color: '#f40612' }}>Out of stock</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentView;
