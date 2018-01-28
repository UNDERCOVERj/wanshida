<!-- 客户列表页，内含新增客户弹窗, 新增窗口确定接口还为写，分页回掉函数未加 -->
<template>
    <div class="client">
        <div class="operate">
            <el-input
                class="searchbox"
                placeholder="请输入内容"
                suffix-icon="el-icon-search"
                size="small"
                width="100"
                v-model="searchphoneNumber">
            </el-input>
            <el-button type="primary" size="small" @click="doSearch">查询</el-button>
            <el-button type="primary" size="small" @click="clientAddFlag=true">新增</el-button>
        </div>
        <el-table
            :data="tableData"
            stripe
            cell-class-name="table-cell"
            style="width: 100%">
            <el-table-column
                align="center"
                prop="name"
                label="姓名">
                <template slot-scope="scope" >
                    <div>
                        <el-badge :value="7" :max="99" class="item" v-if="scope.row.consumptionFalg == 1">
                            {{scope.row.name}}
                        </el-badge>
                        <span v-if="scope.row.consumptionFalg == 0">{{scope.row.name}}</span>                        
                    </div>
                    
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="phoneNumber"
                label="手机号"
                >
            </el-table-column>
            <el-table-column
                align="center"
                prop="birthday"
                label="出生日期">
                <template slot-scope="scope">
                    <div>
                        <el-badge is-dot v-if="scope.row.birthdayFlag == 1">{{scope.row.birthday}}</el-badge>
                        <span v-if="scope.row.birthdayFlag == 0">{{scope.row.birthday}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="age"
                label="年龄">
            </el-table-column>
            <el-table-column
                align="center"
                prop="sex"
                label="性别">
            </el-table-column>
            <el-table-column
                align="center"
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="goToClientDetails(scope.row)">详情</el-button>
                    <el-button type="text" size="small" @click="goToClientOrder(scope.row)">生单</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-size="pageSize"
                layout="total, prev, pager, next"
                :total="total">
            </el-pagination>
        </div>
        <el-dialog
            title="新增客户"
            :visible.sync="clientAddFlag"
            width="50%"
            center>
            <el-form label-width="30%" :model="clientAdd" class="client-add-form" :rules="rules" ref="clientAdd">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="clientAdd.name"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="clientAdd.phone"></el-input>
                </el-form-item>
                <el-form-item label="出生日期" prop="birthday">
                    <el-date-picker
                        v-model="clientAdd.birthday"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="clientAdd.sex">
                        <el-radio label="男">男</el-radio>
                        <el-radio label="女">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="宝宝出生日期">
                    <el-date-picker
                        v-model="clientAdd.babyBirthday"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="clientAddFlag = false">取 消</el-button>
                <el-button type="primary" @click="addClient">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import {Message} from 'element-ui'
    import Api from '../../api/api.js'
    export default {
    data() {
        let telReg = /^1[0-9]{10}$/;
        let checkPhoneNumber = (rule, value, callback) => {
            if(!value) {
                callback(new Error('手机号不能为空'));
            }else if(!telReg.test(value)) {
                callback(new Error('手机号格式错误'));
            }else {
                callback();
            }
        }
        let checkBirthday = (rule, value, callback) => {
            if(!value) {
                callback(new Error('请选择出生日期'));
            }else {
                callback();
            }
        }   
        let rules = {
            name: [
                {
                    required: true,
                    message: '姓名不能为空',
                    trigger: 'blur'
                }
            ],
            phone: [
                {
                    required: true,
                    validator: checkPhoneNumber,
                    trigger: 'blur'
                }
            ],
            sex: [
                {
                    required: true
                }
            ],
            birthday: [
                {
                    required: true,
                    validator: checkBirthday,
                    trigger: 'blur'
                }
            ]
        }
        return {
            rules: rules,
            tableData: [],
            searchphoneNumber: '',
            clientAdd: { // 新增里的表单
                name: '',
                phone: '',
                birthday: '',
                sex: '男',
                babyBirthday: ''
            },
            clientAddFlag: false, // 新增flag,
            currentPage: 1,
            pageSize: 10,
            total: 0,
            count: 0//用于handleCurrentChange
        }
    },
    methods: {
        handleCurrentChange() {
            if(this.total == this.count) {
                this.getList();
            }
        },
        goToClientDetails(data) {
            localStorage.setItem('userId', data.userId);
            this.$router.push('/store/client/details')
        },
        goToClientOrder(data) {
            localStorage.setItem('userId', data.userId);
            this.$router.push('/store/client/order')        
        },
        getList() {
            let storeId = localStorage.getItem('storeId');
            let params = {
                storeId: storeId,
                page: this.currentPage
            }
            Api.fetch('/api/administration/customer/list', params)
                .then((data) => {
                    data.userList.map((item) => {
                        item.birthday = item.birthday.split(' ')[0];// date format
                    });
                    this.tableData = data.userList;
                    this.total = this.count = data.count;//多少页不管
                })
                .catch((err) => {
                })
        },
        doSearch() {
            if(this.searchphoneNumber) {
                let storeId = localStorage.getItem('storeId');
                let params = {
                    storeId: storeId,
                    phone: this.searchphoneNumber
                }            
                Api.fetch('/api/administration/customer/query', params)
                    .then((data) => {
                        if(data) {//可能为空
                            this.total = 1; 
                            this.tableData = [data];
                        }else {
                            this.total = 0;
                            this.tableData = [];
                        }
                    })             
            }else {
                this.getList();
            }          
        },
        addClient() {
            let flag;
            this.$refs['clientAdd'].validate((valid) => {
                flag = valid
            })
            let params = Object.assign({}, this.clientAdd);
            if(!params.babyBirthday) {
                delete params.babyBirthday
            }else {
                params.babyBirthday = params.babyBirthday.toUTCString();
            }
            params.storeId = localStorage.getItem('storeId');
            if(flag) {
                params.birthday = params.birthday.toUTCString();
                          
                Api.fetch('/api/administration/customer/add', params)
                    .then((data) => {
                        Message('添加成功');
                        this.clientAddFlag = false;
                        this.currentPage = 1;
                        this.doSearch();
                    })          
            }
        }
    },
    watch: {
        clientAddFlag(newVal) {
            if(!newVal) {
                this.$refs['clientAdd'].resetFields();
                this.clientAdd.babyBirthday = ''
            }
        }
    },
    mounted() {
        this.getList();
    }
}
</script>
<style>
    .operate{
        display: flex;
        padding: 20px 0 20px 50px;
        border-bottom: 1px solid #d8dce5;
    }
    .searchbox{
        width: 200px;
        margin-right: 10px;
    }
    .table-cell .el-badge__content.is-fixed{
        top: 8px;
        right: 0px;
    }
    .table-cell .cell{
        line-height: 30px;
    }
    .client-add-form input{
        width: 60%;
    }
    .client-add-form .el-date-editor.el-input{
        width: 100%;
    }
    .pagination{
        margin: 20px 0;
        padding-right: 30px;
        text-align: right;
    }
</style>
