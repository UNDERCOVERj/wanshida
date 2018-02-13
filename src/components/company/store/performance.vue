<!-- 门店业绩，需要params获取门店 -->
<template>
  <div class="performance">
    <div class="detail">
        <span class="detail-ml">{{storeName}}</span>
        <span class="detail-ml">本月：{{fee}}</span>
        <el-button type="primary" size="mini" class="detail-ml" @click="exportExcel2">导出门店订单结余</el-button>
    </div>
    <div class="detail date">
        <el-date-picker
            class="detail-ml"
            v-model="performanceRangeDate"
            unlink-panels
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
        <el-button type="primary" size="mini" class="detail-ml" @click="doSearch">搜索</el-button>
        <el-button type="primary" size="mini" class="detail-ml" @click="exportExcel">导出门店流水明细</el-button>
    </div>
    <div class="detail">
        <el-table
            :data="performanceData"
            stripe
            style="width: 100%">
            <el-table-column
                align="center"
                prop="time"
                label="时间"
            >
            </el-table-column>
            <el-table-column
                align="center"
                prop="projectName"
                label="项目"
            >
            </el-table-column>
            <el-table-column
                align="center"
                prop="price"
                label="金额"
            >
            </el-table-column>
            <el-table-column
                align="center"
                prop="userPhone"
                label="手机号"
            >
            </el-table-column>
            <el-table-column
                align="center"
                prop="reason"
                label="事例"
            >
            </el-table-column>
            <el-table-column
                align="center"
                prop="techniciansName"
                label="技师"
            >
            </el-table-column>
            <el-table-column
                align="center"
                prop="type"
                label="项目类型">
            </el-table-column>
            <el-table-column
                align="center"
                prop="userName"
                label="客户名">
            </el-table-column>
            <el-table-column
                align="center"
                prop="remarks"
                label="备注">
            </el-table-column>                         
        </el-table>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import API from '../../api/api.js'
import {Message} from 'element-ui'
import exportXlsx from '../../common/exportXlsx.js'
export default {
    data() {
        return {
            performanceRangeDate: [],
            performanceData: [],
            storeId: '',
            storeName: '',
            fee: '',
            header: {
                time: '时间',
                projectName: '项目',
                price: '金额',
                userPhone: '手机号',
                reason: '事例',
                techniciansName: '技师',
                type: '项目类型',
                userName: '客户名',
                remarks: '备注'
            }
        }
    },
    methods: {
        doSearch() {
            let flag = this.performanceRangeDate.length;
            if(flag) {
                let params = {
                    companyId: this.companyId,
                    storeId: this.storeId,
                    beginTime: this.performanceRangeDate.length && this.performanceRangeDate[0].toUTCString(),
                    endTime: this.performanceRangeDate.length && this.performanceRangeDate[1].toUTCString()
                }
                API.fetch('/api/administration/store/achievement/query', params)
                    .then((data) => {
                        this.performanceData = data;
                        if(!this.performanceData.length) {
                            Message('数据为空')
                        }
                    })                
            }else {
                Message('请选择时间')
            }
            
        },
        getFee() {
            let params = {
                storeId: this.storeId
            }
            API.fetch('/api/administration/store/achievement/fee/query', params)
                .then((data) => {
                    this.fee = data;
                })
        },
        exportExcel() {
            let flag = this.performanceData.length;
            if(flag) {
                let data = this.performanceData.slice();
                data.forEach((item) => {
                    Object.keys(item).forEach(key => {
                        if(!this.header.hasOwnProperty(key)) {
                            delete item[key];
                        }
                    })
                })
                exportXlsx(this.performanceData, this.header);
            }else {
                Message('数据为空')
            }                
        },
        exportExcel2() {
            let params = {
                companyId: this.companyId,
                storeId: this.storeId
            }
            let excel = [];
            API.fetch('/api/administration/store/card', params)
                .then((data) => {
                    excel = data.map((item) => {
                        return {
                            cardId: item.cardId,
                            cardType: item.cardType,
                            userName: item.userName,
                            userPhone: item.userPhone,
                            createTime: item.createTime,
                            price: item.price,
                            progress: item.progress + '/' + item.limit
                        }
                    })
                    let header = {
                        cardId: '卡id',
                        cardType: '分类',
                        userName: '客户名',
                        userPhone: '客户手机号',
                        createTime: '生单时间',
                        price: '实收价格',
                        progress: '进度'
                    }
                    exportXlsx(excel, header);
                })
                .catch(() => {
                    Message('导出失败')
                })
        }         
    },
    mounted() {
        this.companyId = localStorage.getItem("companyId");
        this.storeId = localStorage.getItem("storeId");
        this.storeName = localStorage.getItem("storeName");
        this.getFee();
    }
}
</script>
<style>
  .detail{
    padding: 20px 0;
  }
  .detail-ml{
    margin-left: 30px;
  }
</style>
