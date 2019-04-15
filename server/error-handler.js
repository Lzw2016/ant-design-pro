async function errorHandler(ctx, next) {
  try {
    await next();
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500;
    ctx.body = err.message;
    // if (ctx.status == 401) {
    //   ctx.set('WWW-Authenticate', 'Basic')
    // }
  }
}

export default errorHandler;
