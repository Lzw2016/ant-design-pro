const ignore = require("./git-ignore");

const aliOssConf = {
  region: 'oss-cn-hangzhou',
  accessKeyId: ignore.accessKeyId,
  accessKeySecret: ignore.accessKeySecret,
  bucket: 'ant-msvc-top',
  ossUrl: 'https://ant-msvc-top.oss-cn-hangzhou.aliyuncs.com',
};

module.exports = {
  appVersion: 'v1.0.1',
  ...aliOssConf,
};
