<!-- localstorage处理吧 -->
<template>
  <div class="details">
    <div class="basic-info">
      <div class="title">基本资料</div>
      <div class="detail">
        <div class="detail-line">
          <p class="info-p">
            <span class="info-span-label">姓名:</span>
            <span class="info-span-value">{{technicianDetails.name}}</span>
          </p>
          <p class="info-p">
            <span class="info-span-label">职称:</span>
            <span class="info-span-value">{{technicianDetails.level}}</span>
          </p>
        </div>
        <div class="detail-line">
          <p class="info-p">
            <span class="info-span-label">手机号:</span>
            <span class="info-span-value">{{technicianDetails.phone}}</span>
          </p>
          <p class="info-p">
            <span class="info-span-label">学历:</span>
            <span class="info-span-value">{{technicianDetails.grad}}</span>
          </p>
        </div>
        <div class="detail-line">
          <p class="info-p">
            <span class="info-span-label">入职时间:</span>
            <span class="info-span-value">{{technicianDetails.inTime}}</span>
          </p>
        </div>        
      </div>
      <div class="title">
        <el-button type="primary" size="mini" @click="modifyFlag = true">技师资料修改</el-button>
      </div>       
    </div>
    <div class="basic-info-fee">
      <div class="manual-fee">
        <div class="fee-title">
          <h3>手工费</h3>
        </div>
        <div class="fee-detail">
          <p class="fee-detail-p">
            <span class="fee-detail-span-label">本月手工费:</span>
            <span class="fee-detail-span-value">{{technicianDetails.fee}}</span>
          </p>
          <p class="fee-detail-p">
            <span class="fee-detail-span-label">手工费合计:</span>
            <span class="fee-detail-span-value">{{technicianDetails.totalFee}}</span>
          </p>
        </div>
        <div class="fee-list">
          <div class="fee-list-date">
            <el-date-picker
              v-model="manualRangeDate"
              type="daterange"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
          <div class="fee-list-date">
            <el-button type="primary" size="mini" @click="getDetails(1)">搜索</el-button>
            <el-button type="primary" size="mini">导出excel</el-button>     
          </div>          
          <div class="fee-list-item">
            <h3>手工费明细</h3>
            <el-table
              :data="manualFormData"
              stripe
              style="width: 100%">
              <el-table-column
                align="center"
                prop="userName"
                label="客户">
              </el-table-column>
              <el-table-column
                align="center"
                prop="projectName"
                label="项目">
              </el-table-column>
              <el-table-column
                align="center"
                prop="fee"
                label="手工费实收">
              </el-table-column>
              <el-table-column
                align="center"
                prop="date"
                label="时间">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="order-fee">
        <div class="fee-title">
          <h3>开单</h3>
        </div>
        <div class="fee-detail">
          <p class="fee-detail-p">
            <span class="fee-detail-span-label">本月开单:</span>
            <span class="fee-detail-span-value">{{technicianDetails.orderFee}}</span>
          </p>
          <p class="fee-detail-p">
            <span class="fee-detail-span-label">开单合计:</span>
            <span class="fee-detail-span-value">{{technicianDetails.totalOrderFee}}</span>
          </p>
        </div>
        <div class="fee-list">
          <div class="fee-list-date">
            <el-date-picker
              v-model="orderRangeDate"
              type="daterange"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
          <div class="fee-list-date">
            <el-button type="primary" size="mini" @click="getDetails(2)">搜索</el-button>
            <el-button type="primary" size="mini">导出excel</el-button>     
          </div>
          <div class="fee-list-item">
            <h3>开单明细</h3>
            <el-table
              :data="orderFormData"
              stripe
              style="width: 100%">
              <el-table-column
                align="center"
                prop="userName"
                label="客户">
              </el-table-column>
              <el-table-column
                align="center"
                prop="projectName"
                label="项目">
              </el-table-column>
              <el-table-column
                align="center"
                prop="fee"
                label="开单金额">
              </el-table-column>
              <el-table-column
                align="center"
                prop="date"
                label="时间">
              </el-table-column>
              <el-table-column
                align="center"
                prop="type"
                label="项目类型">
              </el-table-column>              
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
        title="资料修改"
        :visible.sync="modifyFlag"
        width="40%"
        center>
        <el-form label-position="right" label-width="120px" :model="modifyDetails">
            <el-form-item label="姓名">
                <el-input v-model="modifyDetails.name"></el-input>
            </el-form-item>            
            <el-form-item label="职称">
                <el-input v-model="modifyDetails.level"></el-input>
            </el-form-item> 
            <el-form-item label="手机号">
                <el-input v-model="modifyDetails.phone"></el-input>
            </el-form-item>            
            <el-form-item label="学历">
                <el-input v-model="modifyDetails.grad"></el-input>
            </el-form-item> 
            <el-form-item label="入职日期" prop="inTime">
                <el-date-picker
                    v-model="modifyDetails.inTime"
                    type="date"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>                           
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="modify">确认</el-button>
        </span>
    </el-dialog>        
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'
  import API from '../../api/api.js'
  import {Message} from 'element-ui'
  export default {
    data() {
      return {
        manualRangeDate: [],
        orderRangeDate: [],
        technicianDetails: {},
        manualFormData: [],
        orderFormData: [],
        modifyFlag: false,
        modifyDetails: {}
      }
    },
    methods: {
      getDetails(type) {
        let details = this.technicianDetails;
        let params = {
          storeId: this.storeId,
          technicianId: details.technicianId,
          type: type
        }
        let flag;
        if(type == 1) {
          params.beginTime = this.manualRangeDate.length && this.manualRangeDate[0].toUTCString();
          params.endTime = this.manualRangeDate.length && this.manualRangeDate[1].toUTCString();

        }else {
          params.beginTime = this.orderRangeDate.length && this.orderRangeDate[0].toUTCString();
          params.endTime = this.orderRangeDate.length && this.orderRangeDate[1].toUTCString();          
        }
        flag = params.beginTime && params.endTime;
        if(flag) {
          API.fetch("/api/administration/technicians/detailed", params)
            .then((data) => {
              if(type == 1) {
                this.manualFormData = data;
              }else {
                this.orderFormData = data;
              }
            })          
        }else {
          Message('请输入日期,不能为空');
        }
        
      },
      modify() {
        let inTime = this.modifyDetails.inTime;
        let flag = true;
        if(!this.modifyDetails.name.trim() || !this.modifyDetails.level.trim() || !this.modifyDetails.grad.trim() || !inTime) {
          Message('参数不能为空');
          flag = false;
        }
        if(!/^1[0-9]{10}$/.test(this.modifyDetails.phone.trim())) {
          Message('手机号格式错误');
          flag = false;
        }
        if (flag) {
          inTime = inTime.toUTCString();
          let params = {
            storeId: this.storeId,
            technicianId: this.modifyDetails.technicianId,
            name: this.modifyDetails.name,
            phone: this.modifyDetails.phone,
            level: this.modifyDetails.level,
            grad: this.modifyDetails.grad,
            inTime: inTime
          }
          API.fetch('/api/administration/technicians/update/info', params)
            .then((data) => {
              Message('修改成功');
              this.modifyFlag = false;
              this.getInfo();
            })          
        }

      },
      getInfo() {
        this.storeId = localStorage.getItem('storeId');
        let details = JSON.parse(localStorage.getItem('technicianDetails'));
        let params = {
          storeId: this.storeId,
          technicianId: details.userId
        }
        API.fetch('/api/administration/technicians/info', params)
          .then((data) => {
            this.technicianDetails = data;
            this.technicianDetails.technicianId = details.userId;
            this.modifyDetails = Object.assign({}, this.technicianDetails);
          })        
      }
    },
    mounted() {
        this.getInfo();
    }
  }
</script>
<style scoped>
  .basic-info{
    display: flex;
    height: 99px;
    border-bottom: 1px solid #d8dce5;
  }
  .basic-info .title{
    flex: 0 0 120px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-right: 1px solid #d8dce5;
  }
  .basic-info .detail{
    display: flex;
  }
  .info-p{
    margin: 1em 5px 0 1em;
  }
  .basic-info-fee{
    display: flex;
  }
  .basic-info-fee h3{
    text-align: center;
  }
  .manual-fee{
    border-right: 1px solid #d8dce5;
  }
  .manual-fee,
  .order-fee{
    flex-basis: 50%;
    padding: 0 20px;
  }
  .fee-detail{
    display: flex;
    justify-content: space-around;
  }
  .fee-list-date{
    text-align: center;
  }
</style>
