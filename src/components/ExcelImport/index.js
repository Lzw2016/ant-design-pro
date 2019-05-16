import React, { PureComponent } from 'react';
import { Modal, Upload, Button } from 'antd';
import { downloadExcel } from './excelUtils';
// import classNames from 'classnames';
// import styles from './Log.less'

class ExcelImport extends PureComponent {

  state = {
    // 显示标题
    title: "Excel数据导入",
    // 是否显示
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

  getModalContent = () => {
    return "";
  }

  // 上传之前文件校验
  beforeUpload = (file) => {
    let { fileMaxSizeByMB } = this.props;
    if (!fileMaxSizeByMB) {
      fileMaxSizeByMB = 10;
    }
    if ((file.size / 1024 / 1024) > fileMaxSizeByMB) {
      this.$message.warning(`导入Excel文件大小不能超过${fileMaxSizeByMB}MB`);
      return false;
    }
    return true;
  }

  // 上传文件状态变化
  uploadChange = (info) => {
    const { file, fileList } = info;
    // console.log("file", file);
    if (file && file.status === "done" && file.response && file.response.data) {
      this.fileList = fileList.map(fileItem => {
        const { response } = fileItem;
        let status = "uploading";
        if (response.success === true) {
          status = "done";
        } else if (response.success === false) {
          status = "error";
        }
        return { uid: fileItem.uid, name: fileItem.name, response, status };
      });
    } else {
      this.fileList = fileList;
    }
    if (!file.response) {
      return;
    }
    if (file.response.success === true && file.response.data) {
      // 成功
      this.uploadResponseData = file.response.data;
    } else if ("removed" !== file.status) {
      // 失败
      this.$message.warning(file.response.msg);
      return;
    }
  }

  render() {
    // uploadUrl            Excel导入URL地址
    // templateFileUrl      Excel导入模版下载地址
    // fileMaxSizeByMB      导入Excel文件最大大小，默认10MB
    // onImportData         导入数据成功回写事件
    const { uploadUrl, templateFileUrl, fileMaxSizeByMB, onImportData } = this.props;
    const { title, visible, width, fileList } = this.state;
    return (
      <Modal title={title} visible={true} width={480} footer={null} maskClosable={false} cancel={() => { }}>
        <Upload name="file" multiple={false} accept=".xsl,.xlsx" action={uploadUrl} beforeUpload={this.beforeUpload} onChange={this.uploadChange}>
          <Button type="primary" icon="cloud-upload" disabled={fileList.length >= 1}>上传Excel</Button>
        </Upload>
        {/* {this.getModalContent()} */}
      </Modal>
    );
  }
}

export default ExcelImport;
