<!-- 内含核销窗口,积分换项目，时间卡管理, 疗程卡核销窗口未完成, 各种回掉函数未完成  -->
<template>
    <div class="details">
        <div class="basic-info">
            <div class="basic-info-lt">
                <span>基本资料</span>
            </div>
            <div class="basic-info-rt">
                <ul>
                    <li>
                        <span>姓名：</span>
                        <span class="info-text">{{basicInfo.name}}</span>
                    </li>
                    <li>
                        <span>手机号：</span>
                        <span class="info-text">{{basicInfo.phoneNumber}}</span>
                    </li>          
                    <li>
                        <span>生日：</span>
                        <span class="info-text">{{basicInfo.birthday | filterBirthday}}</span>
                    </li>
                    <li>
                        <span>宝宝出生日期：</span>
                        <span class="info-text">{{basicInfo.babyBirthday | filterBirthday}}</span>
                    </li>                    
                </ul>
                <ul>
                    <li>
                        <span>年龄：</span>
                        <span class="info-text">{{basicInfo.age}}</span>
                    </li>
                    <li>
                        <span>性别：</span>
                        <span class="info-text">{{basicInfo.sex}}</span>
                    </li>
                    <li>
                        <span>地址：</span>
                        <span class="info-text">{{basicInfo.address}}</span>
                    </li>
                </ul>
                <div class="balance">
                    <p>
                        <span>积分余额：</span>
                        <span class="info-text">{{basicInfo.balance}}</span>
                        <el-button type="primary" style="margin-left: 2em" @click="balanceFlag = true">积分使用</el-button>
                        <el-button type="primary" style="margin-left: 2em" @click="modifyFlag = true">修改资料</el-button>
                    </p>
                </div>
            </div>
        </div>
        <div class="basic-info">
            <div class="basic-info-lt"><span>时间卡</span></div>
            <div class="basic-info-rt">
            <div class="time-card">
                <Guide direction="left" @guideClick="guideClick" :isStart="isTimeStart"></Guide>
                <div class="time-card-content">
                    <div class="time-card-item" v-for="(timeCard, cardIndex) in computedTimeCards">
                        <p class="details-close" @click="close(timeCard, 1)">X</p>
                        <p>{{timeCard.cardName}}</p>
                        <!-- 0 正常 1 结束 2 冻结 -->
                        <p>进度：{{timeCard.status == 0 ? timeCard.progress + '/' + timeCard.limit : timeCard.status == 1 ? '结束' : '冻结'}}</p>
                        <p >
                            <el-button v-if="timeCard.status == 0 || timeCard.status == 1" size="mini" type="primary" @click="showVerify(timeCard, 1)">核销</el-button>
                            <el-button v-if="timeCard.status == 0 ||timeCard.status == 2" size="mini" type="primary" @click="showVerifyManage(timeCard)">管理</el-button>
                        </p>
                    </div>
                </div>
                <Guide direction="right" @guideClick="guideClick" :isEnd="isTimeEnd"></Guide>
            </div>
            </div>
        </div>
        <div class="basic-info">
            <div class="basic-info-lt"><span>疗程卡</span></div>
            <div class="basic-info-rt">
                <div class="treat-card">
                    <Guide direction="left" @guideClick="guideClick2" :isStart="isTreatStart"></Guide>
                    <div class="treat-card-content">
                        <div class="treat-card-item" v-for="treatCard in computedTreatCards">
                            <p class="details-close" @click="close(treatCard, 2)">X</p>
                            <p>{{treatCard.cardName}}</p>
                            <p>进度：{{treatCard.status == 0 ? treatCard.progress + '/' + treatCard.limit : treatCard.status == 1 ? '结束' : '冻结'}}</p>
                            <p v-if="treatCard.status == 0">
                                <el-button size="mini" type="primary" @click="showVerify(treatCard, 2)">核销</el-button>
                            </p>
                        </div>
                    </div>
                    <Guide direction="right" @guideClick="guideClick2" :isEnd="isTreatEnd"></Guide>
                </div>
            </div>
        </div>
        <div class="ft-details">
            <div class="consumption">
                <h3>消费明细</h3>
                <el-table
                    :data="consumptionFormData"
                    stripe
                    style="width: 100%">
                    <el-table-column
                        align="center"
                        prop="projectName"
                        label="项目">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="fee"
                        label="实收金额">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="time"
                        label="时间">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="progressStr"
                        label="消费进度">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="reason"
                        label="操作">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="remarks"
                        label="备注"
                    >  
                    </el-table-column>                 
                </el-table>
            </div>
            <div class="integral">
                <h3>积分明细</h3>
                <el-table
                    :data="integralFormData"
                    stripe
                    style="width: 100%">
                    <el-table-column
                        align="center"
                        prop="projectName"
                        label="项目">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="scoreChange"
                        label="变化详情">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="time"
                        label="时间">
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <el-dialog
            title="核销"
            :visible.sync="verifyFlag"
            width="40%"
            class="verify"
            center>
            <p class="verify-p">
                <span class="verify-label">项目：</span>
                <span class="verify-value">{{verifyFormData.projectName}}</span>
            </p>
            <p class="verify-p">
                <span class="verify-label">客户：</span>
                <span class="verify-value">{{basicInfo.name}}</span>
            </p>
            <p class="verify-p">
                <span class="verify-label">手机号：</span>
                <span class="verify-value">{{basicInfo.phoneNumber}}</span>
            </p>
            <p class="verify-p">
                <span class="verify-label">服务手工费：</span>
                <span class="verify-value">{{verifyFormData.technicianFee}}</span>
            </p>
            <p v-for="tech in verifyFormData.technicianArr" class="verify-p">
                <span class="verify-label">服务技师：</span>
                <select v-model="tech.technicianId" class="verify-value">
                <option v-for="technician in technicians" :value="technician.userId">{{technician.name}}</option>
                </select>
                <span class="verify-other" @click="addTechnicianArr">+</span>
            </p>
            <p class="verify-p">
                <span class="verify-label">备注：</span>
                <el-input class="verify-label" v-model="verifyFormData.remarks" type="textarea"></el-input>
            </p>            
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="consumptionSubmit(1)">提交</el-button>
                <el-button type="primary" @click="consumptionSubmit(2)" :disabled="isConsumptionSubmit">核销成功</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="时间卡管理"
            :visible.sync="manageFlag"
            width="40%"
            class="verify"
            center>
            <p class="verify-p">
                <span class="verify-label">项目：</span>
                <span class="verify-value">{{manageFormData.projectName}}</span>
            </p>
            <p class="verify-p">
                <span class="verify-label">客户：</span>
                <span class="verify-value">{{basicInfo.name}}</span>
            </p>
            <p class="verify-p">
                <span class="verify-label">手机号：</span>
                <span class="verify-value">{{basicInfo.phoneNumber}}</span>
            </p>
            <p class="verify-p">
                <span class="verify-label">开卡日期：</span>
                <span class="verify-value">{{manageFormData.beginTime}}</span>
            </p>
            <p class="verify-p">
                <span class="verify-label">进度：</span>
                <span class="verify-value">{{manageFormData.progress}}/{{manageFormData.limit}}</span>
            </p>
            <p class="verify-p">
                <span class="verify-label"><el-button type="primary" size="mini" @click="manageSubmit(1)">停卡</el-button></span>
                <el-button type="primary" size="mini"  @click="manageSubmit(2)">复卡</el-button>
            </p>      
            <span slot="footer" class="dialog-footer">
                <el-button @click="verifyFlag = manageFlag">取 消</el-button>
            </span>
        </el-dialog>   
        <el-dialog
            title="积分兑换"
            :visible.sync="balanceFlag"
            v-loading="true"
            width="40%"
            class="balance-use"
            center>
            <el-form :model="formData" label-width="8em" :rules="balanceRules" ref="formData">
                <el-form-item label="选择项目:" prop="balanceSelectedSelection">
                    <el-cascader
                        :options="getSelections"
                        v-model="formData.balanceSelectedSelection"
                        @active-item-change="changeActive">
                    </el-cascader>        
                </el-form-item>   
                <el-form-item label="客户名:">
                    <span>{{basicInfo.name}}</span>       
                </el-form-item>
                <el-form-item label="手机号:">
                    <span>{{basicInfo.phoneNumber}}</span>       
                </el-form-item>     
                <el-form-item label="本次使用积分" prop="point">
                    <el-input v-model="formData.point"></el-input>
                </el-form-item>                   
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="balanceSubmit(1)">提交</el-button>
                <el-button type="primary" @click="balanceSubmit(2)" :disabled="isBalanceSubmit">确认成功</el-button>
            </span>
        </el-dialog>
        <el-dialog
        title="资料修改"
        :visible.sync="modifyFlag"
        width="40%"
        center>
        <el-form label-position="right" label-width="120px" :model="modifyDetails">
            <el-form-item label="姓名">
                <el-input v-model="modifyDetails.name"></el-input>
            </el-form-item>            
            <el-form-item label="手机号">
                <el-input v-model="modifyDetails.phoneNumber"></el-input>
            </el-form-item> 
            <el-form-item label="生日">
                <el-date-picker
                    v-model="modifyDetails.birthday"
                    placeholder="请选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="宝宝出生日期">
                <el-date-picker
                    v-model="modifyDetails.babyBirthday"
                    placeholder="请选择日期">
                </el-date-picker>
            </el-form-item>            
            <el-form-item label="地址">
                <el-input v-model="modifyDetails.address"></el-input>
            </el-form-item> 
            <el-form-item label="性别">
                <el-input v-model="modifyDetails.sex"></el-input>
            </el-form-item>                  
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="modify">确认</el-button>
        </span>
    </el-dialog> 
    <el-dialog
        title="退卡"
        :visible.sync="closeFlag"
        v-loading="true"
        width="40%"
        class="balance-use"
        center>
        <el-form :model="closeFormData" label-width="8em" :rules="closeFormDataRules" ref="closeFormData">
            <el-form-item label="退卡金额:" prop="price">
                <el-input v-model="closeFormData.price"></el-input>       
            </el-form-item>                 
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="closeFlag = false">取消</el-button>
            <el-button type="primary" @click="closeSubmit">确认</el-button>
        </span>
    </el-dialog>                        
    </div>
</template>
<script>
    import Guide from '../../common/guide.vue'
    import {Message} from 'element-ui'
    import API from '../../api/api.js'
    import { mapGetters } from 'vuex'
    export default {
        data () {
            let balanceRules = {
                balanceSelectedSelection: [
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            if(value.length) {
                                callback();
                            }else {
                                callback(new Error('请选择项目'))
                            }
                        },
                        trigger: 'change'
                    }
                ],
                point: [
                    {
                        required: true,
                        message: '积分不能为空',
                        trigger: 'blur'                    
                    }
                ]
            }
            return {
                balanceRules: balanceRules,
                basicInfo: {},
                timeCards: [],
                curTimeCardPage: 1,
                cardPageSize: 3,
                treatCards: [],
                curTreatCardPage: 1,
                consumptionFormData: [],
                integralFormData: [],
                verifyFlag: false,
                initialTechnician: {},
                verifyFormData: {
                    technicianArr: [{}],// 展示服务技师有几行
                    remarks: ''
                },
                technicians: [], // 多少个技师
                manageFormData: {},
                manageFlag: false,
                balanceFlag: false,
                formData: {// 积分使用
                    balanceSelectedSelection: [],// 选定的项目
                    point: ''
                },
                isBalanceSubmit: true,
                isConsumptionSubmit: true,
                modifyFlag: false,
                modifyDetails: {},
                closeFlag: false,
                closeFormData: {
                    price: ''
                },
                closeFormDataRules: {
                    price: [
                        {
                            required: true,
                            validator: (rule, value, callback) => {
                                let reg = /^\d+$/;
                                if(!value.trim()) {
                                    callback(new Error('价格不能为空'));
                                }else if(!reg.test(+value)) {
                                    callback(new Error('价格应为整数'));
                                }else {
                                    callback();
                                }
                            },
                            trigger: 'blur'
                        }
                    ]
                },
                closeCard: {},
                closeType: 1
            }
        },
        methods: {
            guideClick(direction) {//  时间卡的
                if(direction === 'left') {
                    this.curTimeCardPage--;
                }else if(direction === 'right') {
                    this.curTimeCardPage++;
                }
            },
            guideClick2(direction) { //疗程卡的
                if(direction === 'left') {
                    this.curTreatCardPage--;
                }else if(direction === 'right') {
                    this.curTreatCardPage++;
                }
            },
            consumptionSubmit(status) {//提交表单数据
                let data = this.verifyFormData;
                let techStr = data.technicianArr.map((item) => item.technicianId).join(',')
                let params = {
                    cardId: data.cardId,
                    technicianId: techStr,
                    userId: this.userId,
                    storeId: this.storeId,
                    type: data.type,
                    status: status,
                    remarks: data.remarks
                }
                API.fetch('/api/administration/project/settlement', params)
                    .then((data) => {
                        if(status == 2) {//核销成功
                            this.verifyFlag = false;
                            Message('核销成功');
                            this.initInfo();
                        }else if(status == 1) {
                            Message('提交成功');
                            this.isConsumptionSubmit = false;
                        }   
                    })
                    .catch(() => {
                        Message('确认消费失败')
                    })
            },
            balanceSubmit(status) {
                let flag;
                this.$refs['formData'].validate((valid) => {
                    flag = valid
                })
                if (flag) {
                    let params = {
                        userId: this.userId,
                        storeId: this.storeId,
                        projectId: this.formData.balanceSelectedSelection.length && this.formData.balanceSelectedSelection[1],
                        status: status,
                        point: this.formData.point
                    }       

                    API.fetch('/api/administration/score/exchange', params) 
                        .then((data) => {
                            if(status == 1) {
                                Message('提交成功');
                                this.isBalanceSubmit = false;
                            }else {
                                Message('确认成功');
                                this.balanceFlag = false;
                                this.initInfo();
                            }
                        })
                }
            },
            showVerify(card, type) {//核销窗口
                this.verifyFlag = true;
                Object.assign(this.verifyFormData, card);
                this.verifyFormData.type = type;
            },
            showVerifyManage(timeCard) {
                this.manageFlag = true;
                this.manageFormData = timeCard;
            },
            addTechnicianArr() {
                let params = Object.assign({}, this.initialTechnician);
                this.verifyFormData.technicianArr.push(Object.assign({}, params));
            },
            manageSubmit(type) {//停复卡
                let manageFormData =  this.manageFormData;
                let params = {
                    projectId: manageFormData.projectId,
                    userId: this.userId,
                    storeId: this.storeId,
                    cardId: manageFormData.cardId,
                    type: type
                }
                API.fetch('/api/administration/card/time/update', params) 
                    .then((data) => {
                        this.manageFlag = false;
                        let text = type == 1 ? '停卡成功' : '复卡成功';
                        Message(text);
                        this.initInfo();
                    })
            },
            initInfo() {//客户管理界面详情
                let params = {
                    storeId: this.storeId,
                    userId: this.userId
                }
                API.fetch('/api/administration/customer/info', params)
                    .then((data) => {
                        this.basicInfo = data.userInfo;
                        this.modifyDetails = Object.assign({}, data.userInfo);
                        this.timeCards = data.timeCardList;
                        this.treatCards = data.frequencyCardList;
                        [].forEach.call(data.consumptionDetailList, (item) => {
                            item.progressStr = item.progress + '/' + item.limit;
                        })
                        this.$nextTick(() => {
                            this.consumptionFormData = data.consumptionDetailList;
                        })
                        this.integralFormData = data.scoreDetailList;
                    })          
            },
            changeActive(item) {
                let value = item[0];
                let params = {
                    storeId: this.storeId,
                    projectId: value
                }
                this.$store.commit('selectLevel1', {
                    params: params,
                    value: value,
                    vue: this
                })
            },
            modify() {
                let params = this.modifyDetails;
                if(params.birthday) {
                    params.birthday = new Date(params.birthday).toUTCString();
                    if(params.babyBirthday) {
                        params.babyBirthday = new Date(params.babyBirthday).toUTCString();
                    }else {
                        delete params.babyBirthday;
                    }
                    params.storeId = this.storeId;
                    params.userId = this.userId;
                    params.phone = params.phoneNumber;
                    delete params.balance
                    delete params.phoneNumber;
                    delete params.age
                    API.fetch('/api/administration/customer/update/info', params)
                        .then((data) => {
                            Message('修改成功');
                            this.initInfo();
                            this.modifyFlag = false;
                        })
                }else {
                    Message('请选择日期');
                }
                
            },
            close(card, type) {
                this.closeCard = card;
                this.closeType = type;
                this.closeFlag = true;
            },
            closeSubmit() {
                let flag;
                this.$refs.closeFormData.validate((valid) => {
                    flag = valid
                })
                if(flag) {
                    let params = {
                        storeId: this.storeId,
                        userId: this.userId,
                        cardId: this.closeCard.cardId,
                        type: this.closeType,
                        price: this.closeFormData.price
                    }
                    API.fetch("/api/administration/card/out", params)
                        .then((data) => {
                            Message('退卡成功')
                        })
                        .catch(() => {
                            Message("退卡失败")
                        })                                        
                }
                
            }
        },
        filters: {
            filterBirthday(val) {
                let str;
                if(val) {
                    str = new String(val).split(' ')[0];
                }else {
                    str = '';
                }
                return str
            }
        },
        computed: {
            ...mapGetters([
                'getSelections'
            ]),
            isTimeStart() {
                return this.curTimeCardPage  === 1;
            },
            isTimeEnd() {
                let num = Math.ceil(this.timeCards.length/this.cardPageSize);
                num = num == 0 ? 1 : num;
                return this.curTimeCardPage === num;
            },            
            isTreatStart() {
                return this.curTreatCardPage  === 1;
            },
            isTreatEnd() {
                let num = Math.ceil(this.treatCards.length/this.cardPageSize);
                num = num == 0 ? 1 : num;
                return this.curTreatCardPage === num;
            },
            computedTimeCards() {// 计算过的timecard
                return this.timeCards.slice((this.curTimeCardPage - 1)*this.cardPageSize, this.curTimeCardPage*this.cardPageSize + 1);
            },
            computedTreatCards() {
                return this.treatCards.slice((this.curTreatCardPage - 1)*this.cardPageSize, this.curTreatCardPage*this.cardPageSize + 1);
            }
        },
        components: {
            Guide
        },
        mounted() {
            this.userId = localStorage.getItem('userId');
            this.storeId = localStorage.getItem('storeId');
            this.initInfo();
            API.fetch('/api/administration/technician/list', {storeId: this.storeId})
                .then((data) => {
                    this.technicians = data;
                    this.initialTechnician.technicianId = this.technicians[0].userId;
                    this.verifyFormData.technicianArr[0] = Object.assign({}, this.initialTechnician);
                })
        },
        watch: {
            verifyFlag(newVal) {
                if(newVal) {
                    this.verifyFormData.technicianArr.splice(1);
                    this.verifyFormData.technicianArr[0] = Object.assign({}, this.initialTechnician);
                    this.verifyFormData.remarks = '';
                    this.isBalanceSubmit = true;
                }
            },
            balanceFlag(newVal) {
                if(newVal) {
                    const params = {
                        storeId: this.storeId
                    };
                    this.$store.commit('setLevel1', {
                        params: params,
                        vue: this
                    })
                    this.isConsumptionSubmit = true;
                }else {
                    this.formData.balanceSelectedSelection = [];
                    this.$refs.formData.resetFields();
                }
            },
            closeFlag(newVal) {
                if(!newVal) {
                    this.closeCard = {};
                }
            }
        }
    }
</script>
<style scoped>
    .basic-info{
        display: flex;
        border-bottom: 1px solid #d8dce5;
    }
    .basic-info-lt{
        flex: 0 0 120px;
        justify-content: center;
    }
    .basic-info-rt,
    .balance,
    .basic-info-lt{
        display: flex;
        align-items: center;
    }
    ul{
        list-style-type: none;
    }
    li{
        padding: 5px 3px;
    }
    .balance{
        margin: 0 2em;
    }
    .info-text{
        color: #5a5e66;
        font-weight: 200;
    }
    .time-card,
    .treat-card{
        display: flex;
        align-items: center;
        padding: 10px 30px;
    }
    .time-card-content,
    .treat-card-content{
        display: flex;
    }
    .time-card-item,
    .treat-card-item{
        text-align: center;
        border: 1px solid #d8dce5;
        margin: 0 10px;
        padding: 0 5px;
        width: 160px;
    }
    .ft-details{
        display: flex;
        justify-content: space-between;
    }
    .consumption,
    .integral{
        flex-basis: 48%;
    }
    .consumption h3,
    .integral h3{
        text-align: center;
    }
    .pagination{
        text-align: right;
        margin: 20px 0;
    }
    .verify-p{
        display: flex;
    }
    .verify-label{
        flex-basis: 40%;
        padding-right: 10px;
        text-align: right;
    }
    .verify-value{
        flex-basis: 40%;
    }
    .verify-other{
        padding-left: 10px;
        font-size: 1.5em;
        font-weight: bold;
        cursor: pointer;
    }
    .details-close{
        text-align: right;
        padding-right: 5px;
        cursor: pointer;
        margin: 5px 0 0 0;
    }
</style>
