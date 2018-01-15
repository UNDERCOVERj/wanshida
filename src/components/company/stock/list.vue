<!-- 内含新增一级产品，新增二级产品，出入库弹窗 -->
<template>
    <div class="stock-list">
        <div class="banner">
            <div class="project-level-1">
                <div class="project-card" v-for="(card,index) in computedCards" @click="showLevel2Project(index)" :class="{'project-card-active': index == computedLevel1ProjectIndex}">{{card.name}}</div>
            </div>
            <div class="project-lt">
                <Guide direction="left" @guideClick="guideClick" :isStart="isStart"></Guide>
            </div>
            <div class="project-rt">
                <Guide direction="right" @guideClick="guideClick" :isEnd="isEnd"></Guide>
                <div>
                    <el-button type="text" size="mini" @click="addFlag = true">新增</el-button>
                    <el-button type="text" size="mini" @click="inFlag = true">入库</el-button>
                    <el-button type="text" size="mini">导出公司结余</el-button>
                </div>
            </div>
        </div>
        <el-table
            :data="level2Project"
            stripe
            style="width: 100%">
            <el-table-column
                align="center"
                prop="name"
                label="产品名"
            >
            </el-table-column>
            <el-table-column
                align="center"
                prop="count"
                label="结余"
            >
            </el-table-column>
            <el-table-column
                align="center"
                prop="id"
                label="批号"
            >
            </el-table-column>
            <el-table-column
                align="center"
                prop="endTime"
                label="过期时间"
            >
            </el-table-column>
            <el-table-column
                align="center"
                prop="price"
                label="入库价"
            >
            </el-table-column>
            <el-table-column
                align="center"
                prop="outPrice"
                label="出库价"
            >
            </el-table-column>
            <el-table-column
                align="center"
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="initLevel2Project(scope.row)">出库</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            title="添加一级项目"
            :visible.sync="addFlag"
            width="40%"
            center>
            <el-form label-position="right" label-width="120px" :model="addFormData" ref="addFormData" :rules="addFormDataRules">
                <el-form-item label="一级分类名" prop="name">
                    <el-input v-model="addFormData.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addFlag = false">取 消</el-button>
                <el-button type="primary" @click="addLevel1Project">确认添加</el-button>
            </span>
        </el-dialog> 
        <el-dialog
            title="入库"
            :visible.sync="inFlag"
            width="40%"
            center>
            <el-form label-position="right" label-width="120px" :model="inFormData" refs="inFormData" :rules="inFormDataRules">
                <el-form-item label="选择一级分类" prop="id">
                    <el-select v-model="inFormData.id">
                        <el-option :label="card.name" :key="card.id" :value="card.id" v-for="card in level1Project"></el-option>
                    </el-select>                    
                </el-form-item>
                <el-form-item label="二级分类名" prop="name">
                    <el-input v-model="inFormData.name"></el-input>
                </el-form-item>
                <el-form-item label="入库数量" prop="number">
                    <el-input v-model="inFormData.number"></el-input>
                </el-form-item>                
                <el-form-item label="入库价格" prop="inPrice">
                    <el-input v-model="inFormData.inPrice"></el-input>
                </el-form-item>                
                <el-form-item label="出库价格" prop="outPrice">
                    <el-input v-model="inFormData.outPrice"></el-input>
                </el-form-item>  
                <el-form-item label="过期时间" prop="endTime">
                    <el-date-picker
                        v-model="inFormData.endTime"
                        placeholder="请选择日期">
                    </el-date-picker>
                </el-form-item>              
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addFlag = false">取 消</el-button>
                <el-button type="primary" @click="inLevel1Project">确认添加</el-button>
            </span>
        </el-dialog>   
        <el-dialog
            title="出库"
            :visible.sync="outFlag"
            width="40%"
            center>
            <el-form label-position="right" label-width="120px" :model="outFormData" :rules="outFormDataRules" ref="outFormData">
                <el-form-item label="批号：">
                    <span>{{outFormData.id}}</span>
                </el-form-item>                
                <el-form-item label="选择门店：" prop="storeId">
                    <el-select v-model="outFormData.storeId">
                        <el-option :label="card.name" :key="card.storeId" :value="card.storeId" v-for="card in accountTableData"></el-option>
                    </el-select>                    
                </el-form-item>          
                <el-form-item label="出库数量：" prop="number">
                    <el-input v-model="outFormData.number"></el-input>
                </el-form-item>         
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addFlag = false">取 消</el-button>
                <el-button type="primary" @click="outLevel2Project">确认添加</el-button>
            </span>
        </el-dialog>                      
    </div>
</template>
<script>
    import Guide from '../../common/guide.vue'
    import projectMixin from '../../common/projectMixin.vue'
    import API from '../../api/api.js'
    import {Message} from 'element-ui'
    export default {
        data() {
            return {
                projectListUrl: '/api/administration/company/stock/one',
                projectTwoListUrl: '/api/administration/company/stock/two',                
                level1Project: [],
                level2Project: [],
                type: 'company',
                addFlag: false,
                addFormData: {
                    name: ''
                },
                inFlag: false,
                inFormData: {
                    id: '',
                    name: '',
                    number: '',
                    inPrice: '',
                    outPrice: '',
                    endTime: []
                },
                outFlag: false,
                outFormData: {
                    id: '',
                    storeId: '',
                    number: ''
                },
                accountTableData: [],
                addFormDataRules: {
                    name: [
                        {
                            required: true,
                            message: '项目名不能为空',
                            trigger: 'blur'
                        }
                    ]
                },
                inFormDataRules: {
                    id: [
                        {
                            required: true,
                            message: '一级分类不能为空',
                            trigger: 'blur'
                        }
                    ],
                    name: [
                        {
                            required: true,
                            message: '二级分类不能为空',
                            trigger: 'blur'
                        }
                    ],
                    number: [
                        {
                            required: true,
                            message: '入库数量不能为空',
                            trigger: 'blur'
                        }
                    ],
                    inPrice: [
                        {
                            required: true,
                            message: '入库价格不能为空',
                            trigger: 'blur'
                        }
                    ],
                    outPrice: [
                        {
                            required: true,
                            message: '出库价格不能为空',
                            trigger: 'blur'
                        }
                    ],
                    endTime: [
                        {
                            required: true,
                            validate: (rule, value, callback) => {
                                if(!value.length) {
                                    callback(new Error('请选择日期'))
                                }else {
                                    callback()
                                }
                            },
                            trigger: 'blur'
                        }
                    ]                    
                },
                outFormDataRules: {
                    storeId: [
                        {
                            required: true,
                            message: '请选择门店',
                            trigger: 'blur'
                        }
                    ],
                    number: [
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
                    ]
                }
            }
        },
        mixins: [projectMixin],
        methods: {
            addLevel1Project() {
                let params = {
                    companyId: this.companyId,
                    name: this.addFormData.name
                }
                let flag;
                this.$refs.addFormData.validate((valid) => {
                    flag = valid;
                })
                if(flag) {
                    API.fetch('/api/administration/company/add/stock/one', params)
                        .then((data) => {
                            this.addFlag = false;
                            this.getFirstList(this.projectListUrl, 'stockOnePojoList', 'stockTwoPojoList');
                        })
                }
            },
            inLevel1Project() {
                let data = this.inFormData;
                let params = {
                    companyId: this.companyId,
                    id: data.id,
                    name: data.name,
                    number: data.number,
                    inPrice: data.inPrice,
                    outPrice: data.outPrice,
                    endTime: Array.isArray(data.endTime) ? '' : data.endTime.toUTCString()
                }
                let flag;
                this.$refs.inFormData.validate((valid) => {
                    flag = valid;
                })
                if(flag) {
                    API.fetch('/api/administration/company/in', params)
                        .then((data) => {
                            this.inFormData = {
                                id: '',
                                name: '',
                                number: '',
                                inPrice: '',
                                outPrice: '',
                                endTime: []
                            };
                            this.inFlag = false;
                            this.getLevel2Project();
                        })
                        .catch((err) => {
                            console.log(err)
                        })                    
                }
            },
            initLevel2Project(data) {
                this.outFormData.id = data.id;
                this.outFlag = true;
            },
            outLevel2Project() {
                let data = this.outFormData;
                let params = {
                    companyId: this.companyId,
                    id: data.id,
                    number: data.number,
                    storeId: data.storeId
                }
                let flag;
                this.$refs.outFormData.validate((valid) => {
                    flag = valid;
                })
                if(flag) {
                    API.fetch('/api/administration/company/out', params)
                        .then((data) => {
                            this.outFlag = false;
                            this.getLevel2Project();  
                            this.outFormData = {
                                id: '',
                                storeId: '',
                                number: ''
                            }                          
                        })
                        .catch((err) => {
                            console.log(err)
                        })                        
                }               
            },
            getAccount() {
                this.companyId = localStorage.getItem('companyId');
                API.fetch('/api/administration/store/list/query', {companyId: this.companyId})
                .then((data) => {
                    this.accountTableData = data instanceof Array ? data : [];
                })
            }            
        },
        mounted() {
            this.getFirstList(this.projectListUrl, 'stockOnePojoList', 'stockTwoPojoList');
            this.getAccount();
        },
        components: {
            Guide
        },
        watch: {
            addFlag(newVal) {
                if(!newVal) {
                    this.$refs.addFormData.resetFields();
                }
            },
            inFlag(newVal) {
                if(!newVal) {
                    this.$refs.inFormData.resetFields();
                }
            },
            outFlag(newVal) {
                if(!newVal) {
                    this.$refs.outFormData.resetFields();
                }                
            }
        }
    }
</script>
<style>
    .banner{
        display: flex;
        height: 100px;
        align-items: center;
        border-top: 1px solid #d8dce5;
    }
    .project-level-1{
        flex: 1;
        display: flex;
        justify-content: space-around;
    }
    .project-card{
        text-align: center;
        width: 150px;
        padding: 20px 30px;
        border: 1px solid #409EFF;
        cursor: pointer;
    }
    .project-lt{
        order: -1;
        flex: 0 0 100px;
    }
    .project-rt{
        flex: 0 0 300px;
        display: flex;
        align-items: center;
    }
    .project-card-active{
        background: #409EFF;
    }
</style>
