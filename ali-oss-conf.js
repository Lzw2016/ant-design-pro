const ignore = require("./git-ignore");

const aliOssConf = {
  region: 'oss-cn-hangzhou',
  accessKeyId: ignore.accessKeyId,
  accessKeySecret: ignore.accessKeySecret,
  bucket: 'ant-msvc-top',
  ossUrl: 'https://ant-msvc-top.oss-cn-hangzhou.aliyuncs.com',
  // oss 使用域名绑定之后变成CND
  cdnUrl: 'http://ant.cdn.msvc.top/',
};

module.exports = {
  appVersion: 'v1.0.1',
  ...aliOssConf,
};
