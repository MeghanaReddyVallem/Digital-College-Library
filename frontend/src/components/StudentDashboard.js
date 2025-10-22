import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

function StudentDashboard({ student, onLogout }) {
  const [year, setYear] = useState('1');
  const [semester, setSemester] = useState('1');
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Fetch books for the selected year and semester
    fetch(`/api/books?year=${year}&semester=${semester}`)
      .then(res => res.json())
      .then(data => setBooks(data || []));
  }, [year, semester]);

  const borrowBook = (bookId) => {
    fetch('/api/borrow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId: bookId, studentId: student.id })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // Trigger confetti blast
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        // Show custom success message
        const messageDiv = document.createElement('div');
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '20px';
        messageDiv.style.left = '50%';
        messageDiv.style.transform = 'translateX(-50%)';
        messageDiv.style.backgroundColor = '#4caf50';
        messageDiv.style.color = 'white';
        messageDiv.style.padding = '15px 25px';
        messageDiv.style.borderRadius = '8px';
        messageDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        messageDiv.style.zIndex = '1000';
        messageDiv.style.fontSize = '16px';
        messageDiv.style.fontWeight = 'bold';
        messageDiv.innerText = '🎉 Book borrowed successfully! Happy reading! 📚';

        document.body.appendChild(messageDiv);

        // Remove the message after 3 seconds
        setTimeout(() => {
          document.body.removeChild(messageDiv);
        }, 3000);

        // Refresh books list to show updated copies
        fetch(`/api/books?year=${year}&semester=${semester}`)
          .then(res => res.json())
          .then(data => setBooks(data || []));
      } else {
        // Show custom error message
        const messageDiv = document.createElement('div');
        messageDiv.style.position = 'fixed';
        messageDiv.style.top = '20px';
        messageDiv.style.left = '50%';
        messageDiv.style.transform = 'translateX(-50%)';
        messageDiv.style.backgroundColor = '#f44336';
        messageDiv.style.color = 'white';
        messageDiv.style.padding = '15px 25px';
        messageDiv.style.borderRadius = '8px';
        messageDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        messageDiv.style.zIndex = '1000';
        messageDiv.style.fontSize = '16px';
        messageDiv.style.fontWeight = 'bold';
        messageDiv.innerText = data.message;

        document.body.appendChild(messageDiv);

        // Remove the message after 3 seconds
        setTimeout(() => {
          document.body.removeChild(messageDiv);
        }, 3000);
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
      <p style={{
        fontSize: '18px',
        fontWeight: 'bold',
        background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textShadow: '0 0 10px rgba(255, 255, 255, 0.5)',
        marginBottom: '20px'
      }}>Welcome, {student.name} ({student.hall_ticket})</p>

      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <label style={{ marginRight: '10px' }}>Year: </label>
        <select value={year} onChange={e => setYear(e.target.value)}>
          {[1,2,3,4].map(y => (
            <option key={y} value={y}>Year {y}</option>
          ))}
        </select>
        <label style={{ marginLeft: '20px', marginRight: '10px' }}>Semester: </label>
        <select value={semester} onChange={e => setSemester(e.target.value)}>
          {[1,2].map(s => (
            <option key={s} value={s}>Semester {s}</option>
          ))}
        </select>
      </div>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <input
          type="text"
          placeholder="Search by title or author"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '5px', width: '300px' }}
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {filteredBooks.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#bbb', fontSize: '20px', fontStyle: 'italic', gridColumn: '1 / -1', marginTop: '50px' }}>No books found matching your criteria.</p>
        ) : (
          filteredBooks.map(book => (
            <div key={book.id} style={{
              background: 'linear-gradient(135deg, #333 0%, #222 100%)',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)',
              transition: 'all 0.4s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px) scale(1.03)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.8), 0 0 30px rgba(0,123,255,0.3), 0 0 0 1px rgba(255,255,255,0.2)';
              const overlay = e.currentTarget.querySelector('.galaxy-overlay');
              if (overlay) overlay.style.opacity = '1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)';
              const overlay = e.currentTarget.querySelector('.galaxy-overlay');
              if (overlay) overlay.style.opacity = '0';
            }}>
              <div className="galaxy-overlay" style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(0,123,255,0.1) 0%, transparent 70%)',
                animation: 'galaxyGlow 4s ease-in-out infinite alternate',
                opacity: '0',
                transition: 'opacity 0.4s ease',
                pointerEvents: 'none'
              }}></div>
              <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                height: '4px',
                background: 'linear-gradient(90deg, #007bff, #28a745, #ffc107, #dc3545)',
                borderRadius: '12px 12px 0 0'
              }}></div>
              <img src={book.cover_url || book.cover} alt={book.title} style={{
                width: '100%',
                height: '180px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: '15px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
              }} />
              <h4 style={{
                margin: '0 0 8px 0',
                color: '#fff',
                fontSize: '18px',
                fontWeight: 'bold',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                lineHeight: '1.3'
              }}>{book.title}</h4>
              <p style={{
                margin: '0 0 8px 0',
                color: '#ddd',
                fontSize: '14px',
                fontStyle: 'italic'
              }}>by {book.author}</p>
              <p style={{
                margin: '0 0 15px 0',
                color: '#bbb',
                fontSize: '13px',
                fontWeight: '500'
              }}>Year: {book.year} | Semester: {book.semester} | Copies: {book.copies}</p>
              {book.copies > 0 ? (
                <button onClick={() => borrowBook(book.id)} style={{
                  background: 'linear-gradient(45deg, #007bff, #0056b3)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'background 0.3s ease',
                  width: '100%'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(45deg, #0056b3, #004085)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(45deg, #007bff, #0056b3)'}
                >Borrow</button>
              ) : (
                <p style={{
                  color: '#ff6b6b',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  textAlign: 'center',
                  margin: '10px 0'
                }}>Out of stock</p>
              )}
            </div>
          ))
        )}
      </div>
      <style>
        {`
          @keyframes galaxyGlow {
            0% { opacity: 0.3; transform: scale(1); }
            100% { opacity: 0.7; transform: scale(1.1); }
          }
        `}
      </style>
    </div>
  );
}

export default StudentDashboard;
