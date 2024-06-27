"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Todo } from '../types';

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    fetch('/api/todo')
      .then(response => response.json())
      .then(data => setTodos(data));
  }, []);

  const addTodo = async (todo: string) => {
    const newTodoItem: Todo = {
      id: String(Date.now()),
      todo,
      isCompleted: false,
      createdAt: new Date().toISOString(),
    };
    await fetch('/api/todo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodoItem),
    });
    setTodos([...todos, newTodoItem]);
  };

  const updateTodo = async (id: string, updatedTodo: Todo) => {
    await fetch(`/api/todo/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTodo),
    });
    setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
  };

  const deleteTodo = async (id: string) => {
    await fetch(`/api/todo/${id}`, {
      method: 'DELETE',
    });
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) {
      alert('Todo cannot be empty');
      return;
    }
    if (todos.some(todo => todo.todo.toLowerCase() === newTodo.toLowerCase())) {
      alert('Todo already exists');
      return;
    }
    if (editingTodo) {
      updateTodo(editingTodo.id, { ...editingTodo, todo: newTodo });
      setEditingTodo(null);
    } else {
      addTodo(newTodo);
    }
    setNewTodo('');
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setNewTodo(todo.todo);
  };

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const filteredTodos = todos.filter(todo =>
    todo.todo.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <input
        type="text"
        value={filter}
        onChange={handleFilterChange}
        placeholder="Filter todos..."
        className="block w-full max-w-md p-2 mx-auto border border-gray-300 rounded"
      />
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new todo..."
          className="block w-full max-w-md p-2 mx-auto border border-gray-300 rounded"
        />
      </form>
      {filteredTodos.length ? (
        <ul className="mt-4">
          {filteredTodos.map(todo => (
            <li key={todo.id} className="flex items-center justify-between p-2 mt-2 bg-white border border-gray-300 rounded">
              <span className={`${todo.isCompleted ? 'line-through' : ''}`}>
                {todo.todo}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => updateTodo(todo.id, { ...todo, isCompleted: !todo.isCompleted })}
                  className="mark text-green-600 hover:underline"
                >
                  {todo.isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                </button>
                <button onClick={() => handleEdit(todo)} className="edit text-blue-600 hover:underline">
                  Edit
                </button>
                <button onClick={() => deleteTodo(todo.id)} className="remove text-red-600 hover:underline">
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-center">No result. Create a new one instead!</p>
      )}
    </div>
  );
}


