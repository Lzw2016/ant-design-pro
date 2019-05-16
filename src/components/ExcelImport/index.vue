<template>
    <div>
        <a-modal :title="`${title} - ${titleSuffix}`" :visible="visible" :width="modalWidth" :footer="null" :maskClosable="false" @cancel="importData">
            <!-- 选择上传Excel -->
            <template v-if="uploadResponseData.excelImportState.success===null">
                <a-upload
                    name="file"
                    :multiple="false"
                    accept=".xsl,.xlsx"
                    :action="uploadUrl"
                    :beforeUpload="beforeUpload"
                    @change="uploadChange"
                    :fileList="fileList"
                    :withCredentials="true"
                >
                    <a-button type="primary" icon="cloud-upload" :disabled="fileList.length>=1">上传Excel</a-button>
                </a-upload>
                <a-alert message="提示：" type="info" style="margin-top: 15px;">
                    <ul slot="description">
                        <li>请下载Excel模版，填写模版后上传到系统</li>
                        <li>一次最多能导入<span style="color: red">2000</span>条数据，超过<span style="color: red">2000</span>条的请分批上传</li>
                        <li>下载Excel导入模版请<a @click="downloadTemplate">点击这里下载</a></li>
                    </ul>
                </a-alert>
            </template>

            <!-- 展示上传错误结果 -->
            <template v-if="uploadResponseData.excelImportState.success===false">
                <a-alert type="error" message="导入失败，详情如下：" style="margin-bottom: 15px;">
                    <ul slot="description">
                        <li>
                            共上传{{ uploadResponseData.excelImportState.totalRows }}条数据，
                            成功{{ uploadResponseData.excelImportState.successRows }}条，
                            失败{{ uploadResponseData.excelImportState.failRows }}条，
                            重复数据{{ uploadResponseData.excelImportState.repeat }}条!
                        </li>
                        <li>导入数据存在{{ uploadResponseData.excelImportState.errorCount }}个错误，详情表格如下(您可以<a @click="downloadErrorData">下载导入失败数据</a>，修正后重新导入)</li>
                    </ul>
                </a-alert>
                <a-table
                    class="u-table"
                    size="small"
                    :bordered="true"
                    :rowKey="rowKey"
                    :loading="false"
                    :columns="columns"
                    :dataSource="uploadResponseData.failRows"
                >
                </a-table>

                <div style="height: 20px;">
                    <a-button style="float: right;" type="primary" @click="importData">确定</a-button>
                </div>
            </template>
            <!-- 上传成功提示 -->
            <template v-if="uploadResponseData.excelImportState.success===true">
                <a-alert type="info" message="导入数据成功：" style="margin-bottom: 15px;">
                    <!-- style="margin-bottom: 15px;" -->
                    <div slot="description">
                        共{{ uploadResponseData.excelImportState.totalRows }}条数据，
                        成功{{ uploadResponseData.excelImportState.successRows }}条，
                        重复数据{{ uploadResponseData.excelImportState.repeat }}条!
                    </div>
                </a-alert>
                <div style="height: 20px;">
                    <a-button style="float: right;" type="primary" @click="importData">确定</a-button>
                </div>
            </template>
        </a-modal>
    </div>
</template>

<script>
import { setTimeout } from 'timers';
import lodash from 'lodash';
import { downloadExcel } from "./excelUtils.js"

export default {
    components: {},
    data() {
        return {
            title: "Excel数据导入",   // 显示标题
            visible: false,          // 是否显示
            // 上传文件受控数据
            fileList: [],
            // 上传数据结果
            uploadResponseData: {
                data: "",
                headRowNum: 1,
                heads: [],
                excelImportState: {success: null, totalRows: 0, successRows: 0, failRows: 0, errorCount: 0, repeat: 0},
                failRows: [],
                importData: [],
            },
        };
    },
    computed: {
        modalWidth() {
            let width = 480;
            if (this.uploadResponseData && this.uploadResponseData.excelImportState.success===false) {
                width = "70%";
            }
            return width;
        },
        titleSuffix() {
            let suffix = "";
            if (this.uploadResponseData) {
                if (this.uploadResponseData.excelImportState.success===null) {
                    suffix = "选择导入文件";
                } else if (this.uploadResponseData.excelImportState.success===true) {
                    suffix = "导入数据成功";
                } else if (this.uploadResponseData.excelImportState.success===false) {
                    if(this.fileList && this.fileList.length>=1 && this.fileList[0].name) {
                        suffix = `操作失败,请根据提示修改 [${this.fileList[0].name}]`;
                    } else {
                        suffix = "操作失败,请根据提示修改Excel文件";
                    }
                }
            }
            return suffix;
        },
        columns() {
            const columns = [];
            let customRender = (text, record, index) => this.renderCellForExcelRowNum(text, record, index);
            columns.push({ title: "Excel行号", dataIndex: "excelRowNum", width: 80, customRender });
            if (this.uploadResponseData && this.uploadResponseData.heads && this.uploadResponseData.heads.length>0) {
                this.uploadResponseData.heads.forEach(item => {
                    const { lastHead, columnName } = item;
                    customRender = (text, record, index) => this.renderCellForRowData(columnName, text, record, index);
                    columns.push({ title: lastHead, dataIndex: columnName, customRender });
                });
            }
            return columns;
        },
    },
    // uploadUrl            Excel导入URL地址
    // templateFileUrl      Excel导入模版下载地址
    // fileMaxSizeByMB      导入Excel文件最大大小，默认10MB
    // onImportData         导入数据成功回写事件
    props: ["uploadUrl", "templateFileUrl", "fileMaxSizeByMB", "onImportData"],
    methods: {
        // 显示窗口
        showModal() {
            this.visible = true;
        },
        // 隐藏窗口
        hideModal() {
            this.visible = false;
            setTimeout(() => this.reset(), 500);
        },
        // 重置窗口
        reset() {
            this.fileList = [];
            this.uploadResponseData = {
                data: "",
                headRowNum: 1,
                heads: [],
                excelImportState: {success: null, totalRows: 0, successRows: 0, failRows: 0, errorCount: 0, repeat: 0},
                failRows: [],
                importData: [],
            };
        },
        // 下载模版文件
        downloadTemplate() {
            window.open(this.templateFileUrl);
        },
        // 上传之前文件校验
        beforeUpload(file) {
            let fileMaxSizeByMB = this.fileMaxSizeByMB;
            if (!fileMaxSizeByMB) {
                fileMaxSizeByMB = 10;
            }
            if ((file.size / 1024 / 1024) > fileMaxSizeByMB) {
                this.$message.warning(`导入Excel文件大小不能超过${fileMaxSizeByMB}MB`);
                return false;
            }
            return true;
        },
        // 上传文件状态变化
        uploadChange(info) {
            const { file, fileList } = info;
            // console.log("file", file);
            if (file && file.status==="done" && file.response && file.response.data) {
                this.fileList = fileList.map(fileItem => {
                    const { response } = fileItem;
                    let status = "uploading";
                    if (response.success === true) {
                        status = "done";
                    } else if (response.success === false) {
                        status = "error";
                    }
                    return { uid: fileItem.uid, name: fileItem.name, response, status};
                });
            } else {
                this.fileList = fileList;
            }
            if(!file.response) {
                return;
            }
            if(file.response.success === true && file.response.data) {
                // 成功
                this.uploadResponseData = file.response.data;
            } else if("removed" !== file.status) {
                // 失败
                this.$message.warning(file.response.msg);
                return;
            }
        },
        // 行数据key生成
        rowKey(record) {
            const keys = [];
            lodash.forEach(record, value => keys.push(`${value}`));
            return keys.join("|");
        },
        // 渲染Excel行号单元格
        renderCellForExcelRowNum(text, record, index) {
            const errors = [];
            if (record.rowError && record.rowError.length>0) {
                record.rowError.forEach(error => errors.push(error));
            }
            if(errors.length>0) {
                const h = this.$createElement;
                return h("div", { }, [
                    h("a-tooltip", {
                            props: { title: errors.join("; ")},
                            attrs:{ style: "cursor: pointer;color: red;" }
                        }, [
                        text,
                        h("a-icon", {
                            attrs:{ style: "margin-left: 3px;" },
                            props: { type: "warning" }
                        })
                    ])
                ]);
            }
            return text;
        },
        // 错误数据单元格渲染
        renderCellForRowData(columnName, text, record, index) {
            let errors = [];
            if (record.columnError && record.columnError[columnName] && record.columnError[columnName].length>0) {
                errors = record.columnError[columnName];
            }
            if(errors.length>0) {
                const h = this.$createElement;
                return h("div", { }, [
                    h("a-tooltip", {
                            props: { title: errors.join("; ")},
                            attrs:{ style: "cursor: pointer;color: red;" }
                        }, [
                        text,
                        h("a-icon", {
                            attrs:{ style: "margin-left: 3px;" },
                            props: { type: "warning" }
                        })
                    ])
                ]);
            }
            return text;
        },
        // 下载导入失败数据
        downloadErrorData() {
            if (!this.uploadResponseData || !this.uploadResponseData.failRows || this.uploadResponseData.failRows.length<=0) {
                this.$message.warning("没有导入失败的数据");
                return;
            }
            // 文件名处理
            let fileName = "导入失败数据.xlsx";
            if(this.fileList && this.fileList.length>=1 && this.fileList[0].name) {
                fileName = this.fileList[0].name;
                if(fileName.lastIndexOf(".") !== -1) {
                    fileName  = fileName.substr(0, fileName.lastIndexOf("."));
                }
                fileName = `${fileName}-导入失败数据.xlsx`;
            }
            // 数据处理
            const columns = [];
            const excelData = [];
            if(this.uploadResponseData.heads && this.uploadResponseData.heads.length>0) {
                this.uploadResponseData.heads.forEach((c, i) => {
                    if (c.lastHead) {
                        columns.push({name: c.columnName, title: c.lastHead, index: i});
                    } else {
                        columns.push({name: c.columnName, title: "", index: i});
                    }
                });
                columns.push({name: "导入失败原因", title: "导入失败原因"});
                // 设置Excel表头
                excelData.push(columns.map(c=> c.title));
            }
            this.uploadResponseData.failRows.forEach(item => {
                // Excel行数据
                const row = [];
                if(columns.length>0) {
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
                        error.forEach(tmp=> text.push(tmp));
                        let columnName = "";
                        if(columns.length>0 && columns.find(c=> key===c.name)) {
                            columnName = columns.find(c=> key===c.name).title;
                        }
                        if (!columnName) {
                            columnName = "";
                        }
                        row.push(`${columnName}: ${text.join("; ")}`);
                    });
                }
                if (item.rowError && item.rowError.length>0) {
                    row.push(`当前行: ${item.rowError.join("; ")}`);
                }
                excelData.push(row);
            });
            // console.log("excelData", excelData);
            downloadExcel(excelData, fileName);
        },
        // 确定导入
        importData() {
            this.hideModal();
            let importData = [];
            if(this.uploadResponseData && this.uploadResponseData.importData) {
               importData = this.uploadResponseData.importData;
            }
            this.$emit("onImportData", importData);
        }
    }
}
</script>

<style>
.test {
    width: 100%;
    margin-bottom: 35px;
    text-align: center;
    background-color: red;
    margin-left: 8px;
}
</style>
