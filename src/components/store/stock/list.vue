<!--   含入库弹窗和出库弹窗 -->
<template>
  <div class="store-stock">
    <div class="banner">
        <div class="project-level-1">
            <div @dblclick="modifyLevel1Project(card)" class="project-card" v-for="(card,index) in computedCards" @click="showLevel2Project(index)" :class="{'project-card-active': index == computedLevel1ProjectIndex}">{{card.name}}</div>
        </div>
        <div class="project-lt">
            <Guide direction="left" :isStart="isStart" @guideClick="guideClick" ></Guide>
        </div>
        <div class="project-rt">
            <Guide direction="right" :isEnd="isEnd" @guideClick="guideClick" ></Guide>
            <div>
              <el-button type="primary" @click="inFlag=true">入库</el-button>
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
            label="产品名">
        </el-table-column>
        <el-table-column
            align="center"
            prop="count"
            label="结余">
        </el-table-column>
        <el-table-column
            align="center"
            prop="id"
            label="批号">
        </el-table-column>
        <el-table-column
            align="center"
            prop="endTime"
            label="过期时间">
        </el-table-column>
        <el-table-column
            align="center"
            prop="price"
            label="入库价">
        </el-table-column>
        <el-table-column
            align="center"
            label="操作">
            <template slot-scope="scope">
                <el-button type="text" size="small" @click="shouOutForm(scope.row)">出库</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-dialog
        title="入库"
        :visible.sync="inFlag"
        width="40%"
        center>
        <el-form label-position="right" label-width="120px" :model="inFormData" :rules="inFormDataRules" ref="inFormData">
            <el-form-item label="批号" prop="number">
                <el-input v-model="inFormData.number"></el-input>
            </el-form-item>
            <el-form-item label="一级分类名" prop="oneName" v-if="inFormData.oneName != null">
                <span>{{inFormData.oneName}}</span>
            </el-form-item>            
            <el-form-item label="二级分类名" prop="twoName" v-if="inFormData.twoName != null">
                <span>{{inFormData.twoName}}</span>
            </el-form-item>            
            <el-form-item label="数量" prop="count" v-if="inFormData.count != null">
                <span>{{inFormData.count}}</span>
            </el-form-item>            
            <el-form-item label="过期时间" prop="endTime" v-if="inFormData.endTime != null">
                <span>{{inFormData.endTime}}</span>
            </el-form-item>    
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="inProject(1)">查询详情</el-button>
            <el-button type="primary" @click="inProject(2)">确认入库</el-button>
        </span>
    </el-dialog> 
    <el-dialog
        title="出库"
        :visible.sync="outFlag"
        width="40%"
        center>
        <el-form label-position="right" label-width="120px" :model="outFormData" :rules="outFormDataRules" ref="outFormData">
            <el-form-item label="产品名">
                <span>{{outFormData.name}}</span>
            </el-form-item>            
            <el-form-item label="批号">
                <span>{{outFormData.id}}</span>
            </el-form-item>            
            <el-form-item label="出库数" prop="count">
                <el-input v-model="outFormData.count"></el-input>
            </el-form-item>            
            <el-form-item label="用途" prop="reason">
                <el-input v-model="outFormData.reason"></el-input>
            </el-form-item>    
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="outProject">确认</el-button>
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
    import API from '../../api/api.js'
    import Guide from '../../common/guide.vue'
    import projectMixin from '../../common/projectMixin.vue'
    import {Message} from 'element-ui'
    export default {
        data () {
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
                projectListUrl: '/api/administration/stock/one',
                projectTwoListUrl: '/api/administration/stock/two',
                inFlag: false,
                inFormData: {
                    number: ''
                },
                type: 'store',
                inFormDataRules: {
                    number: [
                        {
                            required: true,
                            validator: (rule, value, callback) => {
                                if(!value) {
                                    callback(new Error('批号不能为空'));
                                }else if(!/^\d+$/.test(+value)) {
                                    callback(new Error('批号应为整数'))
                                }else {
                                    callback();
                                }
                            },
                            trgger: 'blur'
                        }
                    ]
                },
                numDetails: null,
                outFlag: false,
                outFormData: {
                    name: '',
                    id: '',
                    count: '',
                    reason: '' 
                },
                outFormDataRules: {
                    count: [
                        {
                            required: true,
                            trigger: 'blur',
                            validator: (rule, value, callback) => {
                                let reg = /^\d+$/;
                                if(!value.trim()) {
                                    callback(new Error('数量不能为空'));
                                }else if(!reg.test(+value)) {
                                    callback(new Error('数量应为整数'));
                                }else {
                                    callback();
                                }                                
                            }
                        }
                    ],
                    reason: [
                        {
                            required: true,
                            trigger: 'blur',
                            message: '用途为空'
                        }
                    ]
                }
            }
        },
        mixins: [projectMixin],
        methods: {
            getLevel2Project(newVal) {
                newVal = newVal || this.computedLevel1ProjectIndex;
                let index = (this.currentLevel1ProjectPage-1)*this.cardPageSize + newVal;
                let params = {
                    storeId: this.storeId,
                    id: this.level1Project[index].id
                };
                if(params.storeId) {
                    API.fetch(this.projectTwoListUrl, params)
                      .then((data) => {
                        this.level2Project = data;
                      })
                }        
            },  
            inProject(type) {
                let params = {
                    storeId: this.storeId,
                    number: this.inFormData.number,
                    type: type
                }
                let flag;
                this.$refs.inFormData.validate((valid) => {
                    flag = valid;
                });
                if(flag) {
                    API.fetch('/api/administration/stock/in', params)
                        .then((data) => {
                            if(type == 2) {
                                this.getFirstList(this.projectListUrl, 'stockOnePojoList', 'stockTwoPojoList')
                            }
                            if(type == 1) {
                                if(!data) {
                                    Message('无详情')
                                }else {
                                    this.inFormData = Object.assign({}, this.inFormData, data);
                                    Message('入库成功');   
                                } 
                            }
                        })                    
                }
            },
            shouOutForm(data) {
                this.outFormData.id = data.id;
                this.outFormData.name = data.name;
                this.outFlag = true;
            },
            outProject() {
                let flag;
                this.$refs.outFormData.validate((valid) => {
                    flag = valid;
                });     
                if(flag) {
                    let params = {
                        storeId: this.storeId,
                        id: this.outFormData.id,
                        count: this.outFormData.count,
                        reason: this.outFormData.reason
                    }   
                    API.fetch('/api/administration/stock/out', params)
                        .then((data) => {
                            this.outFlag = false;
                            this.getLevel2Project()
                            Message('出库成功');
                        })                   
                }              
                
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
                        storeId: this.storeId
                    }
                    API.fetch('/api/administration/stock/update/store/one', params)
                        .then((data) => {
                            this.getFirstList(this.projectListUrl, 'stockOnePojoList', 'stockTwoPojoList')
                            this.modifyLevel1ProjectFlag = false;
                            Message('修改成功');
                        })
                        .catch(() => {
                            Message('修改失败')
                        })
                }
            }  
        },
        watch: {
            inFlag(newVal) {
                if(!newVal) {
                    this.$refs.inFormData.resetFields();
                    this.inFormData = {
                        number: ''
                    }
                }
            },
            outFlag(newVal) {
                if(!newVal) {
                    this.$refs.outFormData.resetFields();
                    this.outFormData = {
                        name: '',
                        id: '',
                        count: '',
                        reason: '' 
                    }
                }
            },
            modifyLevel1ProjectFlag (newVal) {
                if(!newVal) {
                    this.$refs.modifyLevel1ProjectData.resetFields();
                }
            }
        },
        mounted() {
            this.getFirstList(this.projectListUrl, 'stockOnePojoList', 'stockTwoPojoList')
        }
    }
</script>
<style scoped>
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
        flex: 0 0 250px;
        display: flex;
        align-items: center;
    }
    .project-card-active{
        background: #409EFF;
    }  
</style>
