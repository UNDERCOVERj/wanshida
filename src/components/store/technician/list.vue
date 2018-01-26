<!-- add technician -->
<template>
    <div class="technician-list">
        <div class="technician-list-add">
            <el-button type="primary" @click="technicianAddFlag = true">新增</el-button>
        </div>
        <div class="technician-list-item">
            <el-table
            :data="technicians"
            stripe
            style="width: 100%">
            <el-table-column
                align="center"
                prop="name"
                label="姓名">
            </el-table-column>
            <el-table-column
                align="center"
                prop="phoneNumber"
                label="手机号">
            </el-table-column>
            <el-table-column
                align="center"
                prop="level"
                label="职称">
            </el-table-column>
            <el-table-column
                align="center"
                prop="manualFee"
                label="本月手工费">
            </el-table-column>
            <el-table-column
                align="center"
                label="本月开单"
                prop="totalFee">
            </el-table-column>
            <el-table-column
                align="center"
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="goToTechnicianDetails(scope.row)">详情</el-button>
                </template>
            </el-table-column>
            </el-table>
            <el-dialog
                title="添加技师"
                :visible.sync="technicianAddFlag"
                width="40%"
                center>
                <el-form label-position="right" label-width="80px" :model="technicianFormData" :rules="technicianFormDataRules" ref="technicianFormData">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="technicianFormData.name"></el-input>
                        </el-form-item>
                    <el-form-item label="手机号" prop="phone">
                        <el-input v-model="technicianFormData.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="职称" prop="level">
                        <el-input v-model="technicianFormData.level"></el-input>
                    </el-form-item>
                    <el-form-item label="学历" prop="grad">
                        <el-input v-model="technicianFormData.grad"></el-input>
                    </el-form-item>
                    <el-form-item label="入职日期" prop="inTime">
                        <el-date-picker
                            v-model="technicianFormData.inTime"
                            type="date"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>                    
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="technicianAddFlag = false">取 消</el-button>
                    <el-button type="primary" @click="addTechnician">确认添加</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import API from '../../api/api.js'
    import {Message} from 'element-ui'
    export default {
    data() {
        return {
            technicians: [],
            technicianAddFlag: false,
            technicianFormData: {
                name: '',
                phone: '',
                level: '',
                grad: '',
                inTime: ''
            },
            technicianFormDataRules: {
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
                        validator: (rule, value, callback) => {
                            let reg = /^1[0-9]{10}$/;
                            if(!value) {
                                callback(new Error('手机号不能为空'));
                            }else if (!reg.test(value)) {
                                callback(new Error('手机号格式不正确'));
                            }else {
                                callback()
                            }
                        },
                        trigger: 'blur'
                    }
                ],
                level: [
                    {
                        required: true,
                        message: '职称不能为空',
                        trigger: 'blur'
                    }
                ],
                grad: [
                    {
                        required: true,
                        message: '学历不能为空',
                        trigger: 'blur'
                    }
                ],
                inTime: [
                    {
                        required: true,
                        validator: (value, rule, callback) => {
                            if(!value) {
                                callback(new Error('请选择出生日期'));
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
    methods: {
        addTechnician() {
            let flag;
            this.$refs.technicianFormData.validate((valid) => {
                flag = valid;
            })
            if(flag) {
                let params = Object.assign({
                    storeId: this.storeId
                }, this.technicianFormData)
                params.inTime = params.inTime.toUTCString();
                API.fetch('/api/administration/technicians/add', params)
                    .then((data) => {
                        this.getList();
                        Message('添加成功');
                        this.technicianAddFlag = false;
                    })
                    .catch((err) => {
                        Message('添加失败')
                    })
            }
        },
        goToTechnicianDetails(detail) {// 跳到详情页
            localStorage.setItem('technicianDetails', JSON.stringify(detail))
            this.$router.push('/store/technician/details');
        },
        getList() {
            API.fetch('/api/administration/technician/list', {storeId: this.storeId})
              .then((data) => {
                this.technicians = data;
              })        
        }
    },
    watch: {
        technicianAddFlag(newVal) {
            if(!newVal) {
                this.$refs.technicianFormData.resetFields();
            }
        }
    },
    mounted() {
        this.storeId = localStorage.getItem('storeId');
        this.getList();
    }
}
</script>
<style>
.technician-list-add{
  padding: 10px 20px;
}
</style>
