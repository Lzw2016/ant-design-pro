import React, { PureComponent } from 'react';
// import { Modal, Upload, Button, message, Alert, Table, Tooltip, Icon } from 'antd';
import lodash from 'lodash';
// import { formatMessage } from 'umi/locale';
// import classNames from 'classnames';
import { TypeEnum, varTypeOf } from "../_utils/varTypeOf";
import { MapperObject } from "../_utils/mapper";
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

  // -------------------------------------------------------------------------------------------------------------- 动态UI相关

  getTable = ({
    borderColor,
    backgroundColor,
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
    const tableDefaultStyle = { border: `1px solid ${borderColor}`, borderRight: 0, borderBottom: 0 };
    if (lodash.isFinite(tableStyle.width) || `${tableStyle.width}`.toLowerCase().endsWith("px")) {
      tableDefaultStyle.width = tableStyle.width;
    } else {
      tableDefaultStyle.width = "100%";
    }
    // 计算列宽度 Math.floor
    let allWidth = `${tableDefaultStyle.width}`.toLowerCase();                                                  // 总宽度
    const labelWidthNum = (100 / columnCount * labelWidthPercent);                                              // label宽度
    const dataWidthNum = (100 / columnCount * (1 - labelWidthPercent));                                         // value宽度
    const lastLabelWidthNum = ((100 - (labelWidthNum + dataWidthNum) * (columnCount - 1)) * labelWidthPercent); // 最后一个label宽度
    const lastDataWidthNum = 100 - (labelWidthNum + dataWidthNum) * (columnCount - 1) - lastLabelWidthNum;      // 最后一个value宽度
    let labelWidth = `${labelWidthNum}%`;
    let dataWidth = `${dataWidthNum}%`;
    let lastLabelWidth = `${lastLabelWidthNum}%`;
    let lastDataWidth = `${lastDataWidthNum}%`;
    // 总宽度 是绝对宽度
    if (lodash.isFinite(tableDefaultStyle.width) || allWidth.endsWith("px")) {
      if (lodash.isFinite(tableDefaultStyle.width)) {
        allWidth = tableDefaultStyle.width;
      } else {
        allWidth = lodash.toFinite(allWidth.substr(0, allWidth.length - 2));
      }
      const columnWidth = Math.floor(allWidth / columnCount);
      labelWidth = columnWidth * labelWidthPercent;
      dataWidth = columnWidth - labelWidth;
      const lastColumnWidth = allWidth - (columnWidth * (columnCount - 1));
      lastLabelWidth = lastColumnWidth * labelWidthPercent;
      // 减去边框宽度 1px
      lastDataWidth = lastColumnWidth - lastLabelWidth - 1;
    }
    // label单元格默认样式
    const labelDefaultStyle = {
      borderRight: `1px solid ${borderColor}`,
      borderBottom: `1px solid ${borderColor}`,
      padding: "8px 8px",
      background: backgroundColor,
      fontWeight: "bold",
      display: "inline-block",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      width: labelWidth
    };
    // data单元格默认样式
    const dataDefaultStyle = {
      borderRight: `1px solid ${borderColor}`,
      borderBottom: `1px solid ${borderColor}`,
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
      let labelTdStyle;
      let valueTdStyle;
      const labelTmp = label[key] || "";
      const dataTransformTmp = dataTransform[key];
      if (columnIndex === columnCount) {
        // 最后一列
        labelTdStyle = { ...labelDefaultStyle, width: lastLabelWidth, ...tdStyle, ...labelStyle };
        valueTdStyle = { ...dataDefaultStyle, width: lastDataWidth, ...tdStyle, ...dataStyle };
      } else {
        // 不是最后一列
        labelTdStyle = { ...labelDefaultStyle, ...tdStyle, ...labelStyle };
        valueTdStyle = { ...dataDefaultStyle, ...tdStyle, ...dataStyle };
      }
      const labelTd = this.getLabelTd(labelTdStyle, labelSuffix, labelTmp, value, key, data);
      if (labelTd === false) return; // 当前行隐藏
      const valueTd = this.getValueTd(valueTdStyle, dataTransformTmp, value, key, data, count => {
        const colSpan = {};
        const columnIndexTmp = columnIndex - 1 + count;
        if (columnIndexTmp >= columnCount) {
          // 最后一列
          let countTmp = count;
          if (columnIndexTmp > columnCount) countTmp = columnCount - columnIndex + 1;

          if (lodash.isFinite(allWidth)) {
            colSpan.width = dataWidth + (lastLabelWidth + lastDataWidth) + (labelWidth + dataWidth) * (countTmp - 2);
          } else {
            colSpan.width = `${dataWidthNum + (lastLabelWidthNum + lastDataWidthNum) + (labelWidthNum + dataWidthNum) * (countTmp - 2)}%`;
          }
        } else {
          // 不是最后一列
          // eslint-disable-next-line no-lonely-if
          if (lodash.isFinite(allWidth)) {
            colSpan.width = dataWidth + (labelWidth + dataWidth) * (count - 1);
          } else {
            colSpan.width = `${dataWidthNum + (labelWidthNum + dataWidthNum) * (count - 1)}%`;
          }
        }
        columnIndex = columnIndexTmp;
        return colSpan;
      });
      if (valueTd === false) return; // 当前行隐藏
      // 加入 label 和 value
      tr.push(labelTd);
      tr.push(valueTd);
    });
    // 补充行尾空白
    if (columnIndex > 0 && columnIndex < columnCount) {
      // 计算宽度
      let fillingWidth;
      if (lodash.isFinite(allWidth)) {
        fillingWidth = allWidth - (labelWidth + dataWidth) * columnIndex - 1;
      } else {
        fillingWidth = `${100 - (labelWidthNum + dataWidthNum) * columnIndex}%`;
      }
      tr.push(
        <td
          key="table-filling"
          style={{ ...dataDefaultStyle, ...tdStyle, ...dataStyle, width: fillingWidth, textAlign: "center" }}
        >
          -
        </td>
      );
    }
    // 加入最后一行
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
   * style              样式
   * dataTransformTmp   dataTransform配置
   * value              value
   * key                value名称
   * data               全局data
   *
   * 不需要渲染返回 false
   */
  getValueTd = (style, dataTransformTmp, value, key, data, callColSpan) => {
    // console.log(" getValueTd --> ", value, key);
    if (dataTransformTmp === undefined || dataTransformTmp === null) {
      return <td key={`${key}-value`} style={style}>{value || "-"}</td>
    }
    const dataTransformTmpType = varTypeOf(dataTransformTmp)
    if (dataTransformTmpType === TypeEnum.array) {
      const object = MapperObject(dataTransformTmp, value, { label: value });
      if (varTypeOf(object) === TypeEnum.object) {
        const { label, color } = object;
        return (
          <td key={`${key}-value`} style={style}>
            <span style={{ ...object.style, color }}>{label || "-"}</span>
          </td>
        )
      }
      return <td key={`${key}-value`} style={style}>{object || "-"}</td>
    }
    if (dataTransformTmpType === TypeEnum.reactNode) {
      return <td key={`${key}-value`} style={style}>{dataTransformTmp || "-"}</td>
    }
    if (dataTransformTmpType === TypeEnum.function) {
      return <td key={`${key}-value`} style={style}>{dataTransformTmp(value, key, data) || "-"}</td>
    }
    if (dataTransformTmpType === TypeEnum.object) {
      const { transform: internalTransform, style: internalStyle, columnCount, hidden } = dataTransformTmp;
      // 隐藏
      if (hidden === true) return false;
      // 处理跨列宽度样式
      let colSpan = {};
      if (varTypeOf(columnCount) === TypeEnum.number && columnCount > 1 && callColSpan instanceof Function) {
        colSpan = callColSpan(columnCount);
        // console.log(colSpan);
      }
      // 渲染
      if (internalTransform === null || internalTransform === undefined) {
        return <td key={`${key}-value`} style={{ ...style, ...internalStyle, ...colSpan }}>{value || "-"}</td>
      }
      const internalTransformType = varTypeOf(internalTransform);
      if (internalTransformType === TypeEnum.array) {
        const object = MapperObject(internalTransform, value, { label: value });
        if (varTypeOf(object) === TypeEnum.object) {
          const { label, color } = object;
          return (
            <td key={`${key}-value`} style={{ ...style, ...internalStyle, ...colSpan }}>
              <span style={{ ...object.style, color }}>{label || "-"}</span>
            </td>
          )
        }
        return <td key={`${key}-value`} style={{ ...style, ...internalStyle, ...colSpan }}>{object || "-"}</td>
      }
      if (internalTransformType === TypeEnum.reactNode) {
        return <td key={`${key}-value`} style={{ ...style, ...internalStyle, ...colSpan }}>{internalTransform || "-"}</td>
      }
      if (internalTransformType === TypeEnum.function) {
        return <td key={`${key}-value`} style={{ ...style, ...internalStyle, ...colSpan }}>{internalTransform(value, key, data) || "-"}</td>
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
      borderColor = "#e8e8e8",    // 边框颜色 rgb(216, 236, 252)
      backgroundColor = "#fafafa",// label单元格背景颜色 #e7f1fa
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
              : (
                <div
                  style={{
                    border: `1px solid ${borderColor}`,
                    borderBottom: 0,
                    padding: "8px 8px",
                    fontWeight: "bold",
                    borderRadius: "4px 4px 0 0",
                    fontSize: 16,
                  }}
                >
                  {title}
                </div>
              )
            : ''
        }
        {/* 详情表格 */}
        {
          this.getTable({
            borderColor,
            backgroundColor,
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
              : (
                <div
                  style={{
                    border: `1px solid ${borderColor}`,
                    borderTop: 0,
                    padding: "8px 8px",
                    fontWeight: "bold",
                    borderRadius: "0 0 4px 4px",
                    fontSize: 16,
                  }}
                >
                  {footer}
                </div>
              )
            : ''
        }
      </div>
    )
  }
}

export default DetailForm;
