const ignore = require("./git-ignore");

const aliOssConf = {
  region: 'oss-cn-hangzhou',
  accessKeyId: ignore.accessKeyId,
  accessKeySecret: ignore.accessKeySecret,
  bucket: 'clever-security',
  ossUrl: 'https://clever-security.oss-cn-hangzhou.aliyuncs.com',
  // oss 使用域名绑定之后变成CND
  cdnUrl: 'http://cdn.security.msvc.top',
};

module.exports = {
  appVersion: 'v1.0.0',
  ...aliOssConf,
};
