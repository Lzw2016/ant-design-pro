import XLSX from "xlsx";
import lodash from "lodash";

/**
 * 字符串转ArrayBuffer
 * @param {*} str 字符串
 */
function str2buf(str) {
  const buf = new ArrayBuffer(str.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i !== str.length; ++i) {
    // eslint-disable-next-line no-bitwise
    view[i] = str.charCodeAt(i) & 0xFF;
  }
  return buf;
}

/**
 * 将一个sheet转成最终的excel文件的blob对象
 * @param {*} sheetMap  Excel页签数据(XLSX.utils.aoa_to_sheet返回值)
 */
function sheet2blob(sheetMap) {
  const workbook = { SheetNames: [], Sheets: {} };
  lodash.forEach(sheetMap, (sheet, sheetName) => {
    workbook.SheetNames.push(sheetName);
    workbook.Sheets[sheetName] = sheet;
  });
  // 生成excel的配置项
  const wopts = { bookType: "xlsx", bookSST: false, type: "binary" };
  const wbout = XLSX.write(workbook, wopts);
  const blob = new Blob([str2buf(wbout)], { type: "application/octet-stream" });
  return blob;
}

/**
 * 通用的打开下载对话框方法
 * @param url       文件下载地址、一个blob对象
 * @param fileName  文件名称
 */
function openDownloadDialog(url, fileName) {
  let href = url;
  if (typeof url === "object" && url instanceof Blob) {
    href = URL.createObjectURL(url);
  }
  const aLink = document.createElement("a");
  aLink.href = href;
  if (fileName) aLink.download = fileName;
  let event;
  if (window.MouseEvent) {
    event = new MouseEvent("click");
  } else {
    event = document.createEvent("MouseEvents");
    event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  }
  aLink.dispatchEvent(event);
}

/**
 * 客户端导出Excel
 *
 * @param {*} data      Excel数据二维数组 或者 一个对象(对象的所有属性是二维数组)
 * @param {*} fileName  导出文件名称
 */
function downloadExcel(data = [], fileName = "导出数据.xlsx", sheetName = "sheet") {
  // const data = [
  //     ['姓名', '性别', '年龄', '注册时间'],
  //     ['张三', '男', 18, new Date()],
  //     ['李四', '女', 22, new Date()]
  // ];
  // ------------------------------------
  // const data = {
  //   "sheet1": [
  //     ['姓名', '性别', '年龄', '注册时间'],
  //     ['张三', '男', 18, new Date()],
  //     ['李四', '女', 22, new Date()]
  //   ],
  //   "sheet2": [
  //     ['姓名', '性别', '年龄', '注册时间'],
  //     ['张三', '男', 18, new Date()],
  //     ['李四', '女', 22, new Date()]
  //   ]
  // };
  const sheetDataMap = {};
  if (Array.isArray(data)) {
    // 单页签导出
    sheetDataMap[sheetName] = data;
  } else {
    // 多页签导出
    lodash.forEach(data, (array, name) => {
      if (Array.isArray(array)) {
        sheetDataMap[name] = array;
      }
    });
  }
  // Excel数据生成
  const sheetMap = {};
  lodash.forEach(sheetDataMap, (array, name) => {
    const sheet = XLSX.utils.aoa_to_sheet(array);
    sheetMap[name] = sheet;
  });
  openDownloadDialog(sheet2blob(sheetMap), fileName);
}

export {
  downloadExcel,
  openDownloadDialog,
};
