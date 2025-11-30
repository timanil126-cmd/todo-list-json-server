import {
  TODOS_LOADING,
  TODOS_LOADED,
  TODOS_ERROR,
  TODO_ADDED,
  TODO_UPDATED,
  TODO_DELETED
} from '../types';

const initialState = {
  items: [],
  loading: false,
  error: null
};

const todosReducer = (state = initialState, action) => {
  switch (action.type) {
    case TODOS_LOADING:
      return {
        ...state,
        loading: true,
        error: null
      };
      
    case TODOS_LOADED:
      return {
        ...state,
        items: action.payload,
        loading: false,
        error: null
      };
      
    case TODOS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
      
    case TODO_ADDED:
      return {
        ...state,
        items: [...state.items, action.payload],
        error: null
      };
      
    case TODO_UPDATED:
      return {
        ...state,
        items: state.items.map(todo =>
          todo.id === action.payload.id ? action.payload : todo
        ),
        error: null
      };
      
    case TODO_DELETED:
      return {
        ...state,
        items: state.items.filter(todo => todo.id !== action.payload),
        error: null
      };
      
    default:
      return state;
  }
};

export default todosReducer;