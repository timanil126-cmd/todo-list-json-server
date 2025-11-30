import { combineReducers } from 'redux';
import todosReducer from './todosReducer';
import filtersReducer from './filtersReducer';
import editingReducer from './editingReducer';

const rootReducer = combineReducers({
  todos: todosReducer,
  filters: filtersReducer,
  editing: editingReducer
});

export default rootReducer;