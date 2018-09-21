Redux 是 JavaScript 状态(state)容器，提供可预测化的状态管理。

## React组件的两种类型的数据
* props 
React的核心思想就是组件化思想，页面会被切分成一些独立的、可复用的组件。
  组件从概念上看就是一个函数，可以接受一个参数作为输入值，这个参数就是props，所以可以把props理解为从外部传入组件内部的数据。由于React是单向数据流，所以props基本上也就是从父级组件向子组件传递的数据。

  props是一个从外部传进组件的参数，主要作为就是从父组件向子组件传递数据，它具有可读性和不变性，只能通过外部组件主动传入新的props来重新渲染子组件，否则子组件的props以及展现形式不会改变。
* state
  一个组件的显示形态可以由数据状态和外部参数所决定，外部参数也就是props，而数据状态就是state。
state不同于props的一点是，state是可以被改变的。不过，不可以直接通过this.state=的方式来修改，而需要通过this.setState()方法来修改state。
调用this.setState方法时，React会更新组件的数据状态state，并且重新调用render方法，也就是会对组件进行重新渲染。  
**注意**：通过this.state=来初始化state，使用this.setState来修改state，constructor是唯一能够初始化的地方。

## redux的三个要点：
1.单一数据源：应用中所有的state都以一个对象树的形式存在一个唯一的store中； 
 
```
console.log(store.getState())

/* 输出
{
  visibilityFilter: 'SHOW_ALL',
  todos: [
    {
      text: 'Consider using Redux',
      completed: true,
    },
    {
      text: 'Keep all state in a single tree',
      completed: false
    }
  ]
}
*／
```  

2.状态(State)是只读的：唯一改变state的方法是触发action；

```
store.dispatch({
  type: 'COMPLETE_TODO',
  index: 1
})

store.dispatch({
  type: 'SET_VISIBILITY_FILTER',
  filter: 'SHOW_COMPLETED'
})
```
3.使用纯函数来执行修改：通过reducer描述action如何改变state树；

```
function visibilityFilter(state = 'SHOW_ALL', action) {
  switch (action.type) {
    case 'SET_VISIBILITY_FILTER':
      return action.filter
    default:
      return state
  }
}

function todos(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ]
    case 'COMPLETE_TODO':
      return state.map((todo, index) => {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: true
          })
        }
        return todo
      })
    default:
      return state
  }
}

import { combineReducers, createStore } from 'redux'
const reducer = combineReducers({ visibilityFilter, todos })
const store = createStore(reducer)
```

## 安装
```
npm install --save redux
```
或
```
yarn add redux
```

## redux状态管理的流程
![](https://upload-images.jianshu.io/upload_images/1064933-474fcdb52a92cda0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

### action：用户触发或程序触发的一个普通对象
  把数据从应用传到 store 的有效载体，是 store 数据的**唯一**来源。
一般来说你会通过 `store.dispatch()`将 action 传到 store。

```
const ADD_TODO = 'ADD_TODO'
```
```
function addTodo(text) {
  return {
    type: ADD_TODO,
    text
  }
}
```
action 本质上是 JavaScript 普通对象。
action 内必须使用一个字符串类型的 type 字段来表示将要执行的动作。
多数情况下，type 会被定义成字符串常量。当应用规模越来越大时，建议使用单独的模块或文件来存放 action。

```
import { ADD_TODO } from '../actionTypes'
```

### action.js 示例：

```
/*
  action 类型
*/
export const ADD_TODO = 'ADD_TODO';

/*
  action 创建函数
*/
export function addTodo(text) {
    return { type: ADD_TODO, text };
}
```

### reducer：根据action操作来做出不同的数据响应，返回一个新的state
reducer指定了应用状态的变化如何响应 actions 并发送到 store 的； actions 只是描述了有事情发生了这一事实，并没有描述应用如何更新 state。  
### reducer.js 示例：

```
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
```

### store：最终值是由reducer的值来确定
store 就是把action和reducer联系到一起的对象。Store 有以下职责：  
 维持应用的 state；  
 提供 `getState()` 方法获取 state；  
 提供 `dispatch(action)`方法更新 state；  
 通过 `subscribe(listener)`注册监听器;  
 通过 `subscribe(listener)` 返回的函数注销监听器。  
**注意**：Redux 应用只有一个单一的 store。当需要拆分数据处理逻辑时，你应该使用 reducer 组合而不是创建多个 store。  
### store.js 示例：

```
import { createStore } from 'redux';

import todoApp from './reducer';

// 创建store
const store = createStore(todoApp);

export default store;
```
`createStore()`的第二个参数是可选的, 用于设置 state 初始状态。这对开发同构应用时非常有用，服务器端 redux 应用的 state 结构可以与客户端保持一致, 那么客户端可以将从网络接收到的服务端 state 直接用于本地数据初始化。

```
const store = createStore(todoApp, window.STATE_FROM_SERVER)
```
### 发起action

```
// 注册监听
const unsubscribe = store.subscribe(() => {
  // 获取store的state
  console.log('store state', store.getState())
})

// 触发action
store.dispatch(addTodo('测试 redux'))

// 注销监听
unsubscribe()
```

## 数据流
严格的单向数据流是 Redux 架构的设计核心。应用中所有的数据都遵循相同的生命周期，这样可以让应用变得更加可预测且容易理解。
Redux 应用中数据的生命周期遵循下面 4 个步骤：  
1. 调用 `store.dispatch(action)`  
2. Redux store 调用传入的 reducer 函数
    Store会把两个参数传入 reducer： 当前的 state 树和 action。  
3. 根 reducer 应该把多个子 reducer 输出合并成一个单一的 state 树  
4. Redux store 保存了根 reducer 返回的完整 state 树，这个新的树就是应用的下一个 state