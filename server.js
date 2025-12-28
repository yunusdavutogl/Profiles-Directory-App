const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

/**
 * ============================
 * MIDDLEWARE
 * ============================
 */

// Allow ALL origins (no CORS issues)
app.use(cors());

// Allow JSON body parsing
app.use(express.json());

/**
 * ============================
 * MOCK DATA
 * ============================
 */

const profiles = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  age: 20 + (i % 15),
  phone: `+1-555-01${String(i + 1).padStart(2, '0')}`,
  bio: 'Software developer passionate about mobile apps',
}));

/**
 * ============================
 * ROUTES
 * ============================
 */

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Profiles API is running' });
});

// GET /profiles?page=1&limit=10
app.get('/profiles', (req, res) => {
  const page = req.query.page ?  parseInt(req.query.page) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedProfiles = profiles.slice(startIndex, endIndex);

  res.json(paginatedProfiles);
});

// GET /profiles/:id
app.get('/profiles/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const profile = profiles.find(p => p.id === id);

  if (!profile) {
    return res.status(404).json({ message: 'Profile not found' });
  }

  res.json(profile);
});

/**
 * ============================
 * START SERVER
 * ============================
 */

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
