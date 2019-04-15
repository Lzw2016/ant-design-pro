/* eslint-disable import/no-unresolved */
import Koa from 'koa';
import Router from 'koa-router';
import KoaStatic from 'koa-static';
// import send from 'koa-send';
// import path from 'path';
import errorHandler from './error-handler';
import proxy from './proxy';

const app = new Koa();
const router = new Router();

// 错误处理
app.use(errorHandler);
// 静态文件处理
app.use(KoaStatic('./dist', { index: 'index.html', gzip: false }));

router
  // 健康检查
  .get('/echo', (ctx) => {
    ctx.body = ctx.request.query.str;
  })
  // 接口代理
  .all('/proxy/*', proxy);
// 自定义处理
// .get('/*', async (ctx) => {
//   if (ctx.path === '/') {
//     ctx.path = 'index.html';
//   }
//   await send(ctx, path.join('/dist', ctx.path));
// });

app.use(router.routes());
export default app;
