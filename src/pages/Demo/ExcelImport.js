import React, { PureComponent } from 'react';
import { Card, Button } from 'antd';
import { connect } from 'dva';
import ExcelImport from '@/components/ExcelImport'
import { openDownloadDialog } from '@/components/ExcelImport/excelUtils'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import classNames from 'classnames';
// import styles from './Log.less'

@connect(({ DemoTestModel, loading }) => ({
  DemoTestModel,
  loading: loading.effects['DemoTestModel/findByPage'],
}))
class DemoTest extends PureComponent {

  state = {
    excelImportData: [],
  }

  onConfirmImport = (data) => {
    // eslint-disable-next-line no-console
    console.log("onConfirmImport -> ", data)
    this.setState({ excelImportData: data });
  }

  excelExport = () => {
    openDownloadDialog("/api/excel/export", "Excel导出数据.xlsx");
  }

  excelExport2 = () => {
    openDownloadDialog("/api/excel/excel-templates", "Excel模版.xlsx");
  }

  render() {
    const { excelImportData } = this.state;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <ExcelImport
            uploadUrl="/api/excel/import"
            // templateFileUrl="/api/excel-templates/客户打标签-Excel导入模版.xlsx"
            templateFileUrl="/api/excel/excel-templates"
            templateFileName="Excel模版.xlsx"
            onConfirmImport={this.onConfirmImport}
          >
            <Button type="primary">Excel导入</Button>
          </ExcelImport>

          <a onClick={this.excelExport} style={{ marginLeft: 35 }}>Excel导出</a>

          <a onClick={this.excelExport2} style={{ marginLeft: 35 }}>Excel模版.xlsx</a>

          <div>
            {excelImportData.length}
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default DemoTest;
