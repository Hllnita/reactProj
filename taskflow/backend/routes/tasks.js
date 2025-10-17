const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// Get all tasks
router.get('/', async (req, res) => {
  const {q, completed, priority} = req.query;
  let filter = {user: req.user.id };
  if (q) {
    filter.title = { $regex: q, $options: 'i' };
  }
  if (completed) {
    filter.completed = completed === 'true';
  }
  if (priority) {
    filter.priority = priority;
  }
  const tasks = await Task.find(filter);
  res.json(tasks);
});

//get Single task
router.get('/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);
  res.json(task);
});

router.put('/toggle/:id', async (req, res) => {
  req.body.updatedAt = Date.now();
  const task = await Task.findById(req.params.id);
  task.completed = !task.completed;
  await task.save();
  res.json(task);
});

// Create task
router.post('/', async (req, res) => {
  const task = new Task(req.body);
  await task.save();
  res.json(task);
});

// Update task
router.put('/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});

// Delete task
router.delete('/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
});

module.exports = router;
