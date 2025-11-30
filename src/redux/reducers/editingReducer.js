import {
  SET_EDITING_TODO,
  UPDATE_EDITING_TEXT
} from '../types';

const initialState = {
  editingTodo: null,
  editingText: ''
};

const editingReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_EDITING_TODO:
      return {
        editingTodo: action.payload,
        editingText: action.payload ? action.payload.title : ''
      };
      
    case UPDATE_EDITING_TEXT:
      return {
        ...state,
        editingText: action.payload
      };
      
    default:
      return state;
  }
};

export default editingReducer;