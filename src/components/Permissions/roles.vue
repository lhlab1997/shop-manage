<template>
    <div>
        <el-breadcrumb separator="/" class="mbt-20">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!-- 添加角色 -->
            <el-row class="mbt-20">
                <el-col>
                    <el-button type="primary" size="small" @click="addRoleDialogVisible = true">添加角色</el-button>
                </el-col>
            </el-row>

            <!-- 角色列表展示 -->
            <el-row>
                <el-table :data="roleList" :border="true" :stripe="true">
                    <el-table-column type="expand">
                        <template slot-scope="scope">
                           <el-row v-for="(item1,index1) in scope.row.children" :key="item1.id" :class="index1 ==0? '': 'bTop'" class="center">
                               <!-- 一级权限列表 -->
                               <el-col :span="6">
                                   <el-row>
                                       <el-tag closable @close="removePermissionById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                                       <i class="el-icon-caret-right"></i>
                                   </el-row>  
                               </el-col>
                               <!-- 二三级权限列表 -->
                               <el-col :span="18">
                                   <el-row v-for="(item2,index2) in item1.children" :key="item2.id" :class="index2 ==0? '': 'bTop'" class="center">
                                       <!-- 二级权限 -->
                                       <el-col :span="8">
                                            <el-tag closable type="success" 
                                                    @close="removePermissionById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                            <i class="el-icon-caret-right"></i> 
                                       </el-col>
                                       <!-- 三级权限 -->
                                       <el-col :span="16" class="center">
                                            <el-tag v-for="item3 in item2.children" 
                                                    closable type="info" 
                                                    :key="item3.id"
                                                    @close="removePermissionById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                                       </el-col>
                                   </el-row>
                               </el-col>
                           </el-row>
                        </template>
                    </el-table-column>
                    <el-table-column label="#" type="index"></el-table-column>
                    <el-table-column label="角色名称" prop="roleName"></el-table-column>true
                    <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="primary" class="el-icon-edit" size="mini" @click="editRoleInfo(scope.row)">编辑</el-button>
                            <el-button type="danger" class="el-icon-delete" size="mini" @click="deleteRole(scope.row)">删除</el-button>
                            <el-button type="warning" class="el-icon-s-tools" size="mini" @click="allotRights(scope.row)">分配权限</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
        </el-card>

        <!-- 添加角色dialog -->
        <el-dialog 
            :title="isEditRole ? '编辑角色' : '添加角色'"
            :visible.sync="addRoleDialogVisible"
            width="40%"
            :close-on-click-modal="false"
            @close="addRoleDialogClose">
            <el-form ref="addRoleForm" 
                    :model="addRoleInfo"
                    :hide-required-asterisk="true"
                    label-width="80px"
                    :rules="addRoleRules">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addRoleInfo.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input type="textarea" maxlength="60" v-model="addRoleInfo.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="addRoleDialogClose">取 消</el-button>
                <el-button type="primary" @click="saveAddRole">确 定</el-button>
            </span>
        </el-dialog>



        <!-- 分配权限对话框 -->
        <el-dialog 
            title="分配权限"
            :visible.sync="allotDialogVisible"
            width="40%"
            :close-on-click-modal="false"
            :before-close="allotDialogClose">

            <el-tree :data="rightList" 
                    :props="rightProps" 
                    show-checkbox 
                    node-key="id"
                    :default-checked-keys="hasRightsId"
                    :default-expand-all="true"
                    ref="allotRightsTree"
                    >
                </el-tree>
            <span slot="footer">
                <el-button @click="allotDialogVisible =false">取 消</el-button>
                <el-button type="primary" @click="saveAllotRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name : 'rights',
    data () {
        return {
            //角色列表
            roleList: [],
            //分配权限对话框
            allotDialogVisible: false,
            //权限列表
            rightList: [],
            rightProps:{
                children : 'children',
                label: 'authName'
            },
            // 已拥有的权限的id
            hasRightsId: [],
            // 当前角色的id
            currentRoleId: 0,


            // 添加角色dialog
            addRoleDialogVisible:false,
            addRoleInfo:{
                roleName: '',
                roleDesc: ''
            },
            addRoleRules: {
                roleName: [
                    { required: true, message: "请输入角色名称", trigger: 'blur' },
                    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                ],
                roleDesc: [
                    { required: true, message: "请输入角色描述", trigger: 'blur' }
                ]
            },
            
            //是否在编辑角色信息
            isEditRole: false
        }
    },
    created() {
        this.getRoleList()
    },
    methods: {
        // 获取角色列表
        async getRoleList() {
            let {data :res} = await this.$http.get('roles')
            if(res.meta.status !== 200) return this.$message.error("角色列表信息获取失败")
            this.roleList = res.data
        },
        // 删除角色
        deleteRole(info) {
            this.$confirm("确认删除该角色吗?","提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                closeOnClickModal: false
            }).then(async () => {
                let {data : res} = await this.$http.delete('roles/' + info.id)
                if(res.meta.status !== 200) return this.$message.error('角色删除失败')
                this.$message.success("角色删除成功")
                this.getRoleList()
            }).catch(err => err)
        },
        // 删除指定角色的指定权限
        removePermissionById(info,rightId) {
            this.$confirm("确认删除该权限吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                closeOnClickModal: false
            }).then(async () => {
                let {data : res} = await this.$http.delete(`roles/${info.id}/rights/${rightId}`)
                console.log(res);
                if(res.meta.status !== 200) return this.$message.error("权限删除失败,请联系超级管理员")
                info.children = res.data
                this.$message.success("权限删除成功")
            }).catch(err => err)
        },
        // 分配权限
        async allotRights(info) {
            //存储当前点击角色的id
            this.currentRoleId = info.id

            //1.获取权限
            let {data : res} = await this.$http.get('rights/tree')
            if(res.meta.status !== 200) return this.$message.error("权限列表获取失败,请联系管理员")
            this.rightList = res.data

            //2.弹出分配权限的对话框
            this.allotDialogVisible = true
            
            //3.获取当前角色已拥有的权限
            this.getHasRightsId(info,this.hasRightsId)
        },
        // 分配权限对话框关闭前的回调
        allotDialogClose() {
            this.allotDialogVisible = false
            // 将存储权限id的数组清空
            this.hasRightsId = []
        },
        //获取已拥有的权限id
        getHasRightsId(info,arr) {
            if(!info.children) {
                return arr.push(info.id)
            }
            info.children.forEach(item => this.getHasRightsId(item,arr))
        },
        // 保存给角色分配的权限
        async saveAllotRights() {
            // 获取所有选中与半选中的节点id
            const key = [
                ...this.$refs.allotRightsTree.getCheckedKeys(),
                ...this.$refs.allotRightsTree.getHalfCheckedKeys()
            ]
            //转化成字符串
            const idStr = key.join(',') 
            //发起请求
            let {data: res} = await this.$http.post(`roles/${this.currentRoleId}/rights`,{
                rids : idStr
            })
            if(res.meta.status !== 200) return this.$message    .error("角色权限分配失败")
            this.$message.success("角色权限成功")

            //关闭对话框更新角色权限列表
            this.allotDialogVisible = false
            this.getRoleList()
        },
        // 添加角色dialog关闭回调
        addRoleDialogClose() {
            this.$refs.addRoleForm.resetFields()
            this.addRoleDialogVisible = false,
            this.addRoleInfo = {
                roleName: '',
                roleDesc: ''
            }
            this.isEditRole = false
        },
        // 添加角色
        saveAddRole() {
            this.$refs.addRoleForm.validate(async valid => {
                if(!valid) return

                //编辑角色---发起请求
                if(this.isEditRole) {
                    let {data : res} = await this.$http.put('roles/' + this.currentRoleId, this.addRoleInfo)
                    if(res.meta.status !== 200) return this.$message.error("角色信息修改失败")
                    this.$message.success("角色信息修改成功")
                    this.isEditRole = false
                    this.addRoleInfo = {
                        roleName: '',
                        roleDesc: ''
                    }
                }else {
                    // 添加角色发起请求
                    let {data : res} = await this.$http.post('roles',this.addRoleInfo)
                    if(res.meta.status !== 201) return this.$message.error("角色添加失败")
                    this.$message.success("角色添加成功")
                }
                this.addRoleDialogVisible = false
                this.getRoleList()   
            })
        },
        //修改角色信息
        editRoleInfo(info) {

            this.addRoleDialogVisible = true

            //正在编辑角色信息
            this.isEditRole = true
            this.currentRoleId = info.id
            this.addRoleInfo = {
                roleName: info.roleName,
                roleDesc: info.roleDesc
            }
        }
    }
}
</script>
<style lang="less" scoped>
    .el-button span {
        padding-left: 5px;
    }
    .bTop {
        border-top: 1px solid #EBEEF5;
    }
    .el-tag {
        margin: 10px 5px;
    }
    .center {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
    }
</style>