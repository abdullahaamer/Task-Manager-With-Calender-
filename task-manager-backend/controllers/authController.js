const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.signup = async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = { username, password: hashedPassword };
    db.query('INSERT INTO users SET ?', user, (err, result) => {
      if (err) {
        return res.status(500).send('Error creating user');
      }
      res.status(201).send('User created');
    });
  } catch (err) {
    res.status(500).send('Error creating user');
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) {
      return res.status(500).send('Error fetching user');
    }

    if (results.length === 0) {
      return res.status(400).send('Invalid credentials');
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid credentials');
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  });
};
