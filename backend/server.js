const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Initialize SQLite database
const db = new sqlite3.Database(path.join(__dirname, 'library.db'), (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Create tables if not exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    semester INTEGER NOT NULL,
    copies INTEGER NOT NULL,
    cover TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS borrowed_books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL,
    hall_ticket TEXT NOT NULL,
    borrow_date TEXT NOT NULL,
    FOREIGN KEY(book_id) REFERENCES books(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS librarians (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`);

  // Insert sample books if table is empty
  db.get('SELECT COUNT(*) as count FROM books', [], (err, row) => {
    if (err) console.error(err);
    if (row.count === 0) {
      const sampleBooks = [
        { title: 'Physics', author: 'Cormen', semester: 1, copies: 5, cover: 'https://unsplash.com/s/photos/physics-book' },
        { title: 'Data Structures', author: 'Sedgewick', semester: 2, copies: 3, cover: 'https://via.placeholder.com/200x300?text=Data+Structures' },
        { title: 'Database System Concepts', author: 'Silberschatz', semester: 3, copies: 4, cover: 'https://via.placeholder.com/200x300?text=Database' },
        { title: 'Operating Systems', author: 'Tanenbaum', semester: 4, copies: 2, cover: 'https://via.placeholder.com/200x300?text=OS' },
        { title: 'Computer Networks', author: 'Kurose', semester: 5, copies: 3, cover: 'https://via.placeholder.com/200x300?text=Networks' },
        { title: 'Software Engineering', author: 'Pressman', semester: 6, copies: 4, cover: 'https://via.placeholder.com/200x300?text=Software+Eng' },
        { title: 'Artificial Intelligence', author: 'Russell', semester: 7, copies: 2, cover: 'https://via.placeholder.com/200x300?text=AI' },
        { title: 'Machine Learning', author: 'Mitchell', semester: 8, copies: 3, cover: 'https://via.placeholder.com/200x300?text=ML' }
      ];
      sampleBooks.forEach(book => {
        db.run('INSERT INTO books (title, author, semester, copies, cover) VALUES (?, ?, ?, ?, ?)', [book.title, book.author, book.semester, book.copies, book.cover]);
      });
    }
  });
});

// API routes

// Get books by semester or all
app.get('/api/books', (req, res) => {
  const semester = req.query.semester;
  let sql = 'SELECT * FROM books';
  let params = [];
  if (semester) {
    sql += ' WHERE semester = ?';
    params.push(semester);
  }
  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(500).json({ success: false, message: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Add a new book
app.post('/api/books', (req, res) => {
  const { title, author, semester, copies, cover } = req.body;
  const sql = 'INSERT INTO books (title, author, semester, copies, cover) VALUES (?, ?, ?, ?, ?)';
  db.run(sql, [title, author, semester, copies, cover], function(err) {
    if (err) {
      res.status(500).json({ success: false, message: err.message });
    } else {
      res.json({ success: true, book: { id: this.lastID, title, author, semester, copies, cover } });
    }
  });
});

// Delete a book
app.delete('/api/books/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM books WHERE id = ?';
  db.run(sql, [id], function(err) {
    if (err) {
      res.status(500).json({ success: false, message: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ success: false, message: 'Book not found' });
    } else {
      res.json({ success: true });
    }
  });
});

// Borrow a book
app.post('/api/borrow', (req, res) => {
  const { bookId, hallTicket } = req.body;
  if (!hallTicket || hallTicket.trim() === '') {
    return res.status(400).json({ success: false, message: 'Hall ticket is required' });
  }
  db.get('SELECT copies FROM books WHERE id = ?', [bookId], (err, book) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    if (book.copies < 1) {
      return res.status(400).json({ success: false, message: 'No copies available' });
    }
    const borrowDate = new Date().toISOString().split('T')[0];
    db.run('INSERT INTO borrowed_books (book_id, hall_ticket, borrow_date) VALUES (?, ?, ?)', [bookId, hallTicket, borrowDate], function(err) {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
      db.run('UPDATE books SET copies = copies - 1 WHERE id = ?', [bookId], function(err) {
        if (err) {
          return res.status(500).json({ success: false, message: err.message });
        }
        res.json({ success: true });
      });
    });
  });
});

// Get borrowed books with book title
app.get('/api/borrowed', (req, res) => {
  const sql = `SELECT bb.id, b.title as bookTitle, bb.hall_ticket as hallTicket, bb.borrow_date as borrowDate
               FROM borrowed_books bb
               JOIN books b ON bb.book_id = b.id`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ success: false, message: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Return a book
app.post('/api/return/:id', (req, res) => {
  const borrowId = req.params.id;
  db.get('SELECT book_id FROM borrowed_books WHERE id = ?', [borrowId], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    if (!row) {
      return res.status(404).json({ success: false, message: 'Borrow record not found' });
    }
    const bookId = row.book_id;
    db.run('DELETE FROM borrowed_books WHERE id = ?', [borrowId], function(err) {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
      db.run('UPDATE books SET copies = copies + 1 WHERE id = ?', [bookId], function(err) {
        if (err) {
          return res.status(500).json({ success: false, message: err.message });
        }
        res.json({ success: true });
      });
    });
  });
});

// Librarian register
app.post('/api/librarian/register', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    const sql = 'INSERT INTO librarians (username, email, password) VALUES (?, ?, ?)';
    db.run(sql, [username, email, hash], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ success: false, message: 'Username or email already exists' });
        }
        return res.status(500).json({ success: false, message: err.message });
      }
      res.json({ success: true, librarian: { id: this.lastID, username, email } });
    });
  });
});

// Librarian login
app.post('/api/librarian/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }
  const sql = 'SELECT * FROM librarians WHERE username = ?';
  db.get(sql, [username], (err, librarian) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    if (!librarian) {
      return res.status(400).json({ success: false, message: 'Invalid username or password' });
    }
    bcrypt.compare(password, librarian.password, (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
      if (!result) {
        return res.status(400).json({ success: false, message: 'Invalid username or password' });
      }
      res.json({ success: true, librarian: { id: librarian.id, username: librarian.username, email: librarian.email } });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
