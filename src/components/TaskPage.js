import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTodo } from '../context/TodoContext';

function TaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { todos, updateTodo, deleteTodo, toggleComplete, error } = useTodo();
  
  const [todo, setTodo] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const foundTodo = todos.find(t => t.id === parseInt(id));
    if (foundTodo) {
      setTodo(foundTodo);
      setEditText(foundTodo.title);
    } else {
      navigate('/404');
    }
  }, [id, todos, navigate]);

  const handleSaveEdit = async () => {
    if (!editText.trim()) return;
    
    setLoading(true);
    const success = await updateTodo(todo.id, { title: editText.trim() });
    if (success) {
      setEditing(false);
    }
    setLoading(false);
  };

  const handleCancelEdit = () => {
    setEditText(todo.title);
    setEditing(false);
  };

  const handleToggleComplete = async () => {
    setLoading(true);
    await toggleComplete(todo);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      setLoading(true);
      const success = await deleteTodo(todo.id);
      if (success) {
        navigate('/');
      }
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!todo) {
    return (
      <div className="container">
        <div className="loading">Загрузка задачи...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="task-header">
        <button onClick={handleBack} className="back-button">
          ← Назад
        </button>
        <h1>Задача #{id}</h1>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="task-details">
        <div className="task-status">
          <label className="status-label">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={handleToggleComplete}
              className="status-checkbox"
              disabled={loading}
            />
            <span className="status-text">
              {todo.completed ? 'Выполнена' : 'Не выполнена'}
            </span>
          </label>
        </div>

        <div className="task-content">
          <h2>Описание задачи:</h2>
          {editing ? (
            <div className="edit-section">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="edit-textarea"
                rows="4"
                disabled={loading}
              />
              <div className="edit-actions">
                <button 
                  onClick={handleSaveEdit} 
                  className="save-button"
                  disabled={loading}
                >
                  {loading ? 'Сохранение...' : 'Сохранить'}
                </button>
                <button 
                  onClick={handleCancelEdit}
                  className="cancel-button"
                  disabled={loading}
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <div className="task-text">
              <p>{todo.title}</p>
              <button 
                onClick={() => setEditing(true)}
                className="edit-button"
                disabled={loading}
              >
                Редактировать
              </button>
            </div>
          )}
        </div>

        <div className="task-actions">
          <button 
            onClick={handleDelete} 
            className="delete-button"
            disabled={loading}
          >
            {loading ? 'Удаление...' : 'Удалить задачу'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskPage;