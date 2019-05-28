import React, { PureComponent, Fragment } from 'react';
import { Modal, Upload, Button, message, Alert, Table, Tooltip, Icon } from 'antd';
import lodash from 'lodash';
import { formatMessage } from 'umi/locale';
import { downloadExcel, openDownloadDialog } from './excelUtils';
// import classNames from 'classnames';
// import styles from './Log.less'

class ExcelImport extends PureComponent {

  // // 构造器
  // constructor(props) {
  //   super(props);
  // }

  // // 加载完成
  // componentDidMount() {
  //   // this.tick();
  // }

  // // 组件更新
  // componentDidUpdate(prevProps) {
  //   // const { target } = this.props;
  // }

  // // 组件卸载之前
  // componentWillUnmount() {
  //   // clearTimeout(this.timer);
  // }

  // 组件状态
  state = {
    // 是否显示对话框
    visible: false,
    // 上传文件受控数据
    fileList: [],
    // 上传数据结果
    uploadResponseData: {
      headRowNum: 0,
      heads: [],
      excelImportState: { success: null, totalRows: 0, successRows: 0, failRows: 0, errorCount: 0, repeat: 0 },
      failRows: [],
      importData: [],
    },
  }

  // -------------------------------------------------------------------------------------------------------------- 动态UI相关

  // 对话框标题
  getModalTitle = (modalTitle, excelImportState) => {
    let title = "Excel数据导入";
    if (modalTitle) title = modalTitle;
    let suffix = "";
    if (excelImportState.success === null) {
      suffix = "选择导入文件";
    } else if (excelImportState.success === true) {
      suffix = "导入数据成功";
    } else if (excelImportState.success === false) {
      suffix = "存在导入失败数据";
    }
    return `${title} - ${suffix}`;
  }

  // 对话框宽度
  getModalWidth = ({ uploadWidth, successfulWidth, failureWidth }) => {
    const { uploadResponseData: { excelImportState } } = this.state;
    let width = uploadWidth || 480;
    if (excelImportState.success === true) {
      width = successfulWidth || 480;
    } else if (excelImportState.success === false) {
      width = failureWidth || "70%";
    }
    return width;
  }

  // 失败数据表格 columns
  getTableColumns = (heads) => {
    const columns = [];
    let render = (text, record, index) => this.renderCellForExcelRowNum(text, record, index);
    columns.push({ title: "Excel行号", dataIndex: "excelRowNum", width: 80, render });
    if (heads && heads.length > 0) {
      heads.forEach(item => {
        const { lastHead, columnName } = item;
        render = (text, record, index) => this.renderCellForRowData(columnName, text, record, index);
        columns.push({ title: lastHead, dataIndex: columnName, render });
      });
    }
    return columns;
  }

  // 渲染Excel行号单元格
  renderCellForExcelRowNum = (text, record) => {
    const { rowError } = record;
    const errors = [];
    if (rowError && rowError.length > 0) {
      rowError.forEach(error => errors.push(error));
    }
    // console.log(rowError);
    if (errors.length > 0) {
      const titles = [];
      errors.forEach((err, index) => {
        if (titles.length >= 1) {
          titles.push(<br />);
        }
        titles.push(`${index}. ${err}`);
      });
      return (
        <span>
          <Tooltip
            arrowPointAtCenter={true}
            title={errors.length <= 1 ? errors.join("; ") : titles.join("")}
            style={{ cursor: "pointer", color: "red" }}
          >
            {text}
            <Icon type="warning" style={{ marginLeft: 3 }} />
          </Tooltip>
        </span>
      )
    }
    return text;
  }

  // 错误数据单元格渲染
  renderCellForRowData = (columnName, text, record) => {
    // console.log(record);
    const { columnError } = record;
    let errors = [];
    if (columnError && columnError[columnName] && columnError[columnName].length > 0) {
      errors = columnError[columnName];
    }
    if (errors.length > 0) {
      const titles = [];
      errors.forEach((err, index) => {
        if (titles.length >= 1) {
          titles.push(<br />);
        }
        titles.push(`${index}. ${err}`);
      });
      return (
        <span style={{ cursor: "pointer", color: "red" }}>
          <Tooltip
            arrowPointAtCenter={true}
            title={errors.length <= 1 ? errors.join("; ") : titles.join("")}
          >
            {text}
            <Icon type="warning" style={{ marginLeft: 3 }} />
          </Tooltip>
        </span>
      )
    }
    return text;
  }

  // 对话框内容
  getModalContent = ({
    uploadUrl,
    templateFileUrl,
    templateFileName,
    onConfirmImport,
    fileMaxSizeByMB,
    excelMaxRow,
    uploadExcelAlert,
    successedAlert,
    failedAlert,
    uploadContent,
    successfulContent,
    failureContent,
    uploadProps
  }) => {
    const { fileList, uploadResponseData } = this.state;
    const { excelImportState, failRows, heads } = uploadResponseData;
    if (excelImportState.success === false) {
      // 展示上传错误结果
      if (failureContent) {
        if (failureContent instanceof Function) {
          return failureContent(uploadResponseData, fileList, this.downloadErrorData);
        }
        return failureContent;
      }
      return (
        <Fragment>
          {failedAlert ? (failedAlert instanceof Function) ? failedAlert(uploadResponseData, fileList, this.downloadErrorData) : failedAlert : (
            <Alert
              type="error"
              message="存在导入失败数据，详情如下："
              description={(
                <ul>
                  {(fileList && fileList.length >= 1 && fileList[0].name) ? (
                    <li>上传Excel文件名称：[{fileList[0].name}]</li>
                  ) : ""}
                  <li>
                    共上传{excelImportState.totalRows}条数据，
                    成功{excelImportState.successRows}条，
                    失败{excelImportState.failRows}条，
                    重复数据{excelImportState.repeat}条!
                  </li>
                  <li>
                    导入数据存在{excelImportState.errorCount}个错误，
                    详情表格如下(您可以<a onClick={() => this.downloadErrorData(uploadResponseData, fileList)}>下载</a>导入失败数据，
                    修正后<a onClick={this.reset}>重新导入</a>)
                  </li>
                </ul>
              )}
            />
          )}
          <Table
            style={{ marginTop: 15 }}
            size="small"
            bordered={true}
            loading={false}
            pagination={{
              hideOnSinglePage: false,
              pageSizeOptions: ['10', '30', '50', '100'],
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: total => formatMessage({ id: 'common.pagination.showTotal' }, { total }),
            }}
            // scroll={{ x: true, y: 500 }}
            rowKey={record => {
              const keys = [];
              lodash.forEach(record, value => keys.push(`${value}`));
              return keys.join("|");
            }}
            columns={this.getTableColumns(heads)}
            dataSource={failRows}
          />
          <div style={{ height: 20 }}>
            <Button style={{ float: "right" }} type="primary" onClick={() => this.confirmImportData(onConfirmImport)}>确定</Button>
          </div>
        </Fragment>
      );
    }
    if (excelImportState.success === true) {
      // 上传成功提示
      if (successfulContent) {
        if (successfulContent instanceof Function) {
          return successfulContent(uploadResponseData, fileList);
        }
        return successfulContent;
      }
      return (
        <Fragment>
          {successedAlert ? (successedAlert instanceof Function) ? successedAlert(uploadResponseData, fileList) : successedAlert : (
            <Alert
              type="info"
              message="导入数据成功："
              description={(
                <div>共{excelImportState.totalRows}条数据，成功{excelImportState.successRows}条，重复数据{excelImportState.repeat}条!</div>
              )}
            />
          )}
          <div style={{ height: 20, marginTop: 15 }}>
            <Button style={{ float: "right" }} type="primary" onClick={() => this.confirmImportData(onConfirmImport)}>完成</Button>
          </div>
        </Fragment>
      );
    }
    // 选择上传Excel
    // console.log("选择上传Excel - | ", fileList.length, fileList);
    if (uploadContent) {
      if (uploadContent instanceof Function) {
        return uploadContent(excelMaxRow);
      }
      return uploadContent;
    }
    return (
      <Fragment>
        <Upload
          name="file"
          multiple={false}
          accept=".xsl,.xlsx"
          action={uploadUrl}
          fileList={fileList}
          beforeUpload={(fileParam, fileListParam) => this.beforeUpload(fileParam, fileListParam, fileMaxSizeByMB)}
          onChange={this.uploadChange}
          {...uploadProps}
        >
          <Button type="primary" icon="cloud-upload" disabled={fileList.length >= 1}>上传Excel</Button>
        </Upload>
        {uploadExcelAlert ? (uploadExcelAlert instanceof Function) ? uploadExcelAlert(excelMaxRow) : uploadExcelAlert : (
          <Alert
            style={{ marginTop: 15 }}
            type="info"
            message="Excel数据导入说明："
            description={(
              <ul>
                <li>请下载Excel模版，填写数据后上传到系统</li>
                <li>一次最多能导入<span style={{ color: "red" }}>{excelMaxRow}</span>条数据，超过<span style={{ color: "red" }}>{excelMaxRow}</span>条的请分批上传</li>
                <li>下载Excel导入模版请点击<a onClick={() => this.downloadTemplate(templateFileUrl, templateFileName)}>这里</a>下载</li>
              </ul>
            )}
          />
        )}
      </Fragment>
    )
  }

  // -------------------------------------------------------------------------------------------------------------- 事件处理

  // 下载导入模版
  downloadTemplate = (templateFileUrl, templateFileName) => {
    // window.open(templateFileUrl);
    if (templateFileName) {
      openDownloadDialog(templateFileUrl, templateFileName);
    } else {
      openDownloadDialog(templateFileUrl);
    }
  }

  // 上传之前文件校验
  beforeUpload = (fileParam, fileListParam, fileMaxSizeByMB) => {
    let fileMaxSize = 10;
    if (fileMaxSizeByMB) {
      fileMaxSize = fileMaxSizeByMB;
    }
    if ((fileParam.size / 1024 / 1024) > fileMaxSize) {
      message.warning(`导入Excel文件大小不能超过${fileMaxSize}MB`);
      return false;
    }
    return true;
  }

  // 上传文件状态变化
  uploadChange = (info) => {
    const { file, fileList } = info;
    // console.log("file", file);
    let newFileList = fileList;
    if (file && (file.status === "done" || file.status === "error") && file.response && file.response.data) {
      newFileList = fileList.map(fileItem => {
        const { response } = fileItem;
        let status = "error";
        let responseText = "Excel数据导入失败";
        if (response && response.excelImportState) {
          status = "done";
        } else {
          status = "error";
        }
        if (response && response.message) responseText = response.message;
        return { uid: fileItem.uid, name: fileItem.name, response: responseText, status };
      });
    } else {
      newFileList = fileList.map(fileItem => {
        const { response } = fileItem;
        let responseText = "Excel数据导入失败";
        if (response && response.message) responseText = response.message;
        return { uid: fileItem.uid, name: fileItem.name, response: responseText, status: fileItem.status };
      });
    }
    if (!file.response) {
      this.setState({ fileList: newFileList });
      return;
    }
    let { uploadResponseData } = this.state;
    if (file.response.excelImportState) {
      // 成功
      uploadResponseData = file.response;
    } else if (file.status !== "removed" && file.response && file.response.message) {
      // 失败
      message.warning(file.response.message);
    }
    setTimeout(() => this.setState({ fileList: newFileList, uploadResponseData }), 350);
  }

  // 隐藏窗口
  hideModal = () => {
    this.setState({ visible: false, fileList: [] });
    setTimeout(() => this.reset(), 500);
  }

  // 重置窗口
  reset = () => {
    const state = {};
    state.fileList = [];
    state.uploadResponseData = {
      headRowNum: 0,
      heads: [],
      excelImportState: { success: null, totalRows: 0, successRows: 0, failRows: 0, errorCount: 0, repeat: 0 },
      failRows: [],
      importData: [],
    };
    this.setState(state);
  }

  // 确定导入
  confirmImportData = (onConfirmImport) => {
    this.hideModal();
    const { uploadResponseData: { importData = [] } } = this.state;
    if (onConfirmImport instanceof Function) onConfirmImport(importData);
  }

  // 下载导入失败数据
  downloadErrorData = (uploadResponseData, fileList) => {
    const { failRows, heads } = uploadResponseData;
    if (!uploadResponseData || !failRows || failRows.length <= 0) {
      message.warning("没有导入失败的数据");
      return;
    }
    // 文件名处理
    let fileName = "导入失败数据.xlsx";
    if (fileList && fileList.length >= 1 && fileList[0].name) {
      fileName = fileList[0].name;
      if (fileName.lastIndexOf(".") !== -1) {
        fileName = fileName.substr(0, fileName.lastIndexOf("."));
      }
      fileName = `${fileName}-导入失败数据.xlsx`;
    }
    // 数据处理
    const columns = [];
    const excelData = [];
    if (heads && heads.length > 0) {
      heads.forEach((c, i) => {
        if (c.lastHead) {
          columns.push({ name: c.columnName, title: c.lastHead, index: i });
        } else {
          columns.push({ name: c.columnName, title: "", index: i });
        }
      });
      columns.push({ name: "导入失败原因", title: "导入失败原因" });
      // 设置Excel表头
      excelData.push(columns.map(c => c.title));
    }
    failRows.forEach(item => {
      // Excel行数据
      const row = [];
      if (columns.length > 0) {
        columns.forEach(({ name }) => {
          if (name === "导入失败原因") return;
          row.push(item[name]);
        });
      } else {
        lodash.forEach(item, value => row.push(value));
      }
      if (item.columnError) {
        lodash.forEach(item.columnError, (error, key) => {
          const text = [];
          error.forEach(tmp => text.push(tmp));
          let columnName = "";
          if (columns.length > 0 && columns.find(c => key === c.name)) {
            columnName = columns.find(c => key === c.name).title;
          }
          if (!columnName) {
            columnName = "";
          }
          row.push(`${columnName}: ${text.join("; ")}`);
        });
      }
      if (item.rowError && item.rowError.length > 0) {
        row.push(`当前行: ${item.rowError.join("; ")}`);
      }
      excelData.push(row);
    });
    // console.log("excelData", excelData);
    downloadExcel(excelData, fileName);
  }

  render() {
    const {
      uploadUrl,              // Excel导入URL地址
      templateFileUrl,        // Excel导入模版下载地址
      templateFileName,       // Excel导入模版文件名称
      fileMaxSizeByMB,        // 导入Excel文件最大大小，默认10MB
      excelMaxRow = 2000,     // Excel最大导入行数提示
      onConfirmImport,        // 导入数据成功回写事件
      modalTitle,             // 对话框标题
      uploadWidth,            // 文件上传对话框宽度
      successfulWidth,        // 上传成功对话框宽度
      failureWidth,           // 上传失败对话框宽度
      uploadExcelAlert,       // 选择上传Excel文件的提示，可以是一个 string | ReactNode | (excelMaxRow) => (string|ReactNode)
      successedAlert,         // 上传Excel文件成功的提示，可以是一个 string | ReactNode | (uploadResponseData, fileList) => (string|ReactNode)
      failedAlert,            // 上传Excel文件失败的提示，可以是一个 string | ReactNode | (uploadResponseData, fileList, downloadErrorData) => (string|ReactNode)
      uploadContent,          // 文件上传对话框内容，可以是一个 string | ReactNode | (excelMaxRow) => (string|ReactNode)
      successfulContent,      // 上传成功对话框内容，可以是一个 string | ReactNode | (uploadResponseData, fileList) => (string|ReactNode)
      failureContent,         // 上传失败对话框内容，可以是一个 string | ReactNode | (uploadResponseData, fileList, downloadErrorData) => (string|ReactNode)
      modalProps = {},        // Modal组件自定义属性
      uploadProps = {},       // upload组件自定义属性
      children,               // 子组件
    } = this.props;
    const { visible, fileList, uploadResponseData: { excelImportState } } = this.state;
    if (children) {
      React.Children.only(children);
    }
    return (
      <Fragment>
        <Modal
          maskClosable={false}
          visible={visible}
          width={this.getModalWidth({ uploadWidth, successfulWidth, failureWidth })}
          footer={null}
          withCredentials={true}
          title={this.getModalTitle(modalTitle, excelImportState)}
          fileList={fileList}
          onCancel={this.hideModal}
          {...modalProps}
        >
          {
            this.getModalContent({
              uploadUrl,
              templateFileUrl,
              templateFileName,
              onConfirmImport,
              fileMaxSizeByMB,
              excelMaxRow,
              uploadExcelAlert,
              successedAlert,
              failedAlert,
              uploadContent,
              successfulContent,
              failureContent,
              uploadProps
            })
          }
        </Modal>
        {React.Children.count(children) > 0 ? <span onClick={() => this.setState({ visible: true })}>{children}</span> : ""}
      </Fragment>
    );
  }
}

export default ExcelImport;
