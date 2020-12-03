<template>
    <div>
        <el-breadcrumb separator="/" class="mbt-20">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!-- 搜索 -->
            <el-row :gutter="80" class="mbt-20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" clearable v-model="queryInfo.query" @input="getUserList">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
            </el-row>

            <!-- 用户列表 -->
            <el-row class="mbt-20">
                <el-table :data="userList" style="width: 100%">
                    <el-table-column label="#" type="index" width="50"></el-table-column>
                    <el-table-column label="用户名" prop="username"></el-table-column>
                    <el-table-column label="电话" prop="mobile"></el-table-column>
                    <el-table-column label="邮箱" prop="email"></el-table-column>
                    <el-table-column label="添加时间" prop="create_time"></el-table-column>
                    <el-table-column label="状态">
                        <template slot-scope="scope">
                            <el-tooltip effect="dark" :content="scope.row.mg_state?'关闭该用户':'激活该用户'" placement="top">
                                <el-switch v-model="scope.row.mg_state" @change="changeUserStatus(scope.row)"></el-switch>
                            </el-tooltip>
                            
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180px">
                        <template slot-scope="scope">
                            <el-tooltip effect="dark" content="编辑" placement="top">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUser(scope.row)"></el-button>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="删除" placement="top">
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row)"></el-button>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="分配角色" placement="top">
                                <el-button type="info" icon="el-icon-s-tools" size="mini" @click="allotRole(scope.row)"></el-button> 
                            </el-tooltip>              
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>

            <!-- 分页区域 -->
            <!--  -->
            <el-row>
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[5, 10, 20]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totalNum">
                </el-pagination>
            </el-row>
        </el-card>


        <!-- 添加用户dialog -->
        <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            width="40%"
            :close-on-click-modal="false"
            :before-close="addDialogClose">
            <el-form ref="addUserForm" :model="addUserInfo"
                                :hide-required-asterisk="true"
                                label-width="80px"
                                :rules="addUserRules">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addUserInfo.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addUserInfo.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addUserInfo.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="addUserInfo.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogClose">取 消</el-button>
                <el-button type="primary" @click="saveAddUserDialog">确 定</el-button>
            </span>
        </el-dialog>


         <!-- 修改用户信息dialog -->
        <el-dialog
            title="编辑用户"
            :visible.sync="editDialogVisible"
            width="40%"
            :close-on-click-modal="false"
            :before-close="editDialogClose">
            <el-form ref="editUserForm" :model="editUserInfo"
                                :hide-required-asterisk="true"
                                label-width="80px"
                                :rules="editUserRules">
                <el-form-item label="用户名" >
                    <el-input v-model="editUserInfo.username" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editUserInfo.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="editUserInfo.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogClose">取 消</el-button>
                <el-button type="primary" @click="saveEditUserDialog">确 定</el-button>
            </span>
        </el-dialog>


        <!-- 给用户分配角色 -->
        <el-dialog
            title="分配角色"
            :visible.sync="allotDialogVisible"
            width="40%"
            :close-on-click-modal="false"
            :before-close="allotDialogClose">
            <el-row>
                <el-col class="mbt-20">
                    用户名: {{allotRoleInfo.username}}
                </el-col>
                <el-col class="mbt-20">
                    当前角色: {{allotRoleInfo.role_name}}
                </el-col>
                <el-col>
                    分配角色: <el-select v-model="id" 
                                placeholder="请选择" 
                                clearable size="small" style="width:130px;"
                                > {{id}}
                                <el-option
                                    v-for="item in roleList"
                                    :key="item.id"
                                    :label="item.roleName"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="allotDialogClose">取 消</el-button>
                <el-button type="primary" @click="saveAllotRoleDialog">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
export default {
    name : 'users',
    data () {
        let checkEmail = (rule, value, cb) => {
            // 验证邮箱的正则表达式
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
            if (regEmail.test(value)) {
                // 合法的邮箱
                return cb()
            }
            cb(new Error('请输入合法的邮箱'))
        }
        let checkMobile = (rule, value, cb) => {
            // 验证手机号的正则表达式
            const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if (regMobile.test(value)) {
                return cb()
            }
            cb(new Error('请输入合法的手机号'))
        }
        return {
            //用户数据
            userList: [],
            //用户总数
            totalNum: 0,
            queryInfo :{
                // 搜索关键字
                query : '', 
                //当前页
                pagenum : 1,
                // 一页展示5条数据
                pagesize : 5
            },
            //添加用户的dialog
            addDialogVisible: false,
            addUserInfo: {
                username:'',
                password: '',
                email: '',
                mobile :''
            },
            addUserRules : {
                username: [
                    { required: true, message: "请输入用户名", trigger: 'blur' },
                    { min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: 'blur' },
                    { min: 4, max: 16, message: '长度在 4 到 16 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: "请输入邮箱", trigger: 'blur' },
                    {validator: checkEmail, trigger: 'blur'}
                ],
                mobile: [
                    { required: true, message: "请输入手机", trigger: 'blur' },
                    {validator: checkMobile, trigger: 'blur'}
                ]
            },


            //修改用户信息
            editDialogVisible: false,
            editUserInfo: {
                username:'',
                email: '',
                mobile :''
            },
            editUserRules: {
                email: [
                    { required: true, message: "请输入邮箱", trigger: blur },
                    {validator: checkEmail, trigger: 'blur'}
                ],
                mobile: [
                    { required: true, message: "请输入手机", trigger: blur },
                    {validator: checkMobile, trigger: 'blur'}
                ]
            },

            
            // 角色列表
            roleList: [],
            // 角色id
            id:'',

            //给用户分配角色
            allotDialogVisible:false,
            allotRoleInfo: {}

        }
    },
    created() {
        this.getUserList()
    },
    methods: {
        // 获取用户列表
        async getUserList() {
            let {data : res} = await this.$http.get('users', {
                params : this.queryInfo
            })
            if(res.meta.status !== 200) return this.$message.error("获取用户列表失败")
            this.totalNum = res.data.total
            this.userList = res.data.users.map(item => {
                return {
                    ...item,
                    create_time : this.getFormatDate(item.create_time)
                }
            })
        },
        getFormatDate(n) {
            if( n == "") {
                let n = new Date()
            }
            let date = new Date(n)
            let seperator1 = "-";
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = year + seperator1 + month + seperator1 + strDate;
            return currentdate;
        },
        //添加用户dialog关闭
        addDialogClose() {
            this.addDialogVisible = false
            this.$refs.addUserForm.resetFields()
        },
        // 保存添加新用户
        saveAddUserDialog() {
            this.$refs.addUserForm.validate(async valid => {
                if(!valid) return
                let {data : res} = await this.$http.post('users',this.addUserInfo)
                if(res.meta.status !== 201) return this.$message.error("添加用户失败")
                /* 
                    添加成功：
                    出现弹框，提示添加成功
                    关闭对话框，重置表单
                    更新用户列表
                */
               this.$message.success("添加用户信息成功")
               this.addDialogVisible = false
               this.$refs.addUserForm.resetFields()
               this.getUserList()
            })
        },
        // 改变用户的状态
        async changeUserStatus(info) {
            if(info.id == 500) {
                info.mg_state = !info.mg_state
                this.$message.error("禁止关闭超级管理员")
                return
            } 
            let {data : res} = await this.$http.put(`users/${info.id}/state/${info.mg_state}`)
            if(res.meta.status !== 200) {
                info.mg_state = !info.mg_state
                this.$message.error("修改用户状态失败")
                return
            }
            this.$message.success("修改用户状态成功")
        },
        // 删除用户
        deleteUser(info) {
            if(info.id == 500) return this.$message.error("禁止删除超级管理员")
            this.$confirm("确定删除该用户吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                closeOnClickModal: false
            }).then(async () => {
                let {data : res} = await this.$http.delete('users/' + info.id)
                if(res.meta.status !== 200) return this.$message.error("删除用户失败")
                this.$message.success("删除用户成功")
                this.getUserList()
            }).catch(err => err)
            
        },
        // 编辑用户按钮
        async editUser(info) {
            if(!info.mg_state) return this.$message.error("该用户已被关闭,禁止修改")
            this.editDialogVisible = true
            let {data: res} = await this.$http.get('users/' + info.id)
            if(res.meta.status !== 200) return
            this.editUserInfo = res.data
        },
        //编辑用户信息dialog关闭
        editDialogClose() {
            this.editDialogVisible = false
            this.$refs.editUserForm.resetFields()
        },
        //保存编辑用户信息
        saveEditUserDialog() {
            this.$refs.editUserForm.validate(async valid => {
                // 校验通过
                let {data : res} = await this.$http.put('users/' + this.editUserInfo.id, {
                    email : this.editUserInfo.email,
                    mobile : this.editUserInfo.mobile
                })
                if(res.meta.status !== 200) return this.$message.error("修改用户信息失败")
                // 修改用户信息成功
                this.editDialogVisible = false
                this.$refs.editUserForm.resetFields()
                this.$message.success("用户信息修改成功")
                this.getUserList()
            })
        },
        //获取角色列表
        // async getRoleList() {
            
        // }, 
        //  分配角色按钮
        async allotRole(info) {
            if(info.id === 500) return this.$message.error("禁止修改超级管理员的角色")
            this.allotRoleInfo = info
            let {data :res} = await this.$http.get('roles')
            if(res.meta.status !== 200) return this.$message.error("角色列表信息获取失败")
            this.roleList = res.data
            this.allotDialogVisible = true
        },
        // 分配角儿dialog关闭
        allotDialogClose() {
            this.allotRoleInfo = ''
            this.id = ''
            this.allotDialogVisible = false
        },
        // 保存当前分配的角色
        async saveAllotRoleDialog(){
            let {data: res} = await this.$http.put(`users/${this.allotRoleInfo.id}/role`,{
                rid: this.id
            })
            if(res.meta.status !== 200) return this.$message.error("角色分配失败")
            /* 
                角色分配成功，提示用户
                关闭对话框
                更新用户列表
            */
            this.$message.success("角色分配成功")
            this.allotDialogVisible = false
            this.getUserList()
            this.allotRoleInfo = ''
            this.id = ''
        },
        // 分页显示条数
        handleSizeChange(size) {
            this.queryInfo.pagesize = size
            this.getUserList()
        },
        //分页当前页
        handleCurrentChange(currentNum) {
            this.queryInfo.pagenum = currentNum
            this.getUserList()
        }
    }
}
</script>
<style lang="less" scoped>
    
</style>