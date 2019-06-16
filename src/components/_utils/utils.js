// 根据字符串长度截取字符串(一个中文长度为2，英文字母长度为1)
export function cutOffStr(str = "", maxLength = 8, suffix = '...') {
  if (!str) return str;
  let length = 0;
  const result = [];
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    const char = str.charAt(i);
    if (code >= 0 && code <= 127) {
      length += 1;
    } else {
      length += 2;
    }
    if (length > maxLength) {
      result.push(suffix);
      break;
    }
    result.push(char);
  }
  return result.join('');
}
