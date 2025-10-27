import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAlphabetical, setSortAlphabetical] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

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

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Ошибка удаления:', error);
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
      setTodos(todos.map(todo => 
        todo.id === id ? updatedTodo : todo
      ));
    } catch (error) {
      console.error('Ошибка обновления:', error);
    }
  };

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditingText(todo.title);
  };

  const saveEdit = async (id) => {
    if (!editingText.trim()) return;
    
    await updateTodo(id, { title: editingText.trim() });
    setEditingId(null);
    setEditingText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const toggleComplete = async (todo) => {
    await updateTodo(todo.id, { completed: !todo.completed });
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
    <div className="app">
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
                
                <div className="todo-content">
                  {editingId === todo.id ? (
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="edit-input"
                      autoFocus
                    />
                  ) : (
                    <div className="todo-text">{todo.title}</div>
                  )}
                </div>

                <div className="todo-actions">
                  {editingId === todo.id ? (
                    <>
                      <button 
                        onClick={() => saveEdit(todo.id)}
                        className="save-button"
                      >
                        Сохранить
                      </button>
                      <button 
                        onClick={cancelEdit}
                        className="cancel-button"
                      >
                        Отмена
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => startEditing(todo)}
                        className="edit-button"
                      >
                        Изменить
                      </button>
                      <button 
                        onClick={() => deleteTodo(todo.id)}
                        className="delete-button"
                      >
                        Удалить
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;