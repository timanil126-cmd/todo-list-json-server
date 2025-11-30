import {
  SET_SEARCH_TERM,
  TOGGLE_SORT
} from '../types';

const initialState = {
  searchTerm: '',
  sortAlphabetical: false
};

const filtersReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload
      };
      
    case TOGGLE_SORT:
      return {
        ...state,
        sortAlphabetical: !state.sortAlphabetical
      };
      
    default:
      return state;
  }
};

export default filtersReducer;