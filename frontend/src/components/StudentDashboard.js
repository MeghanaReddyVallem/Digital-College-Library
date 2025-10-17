import React, { useState, useEffect } from 'react';

function StudentDashboard({ student, onLogout }) {
  const [year, setYear] = useState('1');
  const [semester, setSemester] = useState('1');
  const [books, setBooks] = useState([]);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contact, setContact] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Fetch books for the selected year and semester
    fetch(`/api/books?year=${year}&semester=${semester}`)
      .then(res => res.json())
      .then(data => setBooks(data));
  }, [year, semester]);

  const borrowBook = (bookId) => {
    fetch('/api/borrow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId, studentId: student.id })
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

  const updateContact = () => {
    fetch('/api/student/contact', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: student.id, contact })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('Contact updated!');
        setShowContactForm(false);
        student.contact = contact;
      } else {
        alert(data.message);
      }
    });
  };

  const filteredBooks = books.filter(book => book.title.toLowerCase().includes(search.toLowerCase()) || book.author.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Student Dashboard</h2>
        <button onClick={onLogout} style={{ backgroundColor: '#e50914', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer' }}>Logout</button>
      </div>
      <p>Welcome, {student.name} {student.hall_ticket}</p>
      {showContactForm && (
        <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#222', borderRadius: '8px' }}>
          <h4>Please provide your contact number to borrow books:</h4>
          <input
            type="text"
            placeholder="Contact Number"
            value={contact}
            onChange={e => setContact(e.target.value)}
            required
          />
          <button onClick={updateContact} style={{ marginLeft: '10px' }}>Update Contact</button>
        </div>
      )}
      <div style={{ marginBottom: '20px' }}>
        <label>Year: </label>
        <select value={year} onChange={e => setYear(e.target.value)}>
          {[1,2,3,4].map(y => (
            <option key={y} value={y}>Year {y}</option>
          ))}
        </select>
        <label style={{ marginLeft: '20px' }}>Semester: </label>
        <select value={semester} onChange={e => setSemester(e.target.value)}>
          {[1,2].map(s => (
            <option key={s} value={s}>Semester {s}</option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by title or author"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '5px', width: '300px' }}
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
        {filteredBooks.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#ccc', fontSize: '18px', gridColumn: '1 / -1' }}>No books found matching your criteria.</p>
        ) : (
          filteredBooks.map(book => (
            <div key={book.id} style={{ backgroundColor: '#222', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.5)', transition: 'all 0.3s ease' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.7), 0 0 20px rgba(255,255,255,0.3)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.5)'; }}>
              <img src={book.cover} alt={book.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }} />
              <h4 style={{ margin: '0 0 5px 0', color: '#e5e5e5' }}>{book.title}</h4>
              <p style={{ margin: '0 0 5px 0', color: '#ccc' }}>by {book.author}</p>
              <p style={{ margin: '0 0 10px 0', color: '#ccc' }}>Year: {book.year} | Semester: {book.semester} | Copies: {book.copies}</p>
              {book.copies > 0 ? (
                <button onClick={() => borrowBook(book.id)} style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Borrow</button>
              ) : (
                <p style={{ color: '#f40612' }}>Out of stock</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
