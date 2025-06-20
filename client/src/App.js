import io from 'socket.io-client';
import {useEffect, useState} from "react";

const App = () => {
  const [socket, setSocket] = useState();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const socket = io('ws://localhost:8000', { transports: ['websocket'] });
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  const removeTask = id => {
    setTasks(tasks => tasks.filter(task => task.id !== id));
  }

  return (
    <div className="App">

      <header>
        <h1>ToDoList.app</h1>
      </header>

      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>

        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map(task => <li className="task">{task.name} <button className="btn btn--red" onClick={() => removeTask(task.id)}>Remove</button></li>)}
        </ul>

        <form id="add-task-form">
          <input className="text-input" autoComplete="off" type="text" placeholder="Type your description"
                 id="task-name"/>
          <button className="btn" type="submit">Add</button>
        </form>

      </section>
    </div>
  );
}

export default App;
