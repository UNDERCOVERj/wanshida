<!-- 门店业绩，需要params获取门店 -->
<template>
  <div class="performance">
    <div class="detail">
        <span class="detail-ml">{{storeName}}</span>
        <span class="detail-ml">本月：{{fee}}</span>
        <el-button type="primary" size="mini" class="detail-ml">导出门店订单结余</el-button>
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
        <el-button type="primary" size="mini" class="detail-ml">导出门店流水结余</el-button>
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
        </el-table>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import API from '../../api/api.js'
export default {
    data() {
        return {
          performanceRangeDate: [],
          performanceData: [],
          storeId: '',
          storeName: '',
          fee: ''
        }
    },
    methods: {
        doSearch() {
            let params = {
                companyId: this.companyId,
                storeId: this.storeId,
                beginTime: this.performanceRangeDate.length && this.performanceRangeDate[0].toUTCString(),
                endTime: this.performanceRangeDate.length && this.performanceRangeDate[1].toUTCString()
            }
            API.fetch('/api/administration/store/achievement/query', params)
                .then((data) => {
                    this.performanceData = data;
                })
        },
        getFee() {
            let params = {
                storeId: this.storeId
            }
            API.fetch('/api/administration/store/achievement/fee/query', params)
                .then((data) => {
                    this.fee = data;
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
