import {
  TODOS_LOADING,
  TODOS_LOADED,
  TODOS_ERROR,
  TODO_ADDED,
  TODO_UPDATED,
  TODO_DELETED,
  SET_SEARCH_TERM,
  TOGGLE_SORT,
  SET_EDITING_TODO,
  UPDATE_EDITING_TEXT
} from './types';

const API_URL = 'http://localhost:3001/todos';

export const setSearchTerm = (term) => ({
  type: SET_SEARCH_TERM,
  payload: term
});

export const toggleSort = () => ({
  type: TOGGLE_SORT
});

export const setEditingTodo = (todo) => ({
  type: SET_EDITING_TODO,
  payload: todo
});

export const updateEditingText = (text) => ({
  type: UPDATE_EDITING_TEXT,
  payload: text
});

export const loadTodos = () => async (dispatch) => {
  dispatch({ type: TODOS_LOADING });
  
  try {
    const response = await fetch(API_URL);
    const todos = await response.json();
    dispatch({ type: TODOS_LOADED, payload: todos });
  } catch (error) {
    dispatch({ type: TODOS_ERROR, payload: 'Ошибка загрузки задач' });
  }
};

export const addTodo = (title) => async (dispatch) => {
  if (!title.trim()) return;

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
    dispatch({ type: TODO_ADDED, payload: newTodo });
  } catch (error) {
    dispatch({ type: TODOS_ERROR, payload: 'Ошибка добавления задачи' });
  }
};

export const updateTodo = (id, updates) => async (dispatch) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    const updatedTodo = await response.json();
    dispatch({ type: TODO_UPDATED, payload: updatedTodo });
  } catch (error) {
    dispatch({ type: TODOS_ERROR, payload: 'Ошибка обновления задачи' });
  }
};

export const deleteTodo = (id) => async (dispatch) => {
  try {
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    dispatch({ type: TODO_DELETED, payload: id });
  } catch (error) {
    dispatch({ type: TODOS_ERROR, payload: 'Ошибка удаления задачи' });
  }
};

export const toggleComplete = (todo) => async (dispatch) => {
  dispatch(updateTodo(todo.id, { completed: !todo.completed }));
};