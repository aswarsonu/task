const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const db = new sqlite3.Database('users.db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create a users table in the database
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
  )
`);

// Handle user registration
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Registration failed.' });
    }

    res.json({ message: 'Registration successful.' });
  });
});

// Handle user login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Login failed.' });
    }

    if (row) {
      return res.json({ message: 'Login successful.' });
    } else {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
