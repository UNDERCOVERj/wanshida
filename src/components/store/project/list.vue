<!-- 内含新增一级项目，二级项目 -->
<template>
    <div class="project">
        <div class="banner">
            <div class="project-level-1">
                <div @dblclick="modifyLevel1Project(card)" class="project-card" v-for="(card,index) in computedCards" @click="showLevel2Project(index)" :class="{'project-card-active': index == computedLevel1ProjectIndex}">{{card.projectName}}</div>
            </div>
            <div class="project-lt">
                <Guide direction="left" @guideClick="guideClick" :isStart="isStart"></Guide>
            </div>
            <div class="project-rt">
                <Guide direction="right" @guideClick="guideClick" :isEnd="isEnd"></Guide>
                <div>
                    <el-button type="primary" size="mini" @click="level1ProjectFlag = true">新增一级项目</el-button>
                </div>
            </div>
        </div>
        <div class="project-operation">
            <el-button type="primary" size="mini" @click="level2ProjectFlag = true">新增二级项目</el-button>
        </div>
        <el-table
            :data="level2Project"
            stripe
            style="width: 100%">
            <el-table-column
                align="center"
                prop="projectName"
                label="产品名"
            >
            </el-table-column>
            <el-table-column
                align="center"
                prop="price"
                label="价格"
            >
            </el-table-column>
            <el-table-column
                align="center"
                prop="oncePrice"
                label="单次手工费"
            >
            </el-table-column>
            <el-table-column
                align="center"
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="deleteLevel2Project(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            title="添加一级项目"
            :visible.sync="level1ProjectFlag"
            width="40%"
            center>
            <el-form label-position="right" label-width="120px" :model="level1ProjectFormData" :rules="level1ProjectFormDataRules" ref="level1ProjectFormData">
                <el-form-item label="一级项目名" prop="name">
                    <el-input v-model="level1ProjectFormData.name"></el-input>
                </el-form-item>
            </el-form>
                <span slot="footer" class="dialog-footer">
                <el-button @click="level1ProjectFlag = false">取 消</el-button>
                <el-button type="primary" @click="addLevel1Project">确认添加</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="添加二级项目"
            :visible.sync="level2ProjectFlag"
            width="40%"
            center>
            <el-form label-position="right" label-width="10em" :model="level2ProjectFormData" :rules="level2ProjectFormDataRules" ref="level2ProjectFormData">
                <el-form-item label="二级项目名" prop="name">
                    <el-input v-model="level2ProjectFormData.name"></el-input>
                </el-form-item>
                <el-form-item label="二级项目单次价" prop="price">
                    <el-input v-model="level2ProjectFormData.price"></el-input>
                </el-form-item>
                <el-form-item label="单次手工费" prop="oncePrice">
                    <el-input v-model="level2ProjectFormData.oncePrice"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="level2ProjectFlag = false">取 消</el-button>
                <el-button type="primary" @click="addLevel2Project">确认添加</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="修改一级项目"
            :visible.sync="modifyLevel1ProjectFlag"
            width="40%"
            center>
            <el-form label-position="right" label-width="10em" :model="modifyLevel1ProjectData" :rules="modifyLevel1ProjectDataRules" ref="modifyLevel1ProjectData">
                <el-form-item label="一级项目名" prop="name">
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
    import {Message} from 'element-ui'
    import projectMixin from '../../common/projectMixin.vue'
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
                            message: '项目名不能为空'
                        }
                    ]
                        
                },
                projectListUrl: '/api/administration/project/list',
                projectTwoListUrl: '/api/administration/project/two/list',
                type: 'store',
                pType: 'project',
                level1ProjectFormDataRules: {
                    name: [
                        {
                            required: true,
                            message: '项目名不能为空',
                            trigger: 'blur'
                        }
                    ]
                },
                level2ProjectFormDataRules: {
                    name: [
                        {
                            required: true,
                            message: '项目名不能为空',
                            trigger: 'blur'
                        }
                    ],
                    price: [
                        {
                            required: true,
                            message: '单次价不能为空',
                            trigger: 'blur'
                        }
                    ],
                    oncePrice: [
                        {
                            required: true,
                            message: '单次手工费不能为空',
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
                    stroeId: this.storeId,
                    name: this.level1ProjectFormData.name
                }
                let flag;
                this.$refs.level1ProjectFormData.validate((valid) => {
                    flag = valid;
                })
                if(flag) {
                    API.fetch('/api/administration/project/one/add', params)
                        .then((data) => {
                            this.level1ProjectFlag = false;
                            Message('添加成功');
                            this.getFirstList('store', this.projectListUrl);
                        })
                        .catch(() => {
                            Message('添加失败');
                        })
                }
            },
            addLevel2Project() {
                let params = Object.assign({storeId: this.storeId}, this.level2ProjectFormData)
                params.price = parseFloat(params.price);
                params.oncePrice = parseFloat(params.oncePrice);
                params.oneProjectId = this.computedCards[this.computedLevel1ProjectIndex].projectId;
                let flag;
                this.$refs.level2ProjectFormData.validate((valid) => {
                    flag = valid;
                })
                if(flag) {
                    API.fetch('/api/administration/project/two/add', params)
                        .then((data) => {
                            Message('添加成功')
                            this.level2ProjectFlag = false;
                            this.getLevel2Project();
                        })
                        .catch(() => {
                            Message('添加失败')
                        })          
                }
            },
            deleteLevel2Project(item) {
                let params = {
                    storeId: this.storeId,
                    projectId: item.projectId
                }
                API.fetch('/api/administration/project/two/delete', params)
                    .then((data) => {
                        this.getLevel2Project();
                        Message('删除成功');
                        this.$store.commit('resetSelections')
                    })
            },
            modifyLevel1Project (card) {
                this.modifyLevel1ProjectData.name = card.projectName;
                this.modifyLevel1ProjectData.projectId = card.projectId;
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
                    API.fetch('/api/administration/project/one/update', params)
                        .then((data) => {
                            this.getFirstList(this.projectListUrl, 'projectOnePojoList', 'projectTwoPojoList')
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
            this.getFirstList(this.projectListUrl, 'projectOnePojoList', 'projectTwoPojoList')
        },
        watch: {
            level2ProjectFlag (newVal) {
                if(!newVal) {
                    this.$refs.level2ProjectFormData.resetFields();
                }
            },
            level1ProjectFlag (newVal) {
                if(!newVal) {
                    this.$refs.level1ProjectFormData.resetFields();
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
<style scoped>
    .banner{
        display: flex;
        height: 100px;
        align-items: center;
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
    .project-card-active{
        background: #409EFF;
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
    .project-operation{
        padding: 20px 0 20px 40px;
    }
</style>
