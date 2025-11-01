import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function TaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState('');

  const API_URL = 'http://localhost:3001/todos';

  useEffect(() => {
    fetchTodo();
  }, [id]);

  const fetchTodo = async () => {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) {
        navigate('/404');
        return;
      }
      const data = await response.json();
      setTodo(data);
      setEditText(data.title);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      navigate('/404');
    }
  };

  const updateTodo = async (updates) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      const updatedTodo = await response.json();
      setTodo(updatedTodo);
      return true;
    } catch (error) {
      console.error('Ошибка обновления:', error);
      return false;
    }
  };

  const deleteTodo = async () => {
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      try {
        await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
        });
        navigate('/');
      } catch (error) {
        console.error('Ошибка удаления:', error);
      }
    }
  };

  const handleSaveEdit = async () => {
    if (!editText.trim()) return;
    
    const success = await updateTodo({ title: editText.trim() });
    if (success) {
      setEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditText(todo.title);
    setEditing(false);
  };

  const toggleComplete = async () => {
    await updateTodo({ completed: !todo.completed });
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Загрузка...</div>
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="container">
        <div className="error">Задача не найдена</div>
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

      <div className="task-details">
        <div className="task-status">
          <label className="status-label">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={toggleComplete}
              className="status-checkbox"
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
              />
              <div className="edit-actions">
                <button onClick={handleSaveEdit} className="save-button">
                  Сохранить
                </button>
                <button onClick={handleCancelEdit} className="cancel-button">
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
              >
                Редактировать
              </button>
            </div>
          )}
        </div>

        <div className="task-actions">
          <button onClick={deleteTodo} className="delete-button">
            Удалить задачу
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskPage;