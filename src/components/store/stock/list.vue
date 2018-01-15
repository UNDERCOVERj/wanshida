<!--   含入库弹窗和出库弹窗 -->
<template>
  <div class="store-stock">
    <div class="banner">
        <div class="project-level-1">
            <div class="project-card" v-for="(card,index) in computedCards" @click="showLevel2Project(index)" :class="{'project-card-active': index == computedLevel1ProjectIndex}">{{card.name}}</div>
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
                <el-button type="text" size="small" @click="">出库</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-dialog
        title="添加一级项目"
        :visible.sync="inFlag"
        width="40%"
        center>
        <el-form label-position="right" label-width="120px" :model="inFormData" :rules="inFormDataRules" ref="inFormData">
            <el-form-item label="批号" prop="number">
                <el-input v-model="inFormData.number"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="inProject(1)">查询详情</el-button>
            <el-button type="primary" @click="inProject(2)">确认入库</el-button>
        </span>
    </el-dialog>    
  </div>
</template>
<script>
    import API from '../../api/api.js'
    import Guide from '../../common/guide.vue'
    import projectMixin from '../../common/projectMixin.vue'
    export default {
        data () {
            return {
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
                                console.log(data)
                            }
                        })                    
                }
                
            }    
        },
        watch: {
            inFlag(newVal) {
                if(!newVal) {
                    this.$refs.inFormData.resetFields();
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
