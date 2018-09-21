import { combineReducers } from 'redux';

import { ADD_TODO } from './action';

/*
  创建reducer函数
  返回新的state
*/
function todos(state = {}, action) {
    switch (action.type) {
    case ADD_TODO:
        return { ...state, text: action.text };
    default:
        return state;
    }
}

// 将所有reducer合并成一个大的对象
const todoApp = combineReducers({ todos });

export default todoApp;
