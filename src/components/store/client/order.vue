<!--  生单页面，内含选择技师 -->
<template>
    <div class="order">
        <el-form :model="formData" label-width="8em">
            <el-form-item label="续单项目">
                <el-cascader
                    :options="getSelections"
                    v-model="selectedRenewProject"
                    @active-item-change="changeActive">
                </el-cascader>
            </el-form-item>
            <el-form-item label="赠送项目">
                <el-cascader
                    :options="giveProjects"
                    v-model="selectedGiveProject"
                    @active-item-change="changeActive">
                </el-cascader>
            </el-form-item>  
            <el-form-item label="卡类型">
                <el-col :span="5">
                    <el-select v-model="cardType">
                        <el-option :label="card.cardValue" :key="card.cardType" :value="card.cardType" v-for="card in formData.cardType"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="7">
                    <el-col :span="10">
                        <el-input v-model="cardValue"></el-input>
                    </el-col>
                    <el-col :span="2">
                        <span>&nbsp;{{cardType == "time" ? '天' : '次'}} </span>
                    </el-col>        
                </el-col>
            </el-form-item>
            <el-form-item label="预收价格">
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
    </div>
</template>
<script>
    import {mapGetters} from 'vuex'
    import API from '../../api/api.js'
    export default {
        data () {
            return {
                selectedRenewProject: [],
                selectedGiveProject: [],
                cardType: 'time',
                cardValue: '',
                formData: {
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
                    price: '',
                    point: '',
                    storePoint: '',
                    type: "1",
                    technicians: [],
                    technicianId: '',
                    reason: ''
                }
            }
        },
        computed: {
            ...mapGetters([
                'getSelections'
            ]),
            giveProjects() {
                return this.getSelections.slice()
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
                let params = Object.assign({}, this.formData);
                params.userId = this.userId;
                params.storeId = this.storeId;
                params.renewProject = this.selectedRenewProject[1];
                params.giveProject = this.selectedGiveProject[1];
                if(!params.giveCardId) {
                    params.giveCardId = null;
                }
                if(params.type == 3) {
                    delete params['technicianId'];
                } 
                if(this.cardType == 'time') {
                    params.day = this.cardValue;
                }else if(this.cardType == 'treat') {
                    params.courseOfTreatment = this.cardValue;
                }
                delete params['cardType']
                delete params['technicians']
                API.fetch('/api/administration/take/order', params)
                    .then((data) => {

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
