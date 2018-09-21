/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';

import store from './redux/store';
import { addTodo } from './redux/action';

type Props = {};
export default class App extends Component<Props> {
  testRedux = () => {
    // 注册监听
    const unsubscribe = store.subscribe(() => {
      // 获取store的state
      console.log('store state', store.getState())
    })

    // 触发action
    store.dispatch(addTodo('测试 redux'))

    // 注销监听
    unsubscribe()
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.testRedux}>
            <Text>测试 Redux</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
