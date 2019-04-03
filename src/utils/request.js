import React from 'react';
import fetch from 'dva/fetch';
import { notification } from 'antd';
// import router from 'umi/router';
import lodash from 'lodash';
import hash from 'hash.js';
import { CodeMessage } from './constant';

async function checkStatus(response) {
  // 成功，直接返回response
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  // 失败，读取异常消息message
  let errortext;
  let json;
  try {
    json = await response.json();
    if (json && json.message) {
      errortext = json.message;
    }
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
  // 返回错误
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

const cachedSave = (response, hashcode) => {
  /**
   * Clone a response data and store it in sessionStorage
   * Does not support data other than json, Cache only json
   */
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.match(/application\/json/i)) {
    // All data is saved as text
    response
      .clone()
      .text()
      .then(content => {
        sessionStorage.setItem(hashcode, content);
        sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
      });
  }
};

/**
 * 配置request请求时的默认参数
 */
export default function request(url, option) {
  const options = { expirys: (window.location.hostname === 'preview.pro.ant.design'), ...option };
  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */
  const fingerprint = url + (options.body ? JSON.stringify(options.body) : '');
  const hashcode = hash.sha256().update(fingerprint).digest('hex');
  const defaultOptions = { credentials: 'include' };
  const newOptions = { ...defaultOptions, ...options };
  if (newOptions.method === 'POST' || newOptions.method === 'PUT' || newOptions.method === 'DELETE') {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = { Accept: 'application/json', 'Content-Type': 'application/json; charset=utf-8', ...newOptions.headers };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = { Accept: 'application/json', ...newOptions.headers };
    }
  }

  const expirys = options.expirys && 60;
  // options.expirys !== false, return the cache,
  if (options.expirys !== false) {
    const cached = sessionStorage.getItem(hashcode);
    const whenCached = sessionStorage.getItem(`${hashcode}:timestamp`);
    if (cached !== null && whenCached !== null) {
      const age = (Date.now() - whenCached) / 1000;
      if (age < expirys) {
        const response = new Response(new Blob([cached]));
        return response.json();
      }
      sessionStorage.removeItem(hashcode);
      sessionStorage.removeItem(`${hashcode}:timestamp`);
    }
  }
  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => cachedSave(response, hashcode))
    .then(response => {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
      }
      const text = response.text();
      try {
        return JSON.parse(text);
      } catch (err) {
        // console.log("响应数据Json解析失败", err);
        return text;
      }
    })
    .catch(e => {
      const status = e.name;
      if (status === 401) {
        // {"data":{},"message":"not login","resultCode":"400"}
        // @HACK
        /* eslint-disable no-underscore-dangle */
        window.g_app._store.dispatch({ type: 'login/logout' });
        // return;
      }
      // environment should not be used
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
    });
}


// TODO 待合并 ------------------------------------------------------------------------------------------------------------------------------------------

// /**
//  * request 网络请求工具
//  * 更详细的api文档: https://bigfish.alipay.com/doc/api#request
//  */
// import { extend } from 'umi-request';
// import { notification } from 'antd';
// import router from 'umi/router';

// const codeMessage = {
//   200: '服务器成功返回请求的数据。',
//   201: '新建或修改数据成功。',
//   202: '一个请求已经进入后台排队（异步任务）。',
//   204: '删除数据成功。',
//   400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
//   401: '用户没有权限（令牌、用户名、密码错误）。',
//   403: '用户得到授权，但是访问是被禁止的。',
//   404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
//   406: '请求的格式不可得。',
//   410: '请求的资源被永久删除，且不会再得到的。',
//   422: '当创建一个对象时，发生一个验证错误。',
//   500: '服务器发生错误，请检查服务器。',
//   502: '网关错误。',
//   503: '服务不可用，服务器暂时过载或维护。',
//   504: '网关超时。',
// };

// /**
//  * 异常处理程序
//  */
// const errorHandler = error => {
//   const { response = {} } = error;
//   const errortext = codeMessage[response.status] || response.statusText;
//   const { status, url } = response;

//   if (status === 401) {
//     notification.error({
//       message: '未登录或登录已过期，请重新登录。',
//     });
//     // @HACK
//     /* eslint-disable no-underscore-dangle */
//     window.g_app._store.dispatch({
//       type: 'login/logout',
//     });
//     return;
//   }
//   notification.error({
//     message: `请求错误 ${status}: ${url}`,
//     description: errortext,
//   });
//   // environment should not be used
//   if (status === 403) {
//     router.push('/exception/403');
//     return;
//   }
//   if (status <= 504 && status >= 500) {
//     router.push('/exception/500');
//     return;
//   }
//   if (status >= 404 && status < 422) {
//     router.push('/exception/404');
//   }
// };

// /**
//  * 配置request请求时的默认参数
//  */
// const request = extend({
//   errorHandler, // 默认错误处理
//   credentials: 'include', // 默认请求是否带上cookie
// });

// export default request;
