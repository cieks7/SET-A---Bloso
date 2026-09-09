import React, { useState } from "react";
import "./App.css";

function App() {
  const [taskName, setTaskName] = useState("");
  const [priorityLevel, setPriorityLevel] = useState(1);
  const [subTaskInput, setSubTaskInput] = useState("");
  const [subTasks, setSubTasks] = useState([]);
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(0);

  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);

  const [errors, setErrors] = useState({});

  const addSubTask = () => {
    if (subTaskInput.trim() !== "") {
      setSubTasks([...subTasks, subTaskInput.trim()]);
      setSubTaskInput("");
    }
  };

  const removeSubTask = (index) => {
    setSubTasks(subTasks.filter((_, i) => i !== index));
  };

  const validate = () => {
    const newErrors = {};

    if (!taskName || taskName.trim() === "") {
      newErrors.taskName = "Task name is required.";
    } else if (taskName.trim().length < 5) {
      // Field Length Validation
      newErrors.taskName = "Task name must be at least 5 characters.";
    }
    const duplicate = tasks.find(
      (t) =>
        t.taskName.trim().toLowerCase() === taskName.trim().toLowerCase() &&
        t.id !== editId
    );
    if (taskName.trim() !== "" && duplicate) {
      newErrors.taskName = "Task name already exists. Please use a unique name.";
    }
    const validPriorities = Array.from({ length: 10 }, (_, i) => i + 1);
    if (!validPriorities.includes(Number(priorityLevel))) {
      newErrors.priorityLevel = "Priority level should be at least 1 and max of 10.";
    }

    if (subTasks.length < 1) {
      newErrors.subTasks = "You need to have at least 1 sub task.";
    }

    if (!description || description.trim() === "") {
      newErrors.description = "Task description should not be empty.";
    } else if (description.trim().length < 3) {
      newErrors.description = "Task description must have at least 3 characters.";
    }

    if (!duration || duration < 60) {
      newErrors.duration = "Task duration should be a minimum of 1 hour (60 minutes).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateUniqueId = () => {
    return `TASK-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  };

  const resetForm = () => {
    setTaskName("");
    setPriorityLevel(1);
    setSubTaskInput("");
    setSubTasks([]);
    setDescription("");
    setDuration(0);
    setEditId(null);
    setErrors({});
  };

  const handleRegister = () => {
    if (!validate()) return;

    if (editId !== null) {

      setTasks(
        tasks.map((t) =>
          t.id === editId
            ? {
                ...t,
                taskName,
                priorityLevel: Number(priorityLevel),
                subTasks,
                description,
                duration: Number(duration),
              }
            : t
        )
      );
    } else {
      // Create new task
      const newTask = {
        id: generateUniqueId(),
        taskName,
        priorityLevel: Number(priorityLevel),
        subTasks,
        description,
        duration: Number(duration),
      };
      setTasks([...tasks, newTask]);
    }

    resetForm();
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
    if (editId === id) resetForm();
  };

  const handleEdit = (task) => {
    setEditId(task.id);
    setTaskName(task.taskName);
    setPriorityLevel(task.priorityLevel);
    setSubTasks(task.subTasks);
    setDescription(task.description);
    setDuration(task.duration);
  };

  const getPriorityLabel = (level) => {
    if (level <= 3) return "NOT IMPORTANT";
    if (level >= 4 && level <= 7) return "STANDARD";
    if (level >= 8 && level <= 10) return "IMPORTANT";
    return "";
  };

  const getDurationLabel = (minutes) => {
    const hours = minutes / 60;
    return hours > 24 ? "LONG TASK" : "SHORT TASK";
  };

  return (
    <div className="container">
      <h1>MY SCHEDULED TASKS</h1>
      <hr />

      <h2>{editId !== null ? "Update Task" : "Create a Task"}</h2>
      <div className="form">
        <div className="form-row">
          <label>Enter Task Name:</label>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          {errors.taskName && <p className="error">{errors.taskName}</p>}
        </div>

        <div className="form-row">
          <label>Enter Priority Level:</label>
          <select
            value={priorityLevel}
            onChange={(e) => setPriorityLevel(e.target.value)}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          {errors.priorityLevel && <p className="error">{errors.priorityLevel}</p>}
        </div>

        <div className="form-row">
          <label>Enter Sub Task:</label>
          <input
            type="text"
            value={subTaskInput}
            onChange={(e) => setSubTaskInput(e.target.value)}
          />
          <button type="button" onClick={addSubTask}>
            Add Sub Task
          </button>
          {errors.subTasks && <p className="error">{errors.subTasks}</p>}
          {subTasks.length > 0 && (
            <ul>
              {subTasks.map((st, index) => (
                <li key={index}>
                  {st}{" "}
                  <button type="button" onClick={() => removeSubTask(index)}>
                    x
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="form-row">
          <label>Enter Task Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && <p className="error">{errors.description}</p>}
        </div>

        <div className="form-row">
          <label>Enter Task Duration in minutes:</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          {errors.duration && <p className="error">{errors.duration}</p>}
        </div>

        <button type="button" onClick={handleRegister}>
          {editId !== null ? "UPDATE" : "REGISTER"}
        </button>
        {editId !== null && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </div>

      <hr />
      <h2>List of My Tasks</h2>

      {tasks.length === 0 && <p>No tasks yet.</p>}

      {tasks.map((task, index) => (
        <div className="task-card" key={task.id}>
          <p>
            {index + 1}. {task.taskName}{" "}
            <small>(ID: {task.id})</small>
          </p>
          <p>{getPriorityLabel(task.priorityLevel)}</p>
          <p>SUB TASKS:</p>
          <ul>
            {task.subTasks.map((st, i) => (
              <li key={i}>{st}</li>
            ))}
          </ul>
          <p>{task.description}</p>
          <p>
            {(task.duration / 60).toFixed(1)} hours : {getDurationLabel(task.duration)}
          </p>
          <button type="button" onClick={() => handleEdit(task)}>
            Update
          </button>
          <button type="button" onClick={() => handleDelete(task.id)}>
            Delete
          </button>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;