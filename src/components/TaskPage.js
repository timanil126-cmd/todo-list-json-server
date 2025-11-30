import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  loadTodos,
  updateTodo,
  deleteTodo,
  toggleComplete,
  setEditingTodo,
  updateEditingText
} from '../redux/actions';

function TaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { items: todos, loading: todosLoading, error } = useSelector(state => state.todos);
  const { editingTodo, editingText } = useSelector(state => state.editing);
  
  const dispatch = useDispatch();
  const [todo, setTodo] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (todos.length === 0) {
      dispatch(loadTodos());
    }
  }, [dispatch, todos.length]);

  useEffect(() => {
    if (todos.length > 0) {
      const taskId = parseInt(id);
      const foundTodo = todos.find(t => t.id === taskId);
      
      if (foundTodo) {
        setTodo(foundTodo);
        setNotFound(false);
        if (!editingTodo || editingTodo.id !== foundTodo.id) {
          dispatch(setEditingTodo(foundTodo));
        }
      } else {
        setNotFound(true);
      }
    }
  }, [id, todos, dispatch, editingTodo]);

  const handleSaveEdit = async () => {
    if (!editingText.trim() || !todo) return;
    
    setActionLoading(true);
    await dispatch(updateTodo(todo.id, { title: editingText.trim() }));
    setActionLoading(false);
    dispatch(setEditingTodo(null));
  };

  const handleCancelEdit = () => {
    if (todo) {
      dispatch(updateEditingText(todo.title));
    }
  };

  const handleToggleComplete = async () => {
    if (!todo) return;
    
    setActionLoading(true);
    await dispatch(toggleComplete(todo));
    setActionLoading(false);
  };

  const handleDelete = async () => {
    if (!todo) return;
    
    if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
      setActionLoading(true);
      await dispatch(deleteTodo(todo.id));
      setActionLoading(false);
      navigate('/');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (notFound) {
    return (
      <div className="container">
        <div className="not-found">
          <div className="not-found-content">
            <h1>404</h1>
            <h2>Задача не найдена</h2>
            <p>Задача с ID {id} не существует.</p>
            <button onClick={handleGoHome} className="home-button">
              Вернуться на главную
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!todo) {
    return (
      <div className="container">
        <div className="loading">Загрузка задачи...</div>
      </div>
    );
  }

  const isEditing = editingTodo && editingTodo.id === todo.id;

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
              disabled={actionLoading || todosLoading}
            />
            <span className="status-text">
              {todo.completed ? 'Выполнена' : 'Не выполнена'}
            </span>
          </label>
        </div>

        <div className="task-content">
          <h2>Описание задачи:</h2>
          {isEditing ? (
            <div className="edit-section">
              <textarea
                value={editingText}
                onChange={(e) => dispatch(updateEditingText(e.target.value))}
                className="edit-textarea"
                rows="4"
                disabled={actionLoading || todosLoading}
              />
              <div className="edit-actions">
                <button 
                  onClick={handleSaveEdit} 
                  className="save-button"
                  disabled={actionLoading || todosLoading}
                >
                  {actionLoading ? 'Сохранение...' : 'Сохранить'}
                </button>
                <button 
                  onClick={handleCancelEdit}
                  className="cancel-button"
                  disabled={actionLoading || todosLoading}
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <div className="task-text">
              <p>{todo.title}</p>
              <button 
                onClick={() => dispatch(setEditingTodo(todo))}
                className="edit-button"
                disabled={actionLoading || todosLoading}
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
            disabled={actionLoading || todosLoading}
          >
            {actionLoading ? 'Удаление...' : 'Удалить задачу'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskPage;