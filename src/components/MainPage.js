import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MainPage() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAlphabetical, setSortAlphabetical] = useState(false);
  const navigate = useNavigate();

  const API_URL = 'http://localhost:3001/todos';

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTodo.trim(),
          completed: false,
        }),
      });
      
      const todo = await response.json();
      setTodos([...todos, todo]);
      setNewTodo('');
    } catch (error) {
      console.error('Ошибка добавления:', error);
    }
  };

  const toggleComplete = async (todo) => {
    try {
      const response = await fetch(`${API_URL}/${todo.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      
      const updatedTodo = await response.json();
      setTodos(todos.map(t => t.id === todo.id ? updatedTodo : t));
    } catch (error) {
      console.error('Ошибка обновления:', error);
    }
  };

  const handleTaskClick = (id) => {
    navigate(`/task/${id}`);
  };

  const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const filteredAndSortedTodos = todos
    .filter(todo => 
      todo.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortAlphabetical) {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  return (
    <div className="container">
      <h1>Управление задачами</h1>
      
      <div className="controls">
        <form onSubmit={addTodo} className="add-form">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Введите новую задачу..."
            className="todo-input"
          />
          <button type="submit" className="add-button">
            Добавить
          </button>
        </form>

        <div className="search-sort-controls">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Поиск задач..."
            className="search-input"
          />
          
          <button
            onClick={() => setSortAlphabetical(!sortAlphabetical)}
            className={`sort-button ${sortAlphabetical ? 'active' : ''}`}
          >
            {sortAlphabetical ? 'Сортировка: Вкл' : 'Сортировка: Выкл'}
          </button>
        </div>
      </div>

      <div className="todo-list">
        {filteredAndSortedTodos.length === 0 ? (
          <div className="empty-state">
            {searchTerm ? 'Задачи не найдены' : 'Список задач пуст'}
          </div>
        ) : (
          filteredAndSortedTodos.map(todo => (
            <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <div className="todo-checkbox">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo)}
                />
              </div>
              
              <div 
                className="todo-content clickable"
                onClick={() => handleTaskClick(todo.id)}
              >
                <div className="todo-text">
                  {truncateText(todo.title)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MainPage;