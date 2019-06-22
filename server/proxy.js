/* eslint-disable no-console */
/* eslint-disable func-names */
import httpProxy from 'http-proxy';
import { ProxyMap, defaultPrefix } from './proxy.map';

// 创建代理服务器
const proxy = httpProxy.createProxyServer({
  ignorePath: true,
});

// 代理测错误处理
proxy.on('error', function (err, req, res) {
  const resJson = {};
  resJson.timestamp = Date.now();
  resJson.error = err.message;
  resJson.status = 500;
  resJson.exception = "";
  resJson.message = "请求服务端失败";
  resJson.path = req.path;
  res.writeHead(resJson.status, { 'Content-Type': 'application/json;charset=UTF-8' });
  res.end(JSON.stringify(resJson));
  console.log("代理异常", err.message);
});

// 获取代理Url地址
function getProxyUrl(originalUrl) {
  const array = originalUrl.split('/');
  const key = array[2];
  let svc = ProxyMap[key];
  if (!svc) {
    console.log("获取代理Url失败 | originalUrl=", originalUrl, " | array=", array, " | key=", key, " | ProxyMap=", ProxyMap);
    return undefined;
  }
  if (svc.endsWith("/")) {
    svc = svc.substring(0, svc.length - 1);
  }
  let url = originalUrl.replace('/proxy/', '').replace(key, svc);
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `http://${url}`;
  }
  console.log(`代理Url [${originalUrl} -> ${url}]`);
  return url;
}

// 代理请求处理逻辑
function proxyFnc(ctx) {
  const url = getProxyUrl(ctx.originalUrl);
  if (!url) {
    // url没有配置对应代理 404
    const resJson = {};
    resJson.timestamp = Date.now();
    resJson.error = "not found";
    resJson.status = 404;
    resJson.exception = "not found";
    resJson.message = "资源不存在";
    resJson.path = ctx.originalUrl;
    // 响应数据
    ctx.response.status = resJson.status;
    ctx.response.type = "json";
    ctx.response.body = resJson;
    return;
  }
  ctx.respond = false;
  const { req, res } = ctx;
  proxy.web(req, res, { target: url, changeOrigin: true });
}

export {
  proxy,
  proxyFnc,
  defaultPrefix,
};
