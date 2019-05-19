import React, { PureComponent } from 'react';
// import { Modal, Upload, Button, message, Alert, Table, Tooltip, Icon } from 'antd';
import lodash from 'lodash';
// import { formatMessage } from 'umi/locale';
// import classNames from 'classnames';
import { TypeEnum, varTypeOf } from "../_utils/varTypeOf";
import { Mapper } from "../_utils/mapper";
// import styles from './index.less';

class DetailForm extends PureComponent {

  // // 构造器
  // constructor(props) {
  //   super(props);
  // }

  // // 加载完成
  // componentDidMount() {
  //   // this.tick();
  //   varTypeOfTest();
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
  }

  // 边框颜色 #e8e8e8
  border = "rgb(216, 236, 252)";

  // -------------------------------------------------------------------------------------------------------------- 动态UI相关

  getTable = ({
    tableStyle = {},
    tbodyStyle = {},
    trStyle = {},
    tdStyle = {},
    labelStyle = {},
    dataStyle = {},
    columnCount = 1,
    labelWidthPercent = 0.35,
    labelSuffix = ":",
    data = {},
    label = {},
    dataTransform = {},
  }) => {
    // 表格默认样式
    const tableDefaultStyle = { border: `1px solid ${this.border}`, borderRight: 0, borderBottom: 0 };
    if (lodash.isFinite(tableStyle.width) || `${tableStyle.width}`.toLowerCase().endsWith("px")) {
      tableDefaultStyle.width = tableStyle.width;
    } else {
      tableDefaultStyle.width = "100%";
    }
    // 计算列宽度
    const widthStr = `${tableDefaultStyle.width}`.toLowerCase();
    let labelWidth = `${100 / columnCount * labelWidthPercent}%`;
    let dataWidth = `${100 / columnCount * (1 - labelWidthPercent)}%`;
    let lastLabelWidth = `${100 / columnCount * labelWidthPercent}%`;
    let lastDataWidth = `${100 / columnCount * (1 - labelWidthPercent)}%`;
    if (lodash.isFinite(tableDefaultStyle.width) || widthStr.endsWith("px")) {
      let width;
      if (lodash.isFinite(tableDefaultStyle.width)) {
        width = tableDefaultStyle.width;
      } else {
        width = lodash.toFinite(widthStr.substr(0, widthStr.length - 2));
      }
      const columnWidth = Math.floor(width / columnCount);
      labelWidth = columnWidth * labelWidthPercent;
      dataWidth = columnWidth - labelWidth;
      const lastColumnWidth = width - (columnWidth * (columnCount - 1));
      lastLabelWidth = lastColumnWidth * labelWidthPercent;
      // 减去边框宽度 1px
      lastDataWidth = lastColumnWidth - lastLabelWidth - 1;
    }
    // label单元格默认样式
    const labelDefaultStyle = {
      borderRight: `1px solid ${this.border}`,
      borderBottom: `1px solid ${this.border}`,
      padding: "8px 8px",
      background: "#e7f1fa",
      fontWeight: "bold",
      display: "inline-block",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      width: labelWidth
    };
    // data单元格默认样式
    const dataDefaultStyle = {
      borderRight: `1px solid ${this.border}`,
      borderBottom: `1px solid ${this.border}`,
      padding: "8px 8px",
      display: "inline-block",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      width: dataWidth
    };
    // 构造表格行数据
    const trArray = [];
    let tr = [];
    let columnIndex = 0;
    lodash.forEach(data, (value, key) => {
      if (columnIndex >= columnCount) {
        // 需要换行
        columnIndex = 0;
        trArray.push(tr);
        tr = [];
      }
      columnIndex++;
      // 生成行列
      let labelTd;
      let valueTd;
      const labelTmp = label[key] || "";
      const dataTransformTmp = dataTransform[key];
      if (columnIndex === columnCount) {
        // 最后一列
        labelTd = this.getLabelTd({ ...labelDefaultStyle, width: lastLabelWidth, ...tdStyle, ...labelStyle }, labelSuffix, labelTmp, value, key, data);
        if (labelTd === false) return; // 当前行隐藏
        valueTd = this.getValueTd({ ...dataDefaultStyle, width: lastDataWidth, ...tdStyle, ...dataStyle }, dataTransformTmp, value, key, data);
        if (valueTd === false) return; // 当前行隐藏
      } else {
        // 不是最后一列
        labelTd = this.getLabelTd({ ...labelDefaultStyle, ...tdStyle, ...labelStyle }, labelSuffix, labelTmp, value, key, data);
        if (labelTd === false) return; // 当前行隐藏
        valueTd = this.getValueTd({ ...dataDefaultStyle, ...tdStyle, ...dataStyle }, dataTransformTmp, value, key, data);
        if (valueTd === false) return; // 当前行隐藏
      }
      // 加入 label 和 value
      tr.push(labelTd);
      tr.push(valueTd);
    });
    trArray.push(tr);
    // console.log(trArray);
    return (
      <table style={{ ...tableDefaultStyle, ...tableStyle }}>
        <tbody style={tbodyStyle}>
          {
            // 生成 tr
            trArray.map((trTmp, index) => <tr key={index} style={trStyle}>{trTmp}</tr>)
          }
        </tbody>
      </table>
    )
  }

  /**
   * style            样式
   * dataTransformTmp dataTransform配置
   * value          value
   * key            value名称
   * data           全局data
   *
   * 不需要渲染返回 false
   */
  getValueTd = (style, dataTransformTmp, value, key, data) => {
    // name: "array | ReactNode | (value, key, data) => (string | ReactNode)",
    // name: { transform: "array | ReactNode | (value, key, data) => (string | ReactNode)", style: "object", hidden: "boolean" },
    if (dataTransformTmp === undefined || dataTransformTmp === null) {
      return <td key={`${key}-value`} style={style}>{value}</td>
    }
    const dataTransformTmpType = varTypeOf(dataTransformTmp);
    if (dataTransformTmpType === TypeEnum.array) {
      return <td key={`${key}-value`} style={style}>{Mapper(dataTransformTmp, value)}</td>
    }
    if (dataTransformTmpType === TypeEnum.reactNode) {
      return <td key={`${key}-value`} style={style}>{dataTransformTmp}</td>
    }
    if (dataTransformTmpType === TypeEnum.function) {
      return <td key={`${key}-value`} style={style}>{dataTransformTmp(value, key, data)}</td>
    }
    if (dataTransformTmpType === TypeEnum.object) {
      const { transform: internalTransform, style: internalStyle, hidden } = dataTransformTmp;
      // 隐藏
      if (hidden === true) return false;
      // 渲染
      if (internalTransform === null || internalTransform === undefined) {
        return <td key={`${key}-value`} style={{ ...style, ...internalStyle }}>{value}</td>
      }
      const internalTransformType = varTypeOf(internalTransform);
      if (internalTransformType === TypeEnum.array) {
        return <td key={`${key}-value`} style={{ ...style, ...internalStyle }}>{Mapper(internalTransform, value)}</td>
      }
      if (internalTransformType === TypeEnum.reactNode) {
        return <td key={`${key}-value`} style={{ ...style, ...internalStyle }}>{internalTransform}</td>
      }
      if (internalTransformType === TypeEnum.function) {
        return <td key={`${key}-value`} style={{ ...style, ...internalStyle }}>{internalTransform(value, key, data)}</td>
      }
    }
    throw Error(`[${key}]：dataTransform配置错误`);
  }

  /**
   * style          样式
   * labelSuffix    后缀
   * labelTmp       label配置
   * value          label对应的value
   * key            value名称
   * data           全局data
   *
   * 不需要渲染返回 false
   */
  getLabelTd = (style, labelSuffix, labelTmp, value, key, data) => {
    const labelTmpType = varTypeOf(labelTmp);
    if (labelTmpType === TypeEnum.string || labelTmpType === TypeEnum.reactNode) {
      return <td key={`${key}-label`} style={style}>{labelTmp}{labelSuffix}</td>
    }
    if (labelTmpType === TypeEnum.function) {
      return <td key={`${key}-label`} style={style}>{labelTmp(value, key, data)}{labelSuffix}</td>
    }
    if (labelTmpType === TypeEnum.object) {
      const { label: internalLabel, style: internalStyle, hidden } = labelTmp;
      // 隐藏
      if (hidden === true) return false;
      // 渲染
      const internalLabelType = varTypeOf(internalLabel);
      if (internalLabelType === TypeEnum.string || internalLabelType === TypeEnum.reactNode) {
        return <td key={`${key}-label`} style={{ ...style, ...internalStyle }}>{internalLabel}{labelSuffix}</td>
      }
      if (internalLabelType === TypeEnum.function) {
        return <td key={`${key}-label`} style={{ ...style, ...internalStyle }}>{internalLabel(value, key, data)}{labelSuffix}</td>
      }
    }
    throw Error(`[${key}]：label配置错误`);
  }

  // -------------------------------------------------------------------------------------------------------------- 事件处理

  render() {
    const {
      style = {},                 // 组件样式
      title,                      // 详情表格头部标题 "string | ReactNode | (data) => (string | ReactNode)"
      footer,                     // 详情表格尾部     "string | ReactNode | (data) => (string | ReactNode)"
      tableStyle = {},            // 表格样式
      tbodyStyle = {},            // 表格body样式
      trStyle = {},               // 表格行样式
      tdStyle = {},               // 表格单元格样式
      labelStyle = {},            // label单元格样式
      dataStyle = {},             // data单元格样式
      columnCount = 1,            // 数据行数
      labelWidthPercent = 0.35,   // label单元格宽度百分比
      labelSuffix = ":",          // label单元格后缀字符串
      data = {},                  // 需要显示的数据
      label = {},                 // label配置
      dataTransform = {},         // 数据转换配置
    } = this.props;
    // const { visible, fileList, uploadResponseData: { excelImportState } } = this.state;
    return (
      <div style={{ ...style }}>
        {/* 详情表格头部标题 */}
        {
          title ?
            (title instanceof Function) ?
              title(data)
              : <div style={{ border: `1px solid ${this.border}`, borderBottom: 0, padding: "8px 8px", fontWeight: "bold", borderRadius: "4px 4px 0 0" }}>{title}</div>
            : ''
        }
        {/* 详情表格 */}
        {
          this.getTable({
            tableStyle: (style.width && (lodash.isFinite(style.width) || `${style.width}`.toLowerCase().endsWith("px"))) ? { ...tableStyle, width: style.width } : tableStyle,
            tbodyStyle,
            trStyle,
            tdStyle,
            labelStyle,
            dataStyle,
            columnCount,
            labelWidthPercent,
            labelSuffix,
            data,
            label,
            dataTransform,
          })
        }
        {/* 详情表格尾部 */}
        {
          footer ?
            (footer instanceof Function) ?
              footer(data)
              : <div style={{ border: `1px solid ${this.border}`, borderTop: 0, padding: "8px 8px", fontWeight: "bold", borderRadius: "0 0 4px 4px" }}>{footer}</div>
            : ''
        }
      </div>
    )
  }
}

export default DetailForm;
