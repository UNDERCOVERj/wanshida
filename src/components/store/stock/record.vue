<template>
    <div class="record">
        <div class="date-pick">
            <el-date-picker
                v-model="rangeDate"
                type="daterange"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
            <el-button type="primary" size="mini" @click="doSearch">搜索</el-button>
            <el-button type="primary" size="mini" @click="exportExcel">导出excel</el-button>
        </div>
        <div class="record-table">
            <el-table
                :data="recordData"
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
                    prop="count"
                    label="数量">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="reason"
                    label="备注">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="inPrice"
                    label="价格">
                </el-table-column>        
                <el-table-column
                    align="center"
                    prop="time"
                    label="过期时间">
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
                rangeDate: [],
                recordData: [],
                header: {
                    oneName: '一级分类',
                    twoName: '二级分类',
                    number: '批号',
                    operation: '操作',
                    count: '数量',
                    reason: '备注',
                    inPrice: "价格",
                    time: "过期时间"
                }
            }
        },
        methods: {
            doSearch() {
                let flag = this.rangeDate.length;
                if(flag) {
                    let params = {
                        storeId: this.storeId,
                        beginTime: this.rangeDate[0].toUTCString(),
                        endTime: this.rangeDate[1].toUTCString()
                    }

                    API.fetch('/api/administration/stock/detail/out/in', params)
                      .then((data) => {
                          this.recordData = data;
                      })                     
                }else {
                    Message('请选择日期')
                }
                       
            },
            exportExcel() {
                let flag = this.rangeDate.length;
                console.log(flag)
                if(flag) {
                    exportXlsx(this.recordData, this.header);
                }else {
                    Message('请选择日期')
                }
            }

        },
        mounted() {
            this.storeId = localStorage.getItem('storeId');
        }
    }
</script>
<style>
    .date-pick{
        padding-left: 30px;
        height: 100px;
        display: flex;
        align-items: center;
        border-top: 1px solid #d8dce5;
    }
    .date-pick .el-range-separator{
        width: auto;
    }
    .date-pick .el-button{
        margin-left: 10px;
    }
</style>
