<!--  内含新增 -->
<template>
    <div class="account">
        <div class="account-add">
            <el-button type="primary" @click="accountAddFlag = true">新增</el-button>
        </div>
        <el-table
            :data="accountTableData"
            stripe
            style="width: 100%">
            <el-table-column
                align="center"
                prop="name"
                label="门店"
            >
            </el-table-column>
            <el-table-column
                align="center"
                prop="storeId"
                label="账号"
            >
            </el-table-column>
            <el-table-column
                align="center"
                prop="password"
                label="密码"
            >
            </el-table-column>
        </el-table>
        <el-dialog
            title="添加账号"
            :visible.sync="accountAddFlag"
            width="40%"
            center>
            <el-form label-position="right" label-width="80px" :model="accountFormData" :rules="rules" ref="accountFormData">
                <el-form-item label="门店" prop="name">
                    <el-input v-model="accountFormData.name" placeholder="十字以内"></el-input>
                </el-form-item>
                <el-form-item label="账号" prop="storeId">
                    <el-input v-model="accountFormData.storeId" placeholder="八位数字加字母"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="accountFormData.password" placeholder="八位数字加字母" type="password"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="accountAddFlag = false">取 消</el-button>
                <el-button type="primary" @click="addAccount">确认添加</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import API from '../../api/api.js'
    import {Message} from 'element-ui'
    export default {
        data() {
            let reg = /^([a-z]|[A-Z]|[0-9]){8}$/;
            let validate = (rule, value, callback) => {
                if(!value) {
                    callback(new Error('不能为空'))
                }else if (!reg.test(value)) {
                    callback(new Error('请输入八位数字加字母'));
                } else {
                    callback();
                }
            }
            let nameValidate = (rule, value, callback) => {
                if(!value.trim()) {
                    callback(new Error('门店名不能为空'))
                }else if(value.trim().length > 10) {
                    callback(new Error('门店名不能超过十个字'))
                }else {
                    callback();
                }
            }    
            return {
                accountTableData: [],
                accountAddFlag: false,
                accountFormData: {
                    storeId: '',
                    name: '',
                    password: ''
                },
                rules: {
                    name: [
                        {
                            required: true,
                            validator: nameValidate,
                            trigger: 'blur'
                        }
                    ],
                    storeId: [
                        {
                            required: true,
                            validator: validate,
                            trigger: 'blur'
                        }            
                    ],
                    password: [
                        {
                            required: true,
                            validator: validate,
                            trigger: 'blur'
                        }             
                    ]
                }
            }
        },
        methods: {
            addAccount() {
                let params = this.accountFormData;
                params.companyId = this.companyId;
                let flag;
                this.$refs.accountFormData.validate((valid) => {
                    flag = valid;
                })
                if(flag) {
                    API.fetch('/api/administration/store/add', params)
                        .then(() => {
                            Message('添加成功');
                            this.getList();
                        })
                }
            },
            getList() {
                this.companyId = localStorage.getItem('companyId');
                API.fetch('/api/administration/store/list/query', {companyId: this.companyId})
                    .then((data) => {
                        this.accountTableData = data instanceof Array ? data : [];
                        this.accountAddFlag = false;
                    })
                }
        },
        mounted() {
            this.getList();
        },
        watch: {
            accountAddFlag(newVal) {
                if(!newVal) {
                    this.$refs.accountFormData.resetFields()
                }
            }
        }
    }

</script>
<style>
    .account-add{
        height: 99px;
        display: flex;
        align-items: center;
        padding-left: 50px;
        border-bottom: 1px solid #d8dce5;
    }
</style>
