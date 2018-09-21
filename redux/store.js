import { createStore } from 'redux';

import todoApp from './reducer';

// 创建store
const store = createStore(todoApp);

export default store;
