import io from 'socket.io-client';
import {useEffect, useState} from "react";
import { v4 as uuidv4 } from 'uuid';

const App = () => {
  const [socket, setSocket] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  useEffect(() => {
    const socket = io('ws://localhost:8000', { transports: ['websocket'] });
    setSocket(socket);

    socket.on('addTask', task => addTask(task));
    socket.on('removeTask', task => removeTask(task, false));
    socket.on('updateData', existingTasks => updateTasks(existingTasks));

    return () => {
      socket.disconnect();
    };
  }, []);

  const updateTasks = existingTasks => {
    setTasks(existingTasks);
  }

  const removeTask = (task, didICalledIt) => {
    setTasks(tasks => tasks.filter(thisTask => thisTask.id !== task.id));
    if (didICalledIt) socket.emit('removeTask', task);
  }

  const addTask = task => {
    setTasks(tasks => [...tasks, task]);
  }

  const submitForm = (event) => {
    event.preventDefault();
    const newTask = {
      id: uuidv4(),
      name: taskName
    };
    addTask(newTask);
    socket.emit('addTask', newTask);
    setTaskName('');
  };

  return (
    <div className="App">

      <header>
        <h1>ToDoList.app</h1>
      </header>

      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>

        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map(task => <li key={task.id} className="task">{task.name} <button className="btn btn--red" onClick={() => removeTask(task, true)}>Remove</button></li>)}
        </ul>

        <form id="add-task-form" onSubmit={submitForm}>
          <input className="text-input" autoComplete="off" type="text" placeholder="Type your description"
                 id="task-name" value={taskName} onChange={e => setTaskName(e.target.value)}/>
          <button className="btn" type="submit">Add</button>
        </form>

      </section>
    </div>
  );
}

export default App;
