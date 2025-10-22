import React, { useState, useEffect } from 'react';

function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', year: 1, semester: 1, copies: 1, cover: '' });
  const [editingBook, setEditingBook] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/books')
      .then(res => res.json())
      .then(data => setBooks(data || []));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBook) {
      updateBook();
    } else {
      addBook();
    }
  };

  const addBook = () => {
    fetch('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBook)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setBooks([...books, data.book]);
        resetForm();
      } else {
        alert(data.message);
      }
    });
  };

  const updateBook = () => {
    fetch(`/api/books/${editingBook.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBook)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setBooks(books.map(book => book.id === editingBook.id ? { ...book, ...newBook } : book));
        resetForm();
      } else {
        alert(data.message);
      }
    });
  };

  const resetForm = () => {
    setNewBook({ title: '', author: '', year: 1, semester: 1, copies: 1, cover: '' });
    setEditingBook(null);
  };

  const editBook = (book) => {
    setEditingBook(book);
    setNewBook({ title: book.title, author: book.author, year: book.year, semester: book.semester, copies: book.copies, cover: book.cover_url || book.cover });
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

  const filteredBooks = books.filter(book => book.title.toLowerCase().includes(search.toLowerCase()) || book.author.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <h3 style={{ textAlign: 'center' }}>Manage Books</h3>
      <form onSubmit={handleSubmit} style={{ marginBottom: '30px', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <input
            type="text"
            placeholder="Title"
            value={newBook.title}
            onChange={e => setNewBook({ ...newBook, title: e.target.value })}
            required
            style={{ width: '300px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input
            type="text"
            placeholder="Author"
            value={newBook.author}
            onChange={e => setNewBook({ ...newBook, author: e.target.value })}
            required
            style={{ width: '300px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <select
            value={newBook.year}
            onChange={e => setNewBook({ ...newBook, year: parseInt(e.target.value) })}
            style={{ width: '300px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            {[1,2,3,4].map(year => (
              <option key={year} value={year}>Year {year}</option>
            ))}
          </select>
          <select
            value={newBook.semester}
            onChange={e => setNewBook({ ...newBook, semester: parseInt(e.target.value) })}
            style={{ width: '300px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            {[1,2].map(semester => (
              <option key={semester} value={semester}>Semester {semester}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Copies"
            value={newBook.copies}
            onChange={e => setNewBook({ ...newBook, copies: parseInt(e.target.value) })}
            min="1"
            required
            style={{ width: '300px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input
            type="url"
            placeholder="Cover URL"
            value={newBook.cover}
            onChange={e => setNewBook({ ...newBook, cover: e.target.value })}
            required
            style={{ width: '300px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <div style={{ marginTop: '20px' }}>
            <button type="submit">{editingBook ? 'Update Book' : 'Add Book'}</button>
            {editingBook && <button type="button" onClick={resetForm} style={{ marginLeft: '10px' }}>Cancel</button>}
          </div>
        </div>
      </form>
      <h4>Existing Books</h4>
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
        {filteredBooks.map(book => (
          <div key={book.id} style={{ backgroundColor: '#222', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
            <img src={book.cover_url || book.cover} alt={book.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }} />
            <h4 style={{ margin: '0 0 5px 0', color: '#e5e5e5' }}>{book.title}</h4>
            <p style={{ margin: '0 0 5px 0', color: '#ccc' }}>by {book.author}</p>
            <p style={{ margin: '0 0 10px 0', color: '#ccc' }}>Year: {book.year} | Semester: {book.semester} | Copies: {book.copies}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => editBook(book)} style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>✏️</button>
              <button onClick={() => deleteBook(book.id)} style={{ backgroundColor: '#f40612', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageBooks;
