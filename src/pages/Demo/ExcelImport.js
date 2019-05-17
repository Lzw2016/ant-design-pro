import React, { PureComponent } from 'react';
import { Card, Button } from 'antd';
import { connect } from 'dva';
import ExcelImport from '@/components/ExcelImport'
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
    console.log("onConfirmImport -> ", data)
    this.setState({ excelImportData: data });
  }

  render() {
    const { excelImportData } = this.state;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <ExcelImport
            uploadUrl="/api/excel/import"
            templateFileUrl="/api/excel-templates/客户打标签-Excel导入模版.xlsx"
            onConfirmImport={this.onConfirmImport}
          >
            <Button type="primary">Excel导入</Button>
          </ExcelImport>
          <div>
            {excelImportData.length}
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default DemoTest;
