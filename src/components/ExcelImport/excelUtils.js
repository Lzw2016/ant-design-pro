import XLSX from "xlsx";

// 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
function sheet2blob(sheet, sheetName = "sheet1") {
  const workbook = { SheetNames: [sheetName], Sheets: {} };
  workbook.Sheets[sheetName] = sheet;
  // 生成excel的配置项
  const wopts = {
    bookType: "xlsx",
    bookSST: false,
    type: "binary"
  };
  const wbout = XLSX.write(workbook, wopts);
  // 字符串转ArrayBuffer
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      // eslint-disable-next-line no-bitwise
      view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
  }
  const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
  return blob;
}

/**
 * 通用的打开下载对话框方法，没有测试过具体兼容性
 * @param url 下载地址，也可以是一个blob对象，必选
 * @param saveName 保存文件名，可选
 */
function openDownloadDialog(url, saveName) {
  let href = url;
  if (typeof url === "object" && url instanceof Blob) {
    href = URL.createObjectURL(url);
  }
  const aLink = document.createElement("a");
  aLink.href = href;
  aLink.download = saveName || "导入数据.xlsx";
  let event;
  if (window.MouseEvent) event = new MouseEvent("click");
  else {
    event = document.createEvent("MouseEvents");
    event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
  }
  aLink.dispatchEvent(event);
}

/**
 * 客户端导出Excel
 * @param {*} data 导出数据二维数组对应Excel表格
 * @param {*} saveName 导出文件名称
 */
function downloadExcel(data = [], saveName = "导入数据.xlsx") {
  // var data = [
  //     ['姓名', '性别', '年龄', '注册时间'],
  //     ['张三', '男', 18, new Date()],
  //     ['李四', '女', 22, new Date()]
  // ];
  const sheet = XLSX.utils.aoa_to_sheet(data);
  openDownloadDialog(sheet2blob(sheet), saveName);
}

export {
  sheet2blob,
  openDownloadDialog,
  downloadExcel
};
