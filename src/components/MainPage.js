import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  loadTodos,
  addTodo,
  toggleComplete,
  setSearchTerm,
  toggleSort
} from '../redux/actions';

function MainPage() {
  const [newTodo, setNewTodo] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  
  const { items: todos, loading: todosLoading, error } = useSelector(state => state.todos);
  const { searchTerm, sortAlphabetical } = useSelector(state => state.filters);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(loadTodos());
  }, [dispatch]);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    setAddLoading(true);
    try {
      await dispatch(addTodo(newTodo));
      setNewTodo('');
    } catch (error) {
      // Ошибка уже обработана в action
    } finally {
      setAddLoading(false);
    }
  };

  const handleTaskClick = (id) => {
    console.log('Navigating to task with id:', id);
    navigate(`/task/${id}`);
  };

  const handleSearchChange = (term) => {
    dispatch(setSearchTerm(term));
  };

  const handleToggleSort = () => {
    dispatch(toggleSort());
  };

  const handleRetry = () => {
    dispatch(loadTodos());
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

  if (todosLoading && todos.length === 0) {
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
          <div>{error}</div>
          <button onClick={handleRetry} className="retry-button">
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
            disabled={addLoading || todosLoading}
          />
          <button 
            type="submit" 
            className="add-button"
            disabled={addLoading || todosLoading}
          >
            {addLoading ? 'Добавление...' : 'Добавить'}
          </button>
        </form>

        <div className="search-sort-controls">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Поиск задач..."
            className="search-input"
          />
          
          <button
            onClick={handleToggleSort}
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
                  onChange={() => dispatch(toggleComplete(todo))}
                  disabled={todosLoading}
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