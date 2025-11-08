import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTodo } from '../context/TodoContext';

function MainPage() {
  const [newTodo, setNewTodo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAlphabetical, setSortAlphabetical] = useState(false);
  
  const { todos, loading, error, addTodo, toggleComplete } = useTodo();
  const navigate = useNavigate();

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    const todo = await addTodo(newTodo);
    if (todo) {
      setNewTodo('');
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

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Загрузка задач...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Управление задачами</h1>
      
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => window.location.reload()} className="retry-button">
            Повторить
          </button>
        </div>
      )}
      
      <div className="controls">
        <form onSubmit={handleAddTodo} className="add-form">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Введите новую задачу..."
            className="todo-input"
            disabled={loading}
          />
          <button 
            type="submit" 
            className="add-button"
            disabled={loading}
          >
            {loading ? 'Добавление...' : 'Добавить'}
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
                  disabled={loading}
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