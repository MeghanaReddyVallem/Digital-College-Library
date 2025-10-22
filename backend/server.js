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
    year INTEGER NOT NULL,
    semester INTEGER NOT NULL,
    copies INTEGER NOT NULL,
    cover TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS borrowed_books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    borrow_date TEXT NOT NULL,
    FOREIGN KEY(book_id) REFERENCES books(id),
    FOREIGN KEY(student_id) REFERENCES students(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    hall_ticket TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    contact TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS borrow_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    borrow_date TEXT NOT NULL,
    return_date TEXT,
    contact TEXT,
    FOREIGN KEY(book_id) REFERENCES books(id),
    FOREIGN KEY(student_id) REFERENCES students(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS librarians (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS student_login_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    login_date TEXT NOT NULL,
    FOREIGN KEY(student_id) REFERENCES students(id)
  )`);

  // Alter tables to add new columns
  db.run(`ALTER TABLE books ADD COLUMN year INTEGER DEFAULT 1`, (err) => {
    if (err && !err.message.includes('duplicate column')) console.error(err);
  });
  db.run(`ALTER TABLE students ADD COLUMN contact TEXT`, (err) => {
    if (err && !err.message.includes('duplicate column')) console.error(err);
  });
  db.run(`ALTER TABLE students ADD COLUMN year INTEGER`, (err) => {
    if (err && !err.message.includes('duplicate column')) console.error(err);
  });
  db.run(`ALTER TABLE students ADD COLUMN semester INTEGER`, (err) => {
    if (err && !err.message.includes('duplicate column')) console.error(err);
  });
  db.run(`ALTER TABLE borrow_history ADD COLUMN contact TEXT`, (err) => {
    if (err && !err.message.includes('duplicate column')) console.error(err);
  });

  // Insert sample books if table is empty
  db.get('SELECT COUNT(*) as count FROM books', [], (err, row) => {
    if (err) console.error(err);
    if (row.count === 0) {
      const sampleBooks = [
        { title: 'Physics', author: 'Cormen', year: 1, semester: 1, copies: 5, cover: 'https://via.placeholder.com/200x300?text=Physics' },
        { title: 'Data Structures', author: 'Sedgewick', year: 1, semester: 2, copies: 3, cover: 'https://via.placeholder.com/200x300?text=Data+Structures' },
        { title: 'Database System Concepts', author: 'Silberschatz', year: 2, semester: 1, copies: 4, cover: 'https://via.placeholder.com/200x300?text=Database' },
        { title: 'Operating Systems', author: 'Tanenbaum', year: 2, semester: 2, copies: 2, cover: 'https://via.placeholder.com/200x300?text=OS' },
        { title: 'Computer Networks', author: 'Kurose', year: 3, semester: 1, copies: 3, cover: 'https://via.placeholder.com/200x300?text=Networks' },
        { title: 'Software Engineering', author: 'Pressman', year: 3, semester: 2, copies: 4, cover: 'https://via.placeholder.com/200x300?text=Software+Eng' },
        { title: 'Artificial Intelligence', author: 'Russell', year: 4, semester: 1, copies: 2, cover: 'https://via.placeholder.com/200x300?text=AI' },
        { title: 'Machine Learning', author: 'Mitchell', year: 4, semester: 2, copies: 3, cover: 'https://via.placeholder.com/200x300?text=ML' }
      ];
      sampleBooks.forEach(book => {
        db.run('INSERT INTO books (title, author, year, semester, copies, cover) VALUES (?, ?, ?, ?, ?, ?)', [book.title, book.author, book.year, book.semester, book.copies, book.cover]);
      });
    }
  });

  // No sample students inserted - users must register first
});

// API routes

// Get books by year, semester or all
app.get('/api/books', (req, res) => {
  const { year, semester } = req.query;
  let sql = 'SELECT * FROM books';
  let params = [];
  if (year) {
    sql += ' WHERE year = ?';
    params.push(year);
  }
  if (semester) {
    sql += (params.length ? ' AND' : ' WHERE') + ' semester = ?';
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
  const { title, author, year, semester, copies, cover } = req.body;
  const sql = 'INSERT INTO books (title, author, year, semester, copies, cover) VALUES (?, ?, ?, ?, ?, ?)';
  db.run(sql, [title, author, year, semester, copies, cover], function(err) {
    if (err) {
      res.status(500).json({ success: false, message: err.message });
    } else {
      res.json({ success: true, book: { id: this.lastID, title, author, year, semester, copies, cover } });
    }
  });
});

// Update a book
app.put('/api/books/:id', (req, res) => {
  const id = req.params.id;
  const { title, author, year, semester, copies, cover } = req.body;
  const sql = 'UPDATE books SET title = ?, author = ?, year = ?, semester = ?, copies = ?, cover = ? WHERE id = ?';
  db.run(sql, [title, author, year, semester, copies, cover, id], function(err) {
    if (err) {
      res.status(500).json({ success: false, message: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ success: false, message: 'Book not found' });
    } else {
      res.json({ success: true });
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
  const { bookId, studentId } = req.body;
  if (!studentId) {
    return res.status(400).json({ success: false, message: 'Student ID is required' });
  }
  db.get('SELECT id, contact FROM students WHERE id = ?', [studentId], (err, student) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (!student) return res.status(400).json({ success: false, message: 'Invalid student' });
    if (!student.contact) return res.status(400).json({ success: false, message: 'Contact number required' });
    db.get('SELECT copies FROM books WHERE id = ?', [bookId], (err, book) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      if (!book) return res.status(404).json({ success: false, message: 'Book not found' });
      if (book.copies < 1) return res.status(400).json({ success: false, message: 'No copies available' });
      const borrowDate = new Date().toISOString().split('T')[0];
      db.run('INSERT INTO borrowed_books (book_id, student_id, borrow_date) VALUES (?, ?, ?)', [bookId, studentId, borrowDate], function(err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        db.run('INSERT INTO borrow_history (book_id, student_id, borrow_date, contact) VALUES (?, ?, ?, ?)', [bookId, studentId, borrowDate, student.contact], function(err) {
          if (err) return res.status(500).json({ success: false, message: err.message });
          db.run('UPDATE books SET copies = copies - 1 WHERE id = ?', [bookId], function(err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({ success: true });
          });
        });
      });
    });
  });
});

// Get borrowed books with book title
app.get('/api/borrowed', (req, res) => {
  const sql = `SELECT bb.id, b.title as bookTitle, s.name as studentName, s.hall_ticket as hallTicket, DATE(bb.borrow_date) as borrowDate
               FROM borrowed_books bb
               JOIN books b ON bb.book_id = b.id
               JOIN students s ON bb.student_id = s.id`;
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
  db.get('SELECT book_id, student_id, borrow_date FROM borrowed_books WHERE id = ?', [borrowId], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    if (!row) {
      return res.status(404).json({ success: false, message: 'Borrow record not found' });
    }
    const { book_id, student_id, borrow_date } = row;
    const returnDate = new Date().toISOString().split('T')[0];
    db.run('UPDATE borrow_history SET return_date = ? WHERE book_id = ? AND student_id = ? AND borrow_date = ? AND return_date IS NULL', [returnDate, book_id, student_id, borrow_date], function(err) {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
      db.run('DELETE FROM borrowed_books WHERE id = ?', [borrowId], function(err) {
        if (err) {
          return res.status(500).json({ success: false, message: err.message });
        }
        db.run('UPDATE books SET copies = copies + 1 WHERE id = ?', [book_id], function(err) {
          if (err) {
            return res.status(500).json({ success: false, message: err.message });
          }
          res.json({ success: true });
        });
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

// Student register
app.post('/api/student/register', (req, res) => {
  const { hallTicket, name, email, password, contact } = req.body;
  if (!hallTicket || !name || !email || !password || !contact) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    const sql = 'INSERT INTO students (hall_ticket, name, email, password, contact) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [hallTicket, name, email, hash, contact], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ success: false, message: 'Hall ticket or email already exists' });
        }
        return res.status(500).json({ success: false, message: err.message });
      }
      res.json({ success: true, student: { id: this.lastID, hall_ticket: hallTicket, name, email, contact } });
    });
  });
});

// Student login
app.post('/api/student/login', (req, res) => {
  const { hallTicket, password } = req.body;
  if (!hallTicket || !password) {
    return res.status(400).json({ success: false, message: 'Hall ticket and password are required' });
  }
  const sql = 'SELECT * FROM students WHERE hall_ticket = ?';
  db.get(sql, [hallTicket], (err, student) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    if (!student) {
      return res.status(400).json({ success: false, message: 'Invalid hall ticket or password' });
    }
    bcrypt.compare(password, student.password, (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
      if (!result) {
        return res.status(400).json({ success: false, message: 'Invalid hall ticket or password' });
      }
      // Record login history
      const loginDate = new Date().toISOString();
      db.run('INSERT INTO student_login_history (student_id, login_date) VALUES (?, ?)', [student.id, loginDate], function(err) {
        if (err) {
          console.error('Error recording login history:', err.message);
        }
        res.json({ success: true, student: { id: student.id, hall_ticket: student.hall_ticket, name: student.name, email: student.email, contact: student.contact } });
      });
    });
  });
});

// History
app.get('/api/history', (req, res) => {
  const sql = `SELECT bh.id, b.title as bookTitle, b.year as bookYear, s.name as studentName, s.hall_ticket as hallTicket, bh.borrow_date as borrowDate, bh.return_date as returnDate, bh.contact as contact
               FROM borrow_history bh
               JOIN books b ON bh.book_id = b.id
               JOIN students s ON bh.student_id = s.id
               ORDER BY bh.borrow_date DESC`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ success: false, message: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Clear history
app.delete('/api/history', (req, res) => {
  db.run('DELETE FROM borrow_history', [], function(err) {
    if (err) res.status(500).json({ success: false, message: err.message });
    else res.json({ success: true });
  });
});

// Analytics
app.get('/api/analytics', (req, res) => {
  db.get('SELECT COUNT(*) as totalBooks FROM books', [], (err, booksRow) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    db.get('SELECT COUNT(*) as totalStudents FROM students', [], (err, studentsRow) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      db.get('SELECT COUNT(*) as totalBorrowed FROM borrowed_books', [], (err, borrowedRow) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        db.get('SELECT COUNT(*) as totalHistory FROM borrow_history WHERE return_date IS NOT NULL', [], (err, historyRow) => {
          if (err) return res.status(500).json({ success: false, message: err.message });
          db.all('SELECT b.title as bookTitle, COUNT(bh.book_id) as borrowCount FROM borrow_history bh JOIN books b ON bh.book_id = b.id GROUP BY bh.book_id HAVING borrowCount >= 4 ORDER BY borrowCount DESC LIMIT 5', [], (err, mostBorrowed) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            db.all('SELECT title, copies FROM books WHERE copies <= 2', [], (err, lowStock) => {
              if (err) return res.status(500).json({ success: false, message: err.message });
              res.json({
                totalBooks: booksRow.totalBooks,
                totalStudents: studentsRow.totalStudents,
                totalBorrowed: borrowedRow.totalBorrowed,
                totalHistory: historyRow.totalHistory,
                mostBorrowed,
                lowStock
              });
            });
          });
        });
      });
    });
  });
});

// Update student contact
app.put('/api/student/contact', (req, res) => {
  const { studentId, contact } = req.body;
  if (!studentId || !contact) {
    return res.status(400).json({ success: false, message: 'Student ID and contact are required' });
  }
  db.run('UPDATE students SET contact = ? WHERE id = ?', [contact, studentId], function(err) {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true });
  });
});

// Reset all data
app.delete('/api/reset', (req, res) => {
  db.run('DELETE FROM borrow_history', [], (err) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    db.run('DELETE FROM borrowed_books', [], (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      db.run('DELETE FROM student_login_history', [], (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        db.run('DELETE FROM students', [], (err) => {
          if (err) return res.status(500).json({ success: false, message: err.message });
          res.json({ success: true });
        });
      });
    });
  });
});

// Get student login history
app.get('/api/student/login-history', (req, res) => {
  const sql = `SELECT slh.id, s.name as studentName, s.hall_ticket as hallTicket, slh.login_date as loginDate
               FROM student_login_history slh
               JOIN students s ON slh.student_id = s.id
               ORDER BY slh.login_date DESC`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ success: false, message: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
