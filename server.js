const express = require('express');
const socket = require('socket.io');

const app = express();

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

const tasks = [];

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);
  socket.emit('updateData', tasks);

  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });
  socket.on('removeTask', (task) => {
    const tasksArrayIndex = tasks.findIndex((i) => {
      return i.id === task.id;
    })
    tasks.splice(tasksArrayIndex, 1);
    socket.broadcast.emit('removeTask', task);
  });
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

