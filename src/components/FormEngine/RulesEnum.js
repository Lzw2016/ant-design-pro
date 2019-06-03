// type	内建校验类型，可选项	string	'string'
// message	校验文案	string|ReactNode	-
// whitespace	必选时，空格是否会被视为错误	boolean	false
// required	是否必选	boolean	false
// len	字段长度	number	-
// min	最小长度	number	-
// max	最大长度	number	-
// enum	枚举类型	string	-
// pattern	正则表达式校验	RegExp	-
// validator	自定义校验（注意，callback 必须被调用）	function(rule, value, callback)	-
// transform	校验前转换字段值	function(value) => transformedValue:any	-

// 常用表单校验封装
const RulesEnum = {
  string: ({ message = undefined, whitespace = true, required = false, min = undefined, max = undefined, len = undefined, ...res }) => {
    return { type: "string", message, whitespace, required, min, max, len, ...res };
  },
  number: ({ message = undefined, whitespace = true, required = false, min = undefined, max = undefined, len = undefined, ...res }) => {
    return { type: "number", message, whitespace, required, min, max, len, ...res };
  },
  boolean: ({ message = undefined, whitespace = true, required = false, ...res }) => {
    return { type: "boolean", message, whitespace, required, ...res };
  },
  method: ({ message = undefined, whitespace = true, required = false, ...res }) => {
    return { type: "method", message, whitespace, required, ...res };
  },
  regexp: ({ message = undefined, whitespace = true, required = false, ...res }) => {
    return { type: "regexp", message, whitespace, required, ...res };
  },
  integer: ({ message = undefined, whitespace = true, required = false, min = undefined, max = undefined, len = undefined, ...res }) => {
    return { type: "integer", message, whitespace, required, min, max, len, ...res };
  },
  float: ({ message = undefined, whitespace = true, required = false, min = undefined, max = undefined, len = undefined, ...res }) => {
    return { type: "float", message, whitespace, required, min, max, len, ...res };
  },
  array: ({ message = undefined, whitespace = true, required = false, min = undefined, max = undefined, len = undefined, ...res }) => {
    return { type: "array", message, whitespace, required, min, max, len, ...res };
  },
  object: ({ message = undefined, whitespace = true, required = false, ...res }) => {
    return { type: "object", message, whitespace, required, ...res };
  },
  enum: ({ message = undefined, whitespace = true, required = false, enumArray = [], ...res }) => {
    return { type: "enum", message, whitespace, required, enum: enumArray, ...res };
  },
  // TODO min max 手动校验
  date: ({ message = undefined, whitespace = true, required = false, min = undefined, max = undefined, ...res }) => {
    return { type: "date", message, whitespace, required, min, max, ...res };
  },
  url: ({ message = undefined, whitespace = true, required = false, ...res }) => {
    return { type: "url", message, whitespace, required, ...res };
  },
  hex: ({ message = undefined, whitespace = true, required = false, ...res }) => {
    return { type: "hex", message, whitespace, required, ...res };
  },
  email: ({ message = undefined, whitespace = true, required = false, ...res }) => {
    return { type: "email", message, whitespace, required, ...res };
  },
  // TODO validator: (rule, value, callback) => { callback(undefined | new Error(String)) }
  validator: ({ message = undefined, whitespace = true, required = false, validator = undefined, ...res }) => {
    // ajax({ url: 'xx', value: value }).then(data => callback(), error => callback(new Error(error)));
    return { message, whitespace, required, validator, ...res };
  },
};

export default RulesEnum;
