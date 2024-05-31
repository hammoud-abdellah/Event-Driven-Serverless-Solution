import React, { useState, useEffect } from "react";
import { Todo } from "./Todo";
import { TodoForm } from "./TodoForm";
import { EditTodoForm } from "./EditTodoForm";
import axios from "axios";

const API_URL = 'https://0uqcj6iopd.execute-api.us-east-1.amazonaws.com/prod';

export const TodoWrapper = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    getTodos();
  }, []);
  
  const getTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}/todos`);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async (task) => {
    try {
      const response = await axios.post(`${API_URL}/todos`, { task });
      setTodos([...todos, response.data]);
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const toggleComplete = async (id) => {
    const todo = todos.find((todo) => todo.id === id);
    try {
      const response = await axios.put(`${API_URL}/todos/${id}/complete`, {
        completed: !todo.completed
      });
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, completed: response.data.completed } : todo
        )
      );
    } catch (error) {
      console.error("Error toggling complete:", error);
    }
  };

  const editTodo = async (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
      )
    );
  };

  const editTask = async (task, id) => {
    try {
      const response = await axios.put(`${API_URL}/todos/${id}`, { task });
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, task: response.data.task, isEditing: !todo.isEditing } : todo
        )
      );
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  return (
    <div className="TodoWrapper">
      <h1>Todo App</h1>
      <TodoForm addTodo={addTodo} />
      {/* display todos */}
      {todos.map((todo) =>
        todo.isEditing ? (
          <EditTodoForm editTodo={editTask} task={todo} key={todo.id} />
        ) : (
          <Todo
            key={todo.id}
            task={todo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            toggleComplete={toggleComplete}
          />
        )
      )}
    </div>
  );
};
