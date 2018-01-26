<!--  生单页面，内含选择技师 -->
<template>
    <div class="order">
        <el-form :model="formData" label-width="8em" :rules="formDataRules" ref="formData">
            <el-form-item label="续单项目" prop="selectedRenewProject">
                <el-cascader
                    :options="getSelections"
                    v-model="formData.selectedRenewProject"
                    @active-item-change="changeActive">
                </el-cascader>
            </el-form-item>
            <el-form-item label="赠送项目">
                <el-cascader
                    :options="giveProjects"
                    v-model="formData.selectedGiveProject"
                    @active-item-change="changeActive">
                </el-cascader>
            </el-form-item>  
            <el-form-item label="卡类型" prop="cardValue">
                <el-col :span="5">
                    <el-select v-model="cardType">
                        <el-option :label="card.cardValue" :key="card.cardType" :value="card.cardType" v-for="card in formData.cardType"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="7">
                    <el-col :span="10">
                        <el-input v-model="formData.cardValue"></el-input>
                    </el-col>
                    <el-col :span="2">
                        <span>&nbsp;{{cardType == "time" ? '天' : '次'}} </span>
                    </el-col>        
                </el-col>
            </el-form-item>
            <el-form-item label="实收价格" prop="price"> 
                <el-col :span="6">
                    <el-input v-model="formData.price"></el-input>
                </el-col>                
            </el-form-item>
            <el-form-item label="赠送门店积分">
                <el-col :span="6">
                    <el-input v-model="formData.storePoint"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="赠送商城积分">
                <el-col :span="6">
                    <el-input v-model="formData.point"></el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="项目类型">
                <el-col :span="6">
                    <el-radio-group v-model="formData.type">
                        <el-radio label="1" name="type">普通</el-radio>
                        <el-radio label="2" name="type">特价</el-radio>
                        <el-radio label="3" name="type">体验</el-radio>
                    </el-radio-group>                    
                </el-col>
                <el-col :span="4">
                    <el-input placeholder="请输入体验卡号" v-if="formData.type == 3" v-model="formData.giveCardId"></el-input>
                </el-col>
            </el-form-item>  
            <el-form-item label="生单技师" v-if="formData.type != 3">
                <el-select v-model="formData.technicianId">
                    <el-option v-for="tech in formData.technicians" :label="tech.name" :value="tech.userId" :key="tech.id"></el-option>
                </el-select>
            </el-form-item> 
            <el-form-item label="备注">
                <el-col :span="6">
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="备注"
                        v-model="formData.reason">
                    </el-input>                    
                </el-col>
            </el-form-item>                       
            <el-form-item>
                <el-button type="primary" @click="doSubmit">确认支付</el-button>
            </el-form-item>
        </el-form>
        <el-dialog
            title="支付确认"
            :visible.sync="isSubmit"
            width="50%"
            center>
            <el-form label-width="30%" :model="params" class="client-add-form">
                <el-form-item label="续单项目:" v-if="params.renewProject">
                    <span>{{computedRenewProject}}</span>
                </el-form-item> 
                <el-form-item label="赠送项目:" v-if="params.gitveProject">
                    <span>{{computedGiveProject}}</span>
                </el-form-item>                               
                <el-form-item label="疗程卡:" v-if="params.courseOfTreatment">
                    <span>{{params.courseOfTreatment}}次</span>
                </el-form-item>
                <el-form-item label="时间卡:" v-if="params.day">
                    <span>{{params.day}}天</span>
                </el-form-item> 
                <el-form-item label="实收价格:" v-if="params.price">
                    <span>{{params.price}}</span>
                </el-form-item> 
                <el-form-item label="赠送门店积分:" v-if="params.storePoint">
                    <span>{{params.storePoint}}</span>
                </el-form-item> 
                <el-form-item label="赠送商城积分:" v-if="params.storePoint">
                    <span>{{params.point}}</span>
                </el-form-item>
                <el-form-item label="项目类型:" v-if="params.type">
                    <span>{{params.type == 1 ? '普通' : params.type == 2 ? '特价' : '体验'}}</span>
                </el-form-item>
                <el-form-item label="体验卡号:" v-if="params.giveCardId">
                    <span>{{params.giveCardId}}</span>
                </el-form-item>
                <el-form-item label="生单技师:" v-if="params.technicianId">
                    <span>{{computedTech}}</span>
                </el-form-item>
                <el-form-item label="备注:" v-if="params.reason">
                    <span>{{params.reason}}</span>
                </el-form-item>                                                         
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isSubmit = false">取 消</el-button>
                <el-button type="primary" @click="lastSubmit">确 定</el-button>
            </span>
        </el-dialog>        
    </div>
</template>
<script>
    import {mapGetters} from 'vuex'
    import API from '../../api/api.js'
    import {Message} from 'element-ui'
    export default {
        data () {     
            return {
                params: {},
                isSubmit: false,
                cardType: 'time',
                formData: {
                    selectedRenewProject: [],
                    selectedGiveProject: [],
                    cardType: [
                        {
                            cardType: "time",
                            cardValue: "时间卡"
                        },
                        {
                            cardType: "treat",
                            cardValue: "疗程卡"
                        }
                    ],
                    cardValue: '',
                    price: '',
                    point: '',
                    storePoint: '',
                    type: "1",
                    technicians: [],
                    technicianId: '',
                    reason: ''
                },
                formDataRules: {
                    selectedRenewProject: [
                        {
                            required: true,
                            trigger: 'change',
                            validator: (rule, value, callback) => {
                                if(!value[1]) {
                                    callback(new Error('续单项目不能为空'))
                                }else {
                                    callback()
                                }
                            }                          
                        }                        
                    ],
                    cardValue: [
                        {
                            required: true,
                            validator: (rule, value, callback) => {
                                let reg = /^\d+$/;
                                if(!value.trim()) {
                                    callback(new Error('数量不能为空'));
                                }else if(!reg.test(+value)) {
                                    callback(new Error('数量应为整数'));
                                }else {
                                    callback();
                                }
                            },
                            trigger: 'blur'
                        } 
                    ],
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

                }
            }
        },
        computed: {
            ...mapGetters([
                'getSelections'
            ]),
            giveProjects() {
                return this.getSelections.slice()
            },
            computedRenewProject() {
                let str = '';
                try {
                    let first = this.params.selectedRenewProject[0];
                    let second = this.params.selectedRenewProject[1];
                    let selections = this.getSelections;
                    for(let i = 0; i < selections.length; i++) {
                        let selection = selections[i];
                        if(selection.value == first) {
                            str += selection.label + '/';
                            for(let j = 0; j < selection.children.length; j++) {
                                let child = selection.children[j];
                                if(child.value == second) {
                                    str += child.label;
                                } 
                            }
                        }
                    }                    
                }catch(e) {

                }
                return str;                
            },
            computedGiveProject() {
                let str = '';
                try {
                    let first = this.params.selectedGiveProject[0];
                    let second = this.params.selectedGiveProject[1];
                    let selections = this.getSelections;
                    for(let i = 0; i < selections.length; i++) {
                        let selection = selections[i];
                        if(selection.value == first) {
                            str += selection.label + '/';
                            for(let j = 0; j < selection.children.length; j++) {
                                let child = selection.children[j];
                                if(child.value == second) {
                                    str += child.label;
                                } 
                            }
                        }
                    }                    
                }catch(e) {

                }
                return str;                
            },
            computedTech() {
                let name = '';
                try{
                    let val = this.params.technicianId;
                    this.formData.technicians.forEach((item) => {
                        if(item.userId == val) {
                            name = item.name;
                        }
                    })                    
                }catch(e) {

                }
                return name              
            }           
        },
        methods: {
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
            doSubmit() {
                let flag;
                this.$refs.formData.validate((valid) => {
                    flag = valid
                })
                if(this.formData.type != 3 && !this.formData.technicianId) {
                    flag = false;
                    Message('请选择生单技师')
                }
                if(flag) {
                    let params = Object.assign({}, this.formData);
                    params.userId = this.userId;
                    params.storeId = this.storeId;
                    params.renewProject = params.selectedRenewProject[1];
                    params.giveProject = params.selectedGiveProject[1];
                    if(!params.giveCardId) {
                        params.giveCardId = null;
                    }
                    if(params.type == 3) {
                        delete params['technicianId'];
                    } 
                    if(this.cardType == 'time') {
                        params.day = params.cardValue;
                    }else if(this.cardType == 'treat') {
                        params.courseOfTreatment = params.cardValue;
                    }
                    delete params['cardType']
                    delete params['technicians']
                    this.params = params;
                    this.isSubmit = true;
                }
            },
            lastSubmit() {
                API.fetch('/api/administration/take/order', this.params)
                    .then((data) => {
                        Message('支付成功');
                        this.isSubmit = false;
                        this.$router.push('/store/client/details');
                    })
            }       
        },
        mounted() {
            this.storeId = localStorage.getItem('storeId');
            this.userId = localStorage.getItem('userId');
            const params = {
                storeId: this.storeId
            };
            this.$store.commit('setLevel1', {
                params: params,
                vue: this
            })     
            API.fetch('/api/administration/technician/list', {storeId: this.storeId})
                .then((data) => {
                    this.formData.technicians = data;
                })                
        }
    }
</script>
