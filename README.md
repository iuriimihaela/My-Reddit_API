My-Reddit-API

This is a RESTful API inspired by Reddit, built using **Node.js**, **Express.js** and **PostgreSQL**.

## Prerequisites

Before running the project, ensure you have the following installed on your system:
- **Node.js** (v16 or later)
- **PostgreSQL**
- **Git**

## Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/iuriimihaela/My-Reddit_API.git
   cd my-reddit-api
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```

## Configuring PostgreSQL

1. **Create a PostgreSQL database:**
   ```sql
   CREATE DATABASE my_reddit_db;
   
   CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subscribed_subreddits INTEGER[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   CREATE TABLE subreddits (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   CREATE TABLE threads (
    id SERIAL PRIMARY KEY,
    subreddit_id INTEGER NOT NULL REFERENCES subreddits(id),
    author_id INTEGER NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   ```
2. **Modify `db.js` to include your credentials:**
   
   ```js
   const { Pool } = require('pg');

   const pool = new Pool({
   user: 'your_username',
   host: 'localhost',
   database: 'your_database',
   password: 'your_password',
   port: 5432,
   });

   module.exports = pool;
   ```
## Seeding the Database

To populate the database with sample users, subreddits, and threads:
 1. Run the seed script:
    ```sh
    node seed.js
    ```
 2. Verify the data using a PostgreSQL client (`psql` or any database tool, like `pgAdmin 4`):
    ```sh
    SELECT * FROM users;
    SELECT * FROM subreddits;
    SELECT * FROM threads;
    ```
## Running the Server

Start the API server:
   ```sh
   node index.js
   ```
## Verifying the API

Once the server is running, you can test the API using tools like **Postman** or **cURL**.

Default URL:
   ```sh
    http://localhost:3000
   ```

## All the Endpoints:

### Users
- **GET** `/users` – returns all users.
- **GET** `/users/:user_id` – returns a user by ID.
- **POST** `/users` – creates a new user.
- **PUT** `/users/:user_id` – updates an existing user.
- **DELETE** `/users/:user_id` – deletes a user.
- **POST** `/users` – creates a new user.

### Subreddits
- **GET** `/subreddits` – returns all subreddits.
- **GET** `/subreddits/:subreddit_id` – returns a subreddit by ID.
- **POST** `/subreddits` – creates a new subreddit.
- **PUT** `/subreddits/:subreddit_id` – updates an existing subreddit.
- **DELETE** `/subreddits/:subreddit_id` – deletes a subreddit.
- **POST** `/subscribe/:user_id/:subreddit_id` – subscribes a user to a subreddit (should update the user).

### Threads
- **GET** `/threads` – returns all threads (advanced: filter by query param).
- **GET** `/threads/:thread_id` – returns a thread by ID.
- **POST** `/threads/:subreddit_id` – creates a new thread in a specific subreddit.
- **PUT** `/threads/:thread_id` – updates an existing thread.
- **DELETE** `/threads/:thread_id` – deletes a thread.



