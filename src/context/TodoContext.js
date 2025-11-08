import React, { createContext, useState, useContext, useEffect } from 'react';

const TodoContext = createContext();

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo должен использоваться внутри TodoProvider');
  }
  return context;
};

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:3001/todos';

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTodos(data);
      setError(null);
    } catch (error) {
      setError('Ошибка загрузки задач');
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (title) => {
    if (!title.trim()) return null;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          completed: false,
        }),
      });
      
      const newTodo = await response.json();
      setTodos(prev => [...prev, newTodo]);
      setError(null);
      return newTodo;
    } catch (error) {
      setError('Ошибка добавления задачи');
      console.error('Ошибка добавления:', error);
      return null;
    }
  };

  const updateTodo = async (id, updates) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      const updatedTodo = await response.json();
      setTodos(prev => prev.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
      setError(null);
      return updatedTodo;
    } catch (error) {
      setError('Ошибка обновления задачи');
      console.error('Ошибка обновления:', error);
      return null;
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      setTodos(prev => prev.filter(todo => todo.id !== id));
      setError(null);
      return true;
    } catch (error) {
      setError('Ошибка удаления задачи');
      console.error('Ошибка удаления:', error);
      return false;
    }
  };

  const toggleComplete = async (todo) => {
    return await updateTodo(todo.id, { completed: !todo.completed });
  };

  const value = {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    refetchTodos: fetchTodos
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};