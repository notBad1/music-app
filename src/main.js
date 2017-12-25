import 'babel-polyfill'; // es6API转义
import Vue from 'vue';
import App from './App';
import router from './router';
import fastClick from 'fastclick';

import 'common/stylus/index.styl';

Vue.config.productionTip = false;
// 在页面上使用解决移动端点击300毫秒延迟
fastClick.attach(document.body);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
