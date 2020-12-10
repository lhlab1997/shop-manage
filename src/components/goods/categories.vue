<<template>
    <div>
        <el-breadcrumb separator="/" class="mbt-20">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row class="mbt-20">
                <el-col>
                    <el-button type="primary" @click="addCate">添加分类</el-button>
                </el-col>
            </el-row>
            <el-row class="mbt-20">
                <tree-table
                    :show-index="true"
                    :border="true"
                    :data="cateList"
                    :columns="columns"
                    :expand-type="false"
                    :selection-type="false">
                    
                    <template slot="isOk" slot-scope="scope">
                        <i class="el-icon-success" v-if="scope.row.cat_deleted == false"></i>
                        <i class="el-icon-error" v-else></i>
                    </template>
                    <template slot="options" slot-scope="scope">
                        <el-button type="primary" class="el-icon-edit" size="mini" @click="aditCate(scope.row)">编辑</el-button>
                        <el-button type="danger" class="el-icon-delete" size="mini" @click="deleteCata(scope.row)">删除</el-button>
                    </template>
                </tree-table>
            </el-row>
            <el-row>
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[5, 10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </el-row>
        </el-card>


        <!-- 添加分类dialog -->
        <el-dialog
            title="添加分类"
            :visible.sync="addCateDialogVisible"
            width="40%"
            :close-on-click-modal="false"
            @close="addCateDialogClose">
            <el-form
                ref="addCateRef"
                :model="addCateForm"
                label-width="80px"
                :rules="addCateRules">
              <el-form-item label="分类名称" prop="cat_name">
                  <el-input v-model="addCateForm.cat_name"></el-input>
              </el-form-item>
              <el-form-item label="父级名称" class="block">
                    <el-cascader
                        v-model="selectCateKey"
                        :options="addCateList"
                        :props="selectProps"
                        @change="selectCateChange"
                        clearable>
                    </el-cascader>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogClose">取 消</el-button>
                <el-button type="primary" @click="saveAddCateDialog">确 定</el-button>
            </span>
        </el-dialog>


        <!-- 编辑分类dialog -->
        <el-dialog
            title="分类修改"
            :visible.sync="editCateDialogVisible"
            width="40%"
            :close-on-click-modal="false"
            @close="editCateDialogClose">
            <el-form
                ref="editCateRef"
                :model="editCateForm"
                label-width="80px"
                :rules="editCateRules">
              <el-form-item label="分类名称" prop="cat_name">
                  <el-input v-model="editCateForm.cat_name"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCateDialogClose">取 消</el-button>
                <el-button type="primary" @click="saveEditCateDialog">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name : 'categories',
    data() {
        return {
            queryInfo: {
                type:'',
                pagenum: 1,
                pagesize: 5
            },
            //分类列表
            cateList: [],
            total: 0,
            columns:[
                {
                    label:'分类名称',
                    prop: 'cat_name'
                },
                {
                    label:"是否有效",
                    type: 'template',
                    template: 'isOk'
                },
                {
                    label: '操作',
                    type: 'template',
                    template: 'options'
                }
            ],


            // 编辑分类
            editCateDialogVisible: false,
            editCateForm: {
                cat_name: '',
                cat_id: 0
            },
            editCateRules: {
                cat_name: [
                    { required: true, message:'请输入分类名称', trigger: 'blur'} 
                ]
            },


            // 添加分类
            addCateList: [], // 一二级分类
            addCateDialogVisible: false,
            addCateForm: {
                cat_name: '',
                cat_pid: 0,
                cat_level: 0
            },
            addCateRules: {
                cat_name: [
                    { required: true, message:'请输入分类名称', trigger: 'blur'} 
                ]
            },
            // 选中的分类
            selectCateKey: [],
            selectProps : {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                checkStrictly: true,
                expandTrigger: 'hover'
            }

        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        async getCateList() {
            let {data : res} = await this.$http.get('categories',{
                params:this.queryInfo
            })
            if(res.meta.status !== 200) return this.$message.error("分类列表获取失败")
            this.cateList = res.data.result
            this.total = res.data.total
        },
        //编辑商品分类
        async aditCate(params){
            let {data: res} = await this.$http.get('categories/' + params.cat_id)
            if(res.meta.status !== 200) return this.$message.error("分类信息获取失败")
            this.editCateForm = {
                cat_name: res.data.cat_name,
                cat_id: res.data.cat_id
            }
            this.editCateDialogVisible = true
        },
        // 删除商品分类
        deleteCata(params) {
            this.$confirm("确认删除该分类吗", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                closeOnClickModal: false
            }).then(async () => {
                let {data :res} = await this.$http.delete('categories/' + params.cat_id)
                if(res.meta.status !== 200) return this.$message.error("分类删除失败")
                this.$message.success("分类删除成功")
                this.getCateList()
            }).catch(err => err)
        },
        // 编辑分类dialog关闭
        editCateDialogClose() {
            this.editCateDialogVisible = false
            this.$refs.editCateRef.resetFields()
            this.$refs.editCateRef.clearValidate()
            this.editCateForm = {
                cat_name: '',
                cat_id: ''
            }
        },
        //保存编辑分类
        saveEditCateDialog() {
            this.$refs.editCateRef.validate(async valid => {
                if(!valid) return
                let {data : res} = await this.$http.put('categories/' + this.editCateForm.cat_id, {
                    cat_name: this.editCateForm.cat_name
                })
                if(res.meta.status !== 200) return this.$message.error("分类信息修改失败")
                this.$message.success("分类信息修改成功")
                this.editCateForm = {
                    cat_name: '',
                    cat_id: ''
                }
                this.editCateDialogVisible = false
                this.getCateList()
            })
        },
        // 添加分类按钮
        async addCate() {
            let {data: res} = await this.$http.get('categories',{
                params : {
                    type : 2
                }
            })
            if(res.meta.status !== 200) return this.$message.error("分类列表获取失败")
            this.addCateList = res.data
            this.addCateDialogVisible = true
        },
        //添加分类dialog关闭
        addCateDialogClose() {
            this.addCateDialogVisible = false
            this.selectCateKey = []
            this.addCateForm.cat_pid = 0;
            this.addCateForm.cat_level = 0
            this.$refs.addCateRef.resetFields()
        },
        //添加分类diallog保存
        saveAddCateDialog() {
            
            this.$refs.addCateRef.validate(async valid => {
                if(!valid) return
                console.log(this.addCateForm);
                let {data: res} = await this.$http.post('categories',this.addCateForm)
                if(res.meta.status !== 201) return this.$message.error("分类创建失败")
                this.$message.success("分类创建成功")
                this.addCateDialogVisible = false
                this.selectCateKey = []
                this.$refs.addCateRef.resetFields()
                //更新分类列表
                this.getCateList()
            })
            
        },
        //选中分类
        selectCateChange() {
            /* 
                如果selectCateKey为空  则 分类父id为 cat_pid:0 , 添加的是一级分类 则cat_level: selectCateKey.length,
                selectCateKey 不为空 则 分类父id为 cat_pid: selectCateKey[selectCatekey.length -1], 
                             添加的是二三级分类 则 cat_level: selectCateKey.length

            */
            //    判断选中的分类的数组长度
            if(this.selectCateKey.length > 0) {
                this.addCateForm.cat_pid = this.selectCateKey[this.selectCateKey.length - 1]
                this.addCateForm.cat_level = this.selectCateKey.length
            }else {
                this.addCateForm.cat_pid = 0;
                this.addCateForm.cat_level = 0
            }
        },
        handleSizeChange(size) {
            this.queryInfo.pagesize = size
            this.getCateList()
        },
        handleCurrentChange(num) {
            this.queryInfo.pagenum = num
            this.getCateList()
        }
    }
}
</script>
<style lang="less" scoped>
    .el-icon-success {
        color: green;
    }   
    .el-icon-error {
        color: red;
    }
    .el-button span {
        padding-left: 5px;
    } 
    
</style>
