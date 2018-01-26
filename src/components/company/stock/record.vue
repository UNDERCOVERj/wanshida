<template>
    <div class="stock-record">
        <div class="stock-record-date">
            <el-date-picker
                v-model="recordRangeDate"
                unlink-panels
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
            <el-button type="primary" size="mini" @click="doSearch">查询</el-button>
            <el-button type="primary" size="mini" @click="exportExcel">导出公司出入库记录</el-button>
        </div>
        <div class="stock-record-list">
            <el-table
                :data="items"
                stripe
                style="width: 100%">
                <el-table-column
                    align="center"
                    prop="oneName"
                    label="一级分类">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="twoName"
                    label="二级分类">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="number"
                    label="批号">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="operation"
                    label="操作">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="inPrice"
                    label="入库价">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="outPrice"
                    label="出库价">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="count"
                    label="数量">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="reason"
                    label="门店">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="time"
                    label="时间">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
    import API from '../../api/api.js'
    import {Message} from 'element-ui'
    import exportXlsx from '../../common/exportXlsx.js'
    export default {
        data() {
            return {
                recordRangeDate: [],
                items: [],
                header: {
                    oneName: '一级分类',
                    twoName: '二级分类',
                    number: '批号',
                    operation: '操作',
                    inPrice: '入库价',
                    outPrice: '出库价',
                    count: '数量',
                    reason: '门店',
                    time: '时间'
                }
            }
        },
        methods: {
            doSearch() {
                let flag = this.recordRangeDate.length;
                if(flag) {
                    let startTime = this.recordRangeDate[0];
                    let endTime = this.recordRangeDate[1];
                    let params = {
                        companyId: this.companyId,
                        beginTime: startTime.toUTCString(),
                        endTime: endTime.toUTCString()
                    };
                    API.fetch('/api/administration/company/out/list/query', params)
                        .then((data) => {
                          this.items = data;
                        })            
                }else {
                    Message('请选择日期')
                }
            },
            exportExcel() {
                let flag = this.recordRangeDate.length;
                if(flag) {
                    let data = [].slice.call(this.items);
                    data.forEach((item) => {
                        delete item.storeId;
                    })
                    exportXlsx(data, this.header);
                }else {
                    Message('请选择日期，数据为空')
                }
            }
        },
        mounted() {
            this.companyId = localStorage.getItem('companyId');
        }
    }
</script>
<style>
    .stock-record-date{
        padding: 20px;
    }
    .record-pagination{
        padding: 20px;
    }
</style>
