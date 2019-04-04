/**
 * request 网络请求工具
 * 更详细的api文档: https://bigfish.alipay.com/doc/api#request
 */
import React from 'react';
 import { extend } from 'umi-request';
import { notification } from 'antd';
// import router from 'umi/router';
import lodash from 'lodash';
import { CodeMessage } from './constant';

/**
 * 异常处理程序
 */
async function errorHandler(error) {
  const { response = null } = error;
  if (response === null) throw error;
  // 成功，直接返回response
  // if (response.status >= 200 && response.status < 300) return response;
  // 失败，读取异常消息message
  let errortext;
  let json;
  try {
    json = await response.json();
    if (json && json.message) errortext = json.message;
  } catch (err) {
    errortext = undefined;
  }
  if (!errortext) {
    errortext = CodeMessage(response.status) || response.statusText;
  }
  // 处理错误 - 显示
  if (response.status === 400 && json && json.validMessageList && json.validMessageList instanceof Array) {
    const validMessageList = [];
    lodash.forEach(json.validMessageList, (item, index) => {
      validMessageList.push({ index, lable: `${item.errorMessage}(${item.filed}=${item.value})` });
    })
    notification.error({
      message: `请求参数验证失败 ${response.status}`,
      description: (
        <ol style={{ margin: 0, paddingLeft: 20 }}>
          {validMessageList.map(item => (<li key={item.index}>{item.lable}</li>))}
        </ol>
      ),
    });
  } else {
    notification.error({ message: `请求错误 ${response.status}`, description: errortext });
  }
  // 处理错误 - 跳转
  const { status } = response;
  if (status === 401) {
    /* eslint-disable no-underscore-dangle */
    window.g_app._store.dispatch({ type: 'login/logout' });
    // return;
  }
  // if (status === 403) {
  //   router.push('/exception/403');
  //   return;
  // }
  // if (status <= 504 && status >= 500) {
  //   router.push('/exception/500');
  //   return;
  // }
  // if (status >= 404 && status < 422) {
  //   router.push('/exception/404');
  // }
}

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  // 默认错误处理
  errorHandler,
  // 默认请求是否带上cookie
  credentials: 'include',
  // 全局请求头
  headers: {},
  // 全局url前缀
  prefix: '',
});

// 请求拦截器，更改url或选项
// request.interceptors.request.use((url, options) => {
//   return (
//     {
//       url: `${url}&interceptors=yes`,
//       options: { ...options, interceptors: true },
//     }
//   );
// });

// 响应拦截器，处理响应
// request.interceptors.response.use((response, options) => {
//   response.headers.append('interceptors', 'yes yo');
//   return response;
// });

export default request;
