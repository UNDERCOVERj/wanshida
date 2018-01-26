<!-- 内含新增一级产品，新增二级产品，出入库弹窗 -->
<template>
    <div class="stock-list">
        <div class="banner">
            <div class="project-level-1">
                <div @dblclick="modifyLevel1Project(card)" class="project-card" v-for="(card,index) in computedCards" @click="showLevel2Project(index)" :class="{'project-card-active': index == computedLevel1ProjectIndex}">{{card.name}}</div>
            </div>
            <div class="project-lt">
                <Guide direction="left" @guideClick="guideClick" :isStart="isStart"></Guide>
            </div>
            <div class="project-rt">
                <Guide direction="right" @guideClick="guideClick" :isEnd="isEnd"></Guide>
                <div>
                    <el-button type="text" size="mini" @click="addFlag = true">新增</el-button>
                    <el-button type="text" size="mini" @click="inFlag = true">入库</el-button>
                    <el-button type="text" size="mini" @click="exportExcel">导出excel</el-button>
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
            <el-form label-position="right" label-width="120px" :model="inFormData" ref="inFormData" :rules="inFormDataRules">
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
        <el-dialog
            title="修改库存产品名"
            :visible.sync="modifyLevel1ProjectFlag"
            width="40%"
            center>
            <el-form label-position="right" label-width="10em" :model="modifyLevel1ProjectData" :rules="modifyLevel1ProjectDataRules" ref="modifyLevel1ProjectData">
                <el-form-item label="产品名" prop="name">
                    <el-input v-model="modifyLevel1ProjectData.name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="modifyLevel1ProjectFlag = false">取 消</el-button>
                <el-button type="primary" @click="modifyLevel1ProjectSubmit">确认修改</el-button>
            </span>
        </el-dialog>                            
    </div>
</template>
<script>
    import Guide from '../../common/guide.vue'
    import projectMixin from '../../common/projectMixin.vue'
    import API from '../../api/api.js'
    import {Message} from 'element-ui'
    import exportXlsx from '../../common/exportXlsx.js'
    export default {
        data() {
            return {
                modifyLevel1ProjectFlag: false,
                modifyLevel1ProjectData: {
                    name: ''
                },
                modifyLevel1ProjectDataRules: {
                    name: [
                        {
                            required: true,
                            trigger: 'blur',
                            message: '库存名不能为空'
                        }
                    ]
                        
                },
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
                            trigger: 'change'
                        }
                    ]
                },
                inFormDataRules: {
                    id: [
                        {
                            required: true,
                            trigger: 'change',
                            validator: (rule, value, callback) => {
                                if(!value) {
                                    callback(new Error('一级分类名不能为空'))
                                }else {
                                    callback()
                                }
                            }                          
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
                            validator: (rule, value, callback) => {
                                if(Array.isArray(value) || !value) {
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
                            trigger: 'blur',
                            validator: (rule, value, callback) => {
                                if(!value) {
                                    callback(new Error('请选择门店'))
                                }else {
                                    callback()
                                }
                            }                            
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
                },
                header: {
                    name: '产品名',
                    count: '结余',
                    id: '批号',
                    endTime: '过期时间',
                    price: '入库价',
                    outPrice: '出库价',
                    oneName: '一级分类名'
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
                            Message('新增成功')
                        })
                }
            },
            inLevel1Project() {
                let data = this.inFormData;
                let flag;
                this.$refs.inFormData.validate((valid) => {
                    flag = valid;
                })
                if(flag) {
                    let params = {
                        companyId: this.companyId,
                        id: data.id,
                        name: data.name,
                        number: data.number,
                        inPrice: data.inPrice,
                        outPrice: data.outPrice,
                        endTime: data.endTime.toUTCString()
                    }                    
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
                            Message('入库成功')
                        })
                        .catch((err) => {
                            Message('入库失败')
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
                            Message('出库成功')                     
                        })
                        .catch((err) => {
                            Message('出库失败')  
                        })                        
                }               
            },
            getAccount() {
                this.companyId = localStorage.getItem('companyId');
                API.fetch('/api/administration/store/list/query', {companyId: this.companyId})
                .then((data) => {
                    this.accountTableData = data instanceof Array ? data : [];
                })
            },
            exportExcel() {
                let params = {
                    companyId: this.companyId
                }
                API.fetch('/api/administration/company/stock/remain', params)
                    .then(data => {
                        data.forEach((item) => {
                            delete item.oneId
                        })
                        exportXlsx(data, this.header);
                    })
                    .catch(() => {
                        Message('导出错误')
                    })              
            },
            modifyLevel1Project (card) {
                this.modifyLevel1ProjectData.name = card.name;
                this.modifyLevel1ProjectData.projectId = card.id;
                this.modifyLevel1ProjectFlag = true;
            },
            modifyLevel1ProjectSubmit() {
                let flag;
                this.$refs.modifyLevel1ProjectData.validate((valid) => {
                    flag = valid;
                })
                if (flag) {
                    let params = {
                        name: this.modifyLevel1ProjectData.name,
                        projectId: this.modifyLevel1ProjectData.projectId,
                        companyId: this.companyId
                    }
                    API.fetch('/api/administration/stock/update/company/one', params)
                        .then((data) => {
                            this.getFirstList(this.projectListUrl, 'stockOnePojoList', 'stockTwoPojoList');
                            this.modifyLevel1ProjectFlag = false;
                            Message('修改成功');
                        })
                        .catch(() => {
                            Message('修改失败')
                        })
                }
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
                    this.$refs['inFormData'].resetFields();
                }
            },
            outFlag(newVal) {
                if(!newVal) {
                    this.$refs.outFormData.resetFields();
                }                
            },
            modifyLevel1ProjectFlag (newVal) {
                if(!newVal) {
                    this.$refs.modifyLevel1ProjectData.resetFields();
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
