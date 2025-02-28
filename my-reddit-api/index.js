const express = require('express');
const pool = require('./db'); 

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
  const { username, email, subscribed_subreddits } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO users (username, email, subscribed_subreddits)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [username, email, subscribed_subreddits || []]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /users/:user_id
app.put('/users/:user_id', async (req, res) => {
  const userId = parseInt(req.params.user_id, 10);
  const { username, email, subscribed_subreddits } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users
         SET username = $1,
             email = $2,
             subscribed_subreddits = $3,
             updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [username, email, subscribed_subreddits || [], userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE /users/:user_id
app.delete('/users/:user_id', async (req, res) => {
  const userId = parseInt(req.params.user_id, 10);
  try {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [userId]
    );
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

// GET /subreddits/:subreddit_id
app.get('/subreddits/:subreddit_id', async (req, res) => {
  const subredditId = parseInt(req.params.subreddit_id, 10);
  try {
    const result = await pool.query('SELECT * FROM subreddits WHERE id = $1', [subredditId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subreddit not found' });
    }
    res.json(result.rows[0]);
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

// PUT /subreddits/:subreddit_id
app.put('/subreddits/:subreddit_id', async (req, res) => {
  const subredditId = parseInt(req.params.subreddit_id, 10);
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      `UPDATE subreddits SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *`,
      [name, description, subredditId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subreddit not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE /subreddits/:subreddit_id
app.delete('/subreddits/:subreddit_id', async (req, res) => {
  const subredditId = parseInt(req.params.subreddit_id, 10);
  try {
    const result = await pool.query('DELETE FROM subreddits WHERE id = $1 RETURNING *', [subredditId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subreddit not found' });
    }
    res.json(result.rows[0]);
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

// GET /threads/:thread_id
app.get('/threads/:thread_id', async (req, res) => {
  const threadId = parseInt(req.params.thread_id, 10);
  try {
    const result = await pool.query('SELECT * FROM threads WHERE id = $1', [threadId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Thread not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST /threads/:subreddit_id
app.post('/threads/:subreddit_id', async (req, res) => {
  const subredditId = parseInt(req.params.subreddit_id, 10);
  const { author_id, title, content } = req.body;
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

// PUT /threads/:thread_id
app.put('/threads/:thread_id', async (req, res) => {
  const threadId = parseInt(req.params.thread_id, 10);
  const { title, content } = req.body;
  try {
    const result = await pool.query(
      `UPDATE threads SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *`,
      [title, content, threadId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Thread not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE /threads/:thread_id
app.delete('/threads/:thread_id', async (req, res) => {
  const threadId = parseInt(req.params.thread_id, 10);
  try {
    const result = await pool.query('DELETE FROM threads WHERE id = $1 RETURNING *', [threadId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Thread not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
