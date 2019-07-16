/* eslint-disable no-console */
/* eslint-disable import/no-unresolved */
import Koa from 'koa';
import Router from 'koa-router';
import KoaStatic from 'koa-static';
// import send from 'koa-send';
// import path from 'path';
import errorHandler from './error-handler';
import { proxy, proxyFnc, defaultPrefix } from './proxy';

const app = new Koa();
const router = new Router();

// 错误处理
app.use(errorHandler);
// 静态文件处理
app.use(KoaStatic('./dist', {
  index: 'index.html',
  gzip: true,
  maxage: 1000 * 60 * 60 * 24 * 30,
  setHeaders: (res, path, stats) => {
    let flag = true;
    const suffixArray = ["/index.html", "/favicon.png", ".html"].filter(suffix => path.indexOf(suffix, path.length - suffix.length) !== -1);
    if (suffixArray && suffixArray.length > 0) {
      flag = false;
      res.setHeader('Cache-Control', 'max-age=0,must-revalidate');
    }
    console.log("静态文件: ", path, " | size: ", stats ? (stats.size || '-') : '-', " | ", flag === true ? "[use maxage]" : "[no maxage]");
  },
}));

router
  // 健康检查
  .get('/echo', (ctx) => {
    ctx.body = ctx.request.query.str;
  })
  // 接口代理
  .all('/proxy/*', proxyFnc)
  .all("/*", ctx => {
    ctx.respond = false;
    const { req, res } = ctx;
    const url = `${defaultPrefix}${ctx.originalUrl}`;
    console.log("当前请求:", ctx.originalUrl, " | 使用默认代理前缀:", defaultPrefix, " | url=", url);
    proxy.web(req, res, { target: url, changeOrigin: true });
  });
// 自定义处理
// .get('/*', async (ctx) => {
//   if (ctx.path === '/') {
//     ctx.path = 'index.html';
//   }
//   await send(ctx, path.join('/dist', ctx.path));
// });

app.use(router.routes());
export default app;
