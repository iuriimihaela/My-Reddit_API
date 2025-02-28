const express = require('express');
const pool = require('./db'); // Importă conexiunea la PostgreSQL

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// ----------------------- USERS -----------------------
// GET /users
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /users/:user_id
app.get('/users/:user_id', async (req, res) => {
  const userId = parseInt(req.params.user_id, 10);
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /users
app.post('/users', async (req, res) => {
  const { username, email } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *`,
      [username, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE /users/:user_id
app.delete('/users/:user_id', async (req, res) => {
  const userId = parseInt(req.params.user_id, 10);
  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// ----------------------- SUBREDDITS -----------------------
// GET /subreddits
app.get('/subreddits', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM subreddits');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /subreddits
app.post('/subreddits', async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO subreddits (name, description) VALUES ($1, $2) RETURNING *`,
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// ----------------------- THREADS -----------------------
// GET /threads
app.get('/threads', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM threads');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /threads/:subreddit_id
app.post('/threads/:subreddit_id', async (req, res) => {
  const { title, content, author_id } = req.body;
  const subredditId = parseInt(req.params.subreddit_id, 10);
  try {
    const result = await pool.query(
      `INSERT INTO threads (subreddit_id, author_id, title, content) VALUES ($1, $2, $3, $4) RETURNING *`,
      [subredditId, author_id, title, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
