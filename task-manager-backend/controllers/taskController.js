const db = require('../config/db');

exports.getTasks = (req, res) => {
  const userId = req.user.id;

  db.query('SELECT * FROM tasks WHERE user_id = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500).send('Error fetching tasks');
    }
    res.status(200).json(results);
  });
};

exports.createTask = (req, res) => {
  const { title, description, due_date } = req.body;
  const userId = req.user.id;

  const task = { title, description, due_date, user_id: userId };
  db.query('INSERT INTO tasks SET ?', task, (err, result) => {
    if (err) {
      return res.status(500).send('Error creating task');
    }
    res.status(201).send('Task created');
  });
};

exports.updateTask = (req, res) => {
  const { title, description, due_date } = req.body;
  const taskId = req.params.id;
  const userId = req.user.id;

  db.query(
    'UPDATE tasks SET title = ?, description = ?, due_date = ? WHERE id = ? AND user_id = ?',
    [title, description, due_date, taskId, userId],
    (err, result) => {
      if (err) {
        return res.status(500).send('Error updating task');
      }
      res.status(200).send('Task updated');
    }
  );
};

exports.deleteTask = (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;

  db.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId], (err, result) => {
    if (err) {
      return res.status(500).send('Error deleting task');
    }
    res.status(200).send('Task deleted');
  });
};
