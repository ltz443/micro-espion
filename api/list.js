// /api/list.js

const express = require('express');
const router = express.Router();
const { Octokit } = require('@octokit/rest');

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

// Fetch recordings from GitHub
router.get('/', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const response = await octokit.rest.repos.listCommits({
      owner: 'ltz443',
      repo: 'micro-espion',
      per_page: limit,
      page: page,
    });

    const recordings = response.data;

    res.json({
      page,
      limit,
      total: response.headers['x-total-count'],
      recordings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch recordings' });
  }
});

module.exports = router;