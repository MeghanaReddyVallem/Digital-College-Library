import React, { useState, useEffect } from 'react';

function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', semester: 1, copies: 1, cover: '' });

  useEffect(() => {
    fetch('/api/books')
      .then(res => res.json())
      .then(data => setBooks(data));
  }, []);

  const addBook = (e) => {
    e.preventDefault();
    fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBook)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setBooks([...books, data.book]);
        setNewBook({ title: '', author: '', semester: 1, copies: 1, cover: '' });
      } else {
        alert(data.message);
      }
    });
  };

  const deleteBook = (id) => {
    fetch(`/api/books/${id}`, { method: 'DELETE' })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setBooks(books.filter(book => book.id !== id));
      } else {
        alert(data.message);
      }
    });
  };

  return (
    <div>
      <h3>Manage Books</h3>
      <form onSubmit={addBook} style={{ marginBottom: '30px' }}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Title"
            value={newBook.title}
            onChange={e => setNewBook({ ...newBook, title: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Author"
            value={newBook.author}
            onChange={e => setNewBook({ ...newBook, author: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <select
            value={newBook.semester}
            onChange={e => setNewBook({ ...newBook, semester: parseInt(e.target.value) })}
          >
            {Array.from({ length: 8 }, (_, i) => (
              <option key={i+1} value={i+1}>Semester {i+1}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <input
            type="number"
            placeholder="Copies"
            value={newBook.copies}
            onChange={e => setNewBook({ ...newBook, copies: parseInt(e.target.value) })}
            min="1"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="url"
            placeholder="Cover URL"
            value={newBook.cover}
            onChange={e => setNewBook({ ...newBook, cover: e.target.value })}
            required
          />
        </div>
        <button type="submit">Add Book</button>
      </form>
      <h4>Existing Books</h4>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
        {books.map(book => (
          <div key={book.id} style={{ backgroundColor: '#222', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
            <img src={book.cover} alt={book.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }} />
            <h4 style={{ margin: '0 0 5px 0', color: '#e5e5e5' }}>{book.title}</h4>
            <p style={{ margin: '0 0 5px 0', color: '#ccc' }}>by {book.author}</p>
            <p style={{ margin: '0 0 10px 0', color: '#ccc' }}>Semester: {book.semester} | Copies: {book.copies}</p>
            <button onClick={() => deleteBook(book.id)} style={{ backgroundColor: '#f40612', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageBooks;
