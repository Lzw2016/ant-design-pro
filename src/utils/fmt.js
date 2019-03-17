import numeral from 'numeral';
import moment from 'moment';

export function fmtProgress(val) {
  return numeral(val).format('0');
}

export function fmtMoney(val) {
  return numeral(val).format('0,00.00');
}

export function fmtTomorrow() {
  return moment().add(1, 'day');
}

export function fmtYesterday() {
  return moment().subtract(1, 'days');
}

export function fmtLastWeek() {
  return moment().subtract(1, 'week');
}

export function fmtLastMonth() {
  return moment().subtract(1, 'month');
}

export function fmtDateTime(val, fmt = 'YYYY-MM-DD HH:mm:ss') {
  let str = moment(val).format(fmt);
  if (str === 'Invalid date') {
    str = '-';
  }
  return str;
}

export function fmtDate(val) {
  return fmtDateTime(val, 'YYYY-MM-DD');
}

export function fmtYear(val) {
  return fmtDateTime(val, 'YYYY');
}

export function fmtMonth(val) {
  return fmtDateTime(val, 'MM');
}

export function fmtDay(val) {
  return fmtDateTime(val, 'DD');
}

export function formatThounsandsPercentage(num) {
  return numeral(num).format('0.000%', Math.floor);
}

export function formatTenThounsandsPercentage(num) {
  return numeral(num).format('0.0000%', Math.floor);
}

export function howLongAgo(agoDate, maxTimeStamp = 7 * 24 * 60 * 60 * 1000) {
  const byTime = [365 * 24 * 60 * 60 * 1000, 30 * 24 * 60 * 60 * 1000, 24 * 60 * 60 * 1000, 60 * 60 * 1000, 60 * 1000, 1000];
  const timeUnit = ["年", "个月", "天", "小时", "分钟", "秒"];
  let ct = new Date().getTime() - agoDate.getTime();
  if (ct < 0 || ct > maxTimeStamp) {
    return fmtDate(agoDate);
  }
  const sb = [];
  for (let i = 0; i < byTime.length; i++) {
    if (ct < byTime[i]) {
      continue;
    }
    const temp = Math.floor(ct / byTime[i]);
    ct %= byTime[i];
    if (temp > 0) {
      sb.push(temp + timeUnit[i]);
    }
    // 一下控制最多输出几个时间单位：
    // 一个时间单位如：N分钟前
    // 两个时间单位如：M分钟N秒前
    // 三个时间单位如：M年N分钟X秒前
    // 以此类推
    if (sb.length >= 1) {
      break;
    }
  }
  return `${sb.join("")}前`;
}

/**
 * 时间毫秒数转成易读的时间
 * @param {Number} time 时间毫秒数
 */
export function fmtTime(time, level = 3, timeUnit = ["Y", "M", "D", "h", "m", "s", "ms"]) {
  if (!time) return '-';
  if (time === 0) return '0ms';
  const byTime = [365 * 24 * 60 * 60 * 1000, 30 * 24 * 60 * 60 * 1000, 24 * 60 * 60 * 1000, 60 * 60 * 1000, 60 * 1000, 1000, 1];
  let ct = time;
  const sb = [];
  for (let i = 0; i < byTime.length; i++) {
    if (ct < byTime[i]) {
      continue;
    }
    const temp = Math.floor(ct / byTime[i]);
    ct %= byTime[i];
    if (temp > 0) {
      sb.push(temp + timeUnit[i]);
    }
    // 一下控制最多输出几个时间单位：
    // 一个时间单位如：N分钟前
    // 两个时间单位如：M分钟N秒前
    // 三个时间单位如：M年N分钟X秒前
    // 以此类推
    if (sb.length >= level) {
      break;
    }
  }
  return sb.join("");
}

const B = 8.0;
const KB = B * 1024;
const MB = KB * 1024;
const GB = MB * 1024;
const TB = GB * 1024;
const BytesArray = [
  { value: TB, unit: 'TB' },
  { value: GB, unit: 'GB' },
  { value: MB, unit: 'MB' },
  { value: KB, unit: 'KB' },
  { value: B, unit: 'B' },
];
/**
 * 比特大小转易读的数据大小格式，返回字符串
 * @param {Number} num 数据比特大小bit(8bit=1b)
 */
export function fmtBytes(num) {
  if (!num) return '-';
  if (num === 0) return '0B';
  for (let i = 0; i < BytesArray.length; i++) {
    const { value, unit } = BytesArray[i];
    const result = num / value;
    if (result >= 1.0) {
      return `${numeral(result).format('0,000.00')} ${unit}`;
    }
  }
  return '-';
}

