<<template>
    <div>
        <el-breadcrumb separator="/" class="mbt-20">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row class="mbt-20">
                <el-row class="mbt-20">
                    <el-alert
                        title="注意只能选择三级分类"
                        type="warning"
                        show-icon
                        :closable="false">
                    </el-alert>
                </el-row>
                <el-row>
                    选择分类：
                    <el-cascader
                        v-model="selectCateId"
                        :options="cateList"
                        :props="selectProps"
                        :show-all-levels="false"
                        @change="selectCateChange">
                    </el-cascader>
                </el-row>
            </el-row>
            <el-row>
                <el-tabs type="border-card" v-model="activeTabs" @tab-click="changeTabItem">
                    <el-tab-pane label="动态参数" name="many">
                        <el-row class="mbt-20">
                            <el-button type="primary" @click="addParamsHandle" size="small" :disabled="btnIsDisable">添加参数</el-button>
                        </el-row>
                        <el-row>
                            <el-table :data="manyTableData" style="width:100%" border>
                                <el-table-column type="expand">
                                    <template slot-scope="scope">
                                        <el-row >
                                            <el-tag
                                                class="tag-item"
                                                v-for="(item,index) in scope.row.attr_vals"
                                                :key="item.attr_id"
                                                :closable="true"
                                                :disable-transitions="false"
                                                @close="deleteParamsTag(index,scope.row)">
                                                {{item}}
                                            </el-tag>

                                            <!-- 添加 -->
                                            <el-input
                                                class="input-tag"
                                                v-if="scope.row.inputVisible"
                                                v-model="scope.row.inputValue"
                                                ref="saveTagInput"
                                                size="small"
                                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                                @blur="handleInputConfirm(scope.row)"
                                            >
                                            </el-input>
                                            <el-button class="input-tag" v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                                        </el-row>
                                    </template>
                                </el-table-column>
                                </el-table-column>
                                <el-table-column label="序号" width="50" align="center" type="index"></el-table-column>
                                <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button type="primary" class="el-icon-edit" size="mini" @click="editParamsHandle(scope.row.attr_id)">修改</el-button>
                                        <el-button type="danger" class="el-icon-delete" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane label="静态属性" name="only">
                        <el-row class="mbt-20">
                            <el-button type="primary" @click="addParamsHandle" size="small" :disabled="btnIsDisable">添加属性</el-button>
                        </el-row>
                        <el-row>
                            <el-table :data="onlyTableData" style="width:100%" border>
                                <el-table-column type="expand">
                                    <template slot-scope="scope">
                                        <el-row >
                                            <el-tag
                                                class="tag-item"
                                                v-for="(item,index) in scope.row.attr_vals"
                                                :key="item.attr_id"
                                                :closable="true"
                                                :disable-transitions="false"
                                                @close="deleteParamsTag(index,scope.row)">
                                                {{item}}
                                            </el-tag>
                                            
                                            <!-- 添加 -->
                                            <el-input
                                                class="input-tag"
                                                v-if="scope.row.inputVisible"
                                                v-model="scope.row.inputValue"
                                                ref="saveTagInput"
                                                size="small"
                                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                                @blur="handleInputConfirm(scope.row)"
                                            >
                                            </el-input>
                                            <el-button class="input-tag" v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                                        </el-row>
                                    </template>
                                </el-table-column>
                                <el-table-column label="序号" width="50" align="center" type="index"></el-table-column>
                                <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button type="primary" class="el-icon-edit" size="mini" @click="editParamsHandle(scope.row.attr_id)">修改</el-button>
                                        <el-button type="danger" class="el-icon-delete" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-row>
                    </el-tab-pane>
                </el-tabs>
            </el-row>
        </el-card>

        <!-- 添加动态参数或者静态属性dialog -->
        <el-dialog 
            :title="'添加'+ textTitle"
            :visible.sync="addParamsDialogVisible"
            width="40%"
            :close-on-click-modal="false"
            @close="addParamsDialogClose">
            <el-form ref="addParamsForm" 
                    :model="addParams"
                    :hide-required-asterisk="true"
                    label-width="80px"
                    :rules="addParamsRules">
                <el-form-item label="名称" prop="attr_name">
                    <el-input v-model="addParams.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="addParamsDialogClose">取 消</el-button>
                <el-button type="primary" @click="saveAddParams">确 定</el-button>
            </span>
        </el-dialog>


        <!-- 编辑参数 -->
        <el-dialog 
            :title="'修改'+ textTitle"
            :visible.sync="editParamsDialogVisible"
            width="40%"
            :close-on-click-modal="false"
            @close="editParamsDialogClose">
            <el-form ref="editParamsForm" 
                    :model="editParams"
                    :hide-required-asterisk="true"
                    label-width="80px"
                    :rules="addParamsRules">
                <el-form-item label="名称" prop="attr_name">
                    <el-input v-model="editParams.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="editParamsDialogClose">取 消</el-button>
                <el-button type="primary" @click="saveEditParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>

</template>
<script>
export default {
    name : 'params',
    data() {
        return {
            //分类参数
            cateList: [],
            // 选中的分类id
            selectCateId: [],
            selectProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                expandTrigger: 'hover'
            },

            // 选中的tab页
            activeTabs: 'many',

            //动态参数列表数据
            manyTableData: [],
            // 静态属性列表数据
            onlyTableData: [],

            // 添加参数
            addParamsDialogVisible: false,
            addParams: {
                attr_name: ''
            },
            addParamsRules:{
                attr_name: [
                    {required: true, message:'请输入名称', trigger: 'blur'}
                ]
            },

            // 编辑参数
            editParamsDialogVisible: false,
            editParams: {
                attr_name: '',
                attr_id:0
            },


            inputVisible: false,
            inputValue: ''


        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        async getCateList() {
            let {data: res} = await this.$http.get('categories',{
                params : {
                    type : 3
                }
            })
            if(res.meta.status !== 200) return this.$message.error("分类列表获取失败")
            this.cateList = res.data
        },
        // 选择分类
        selectCateChange() {
            // 若选中的不是三级分类，则清空选中的分类
            if(this.selectCateId.length !== 3) {
                this.selectCateId = []
                this.manyTableData = []
                this.onlyTableData = []
                return
            }
            this.getTableData()
            
        },
        // 选项卡切换
        changeTabItem() {
            if(!this.btnIsDisable) {
                this.getTableData()
            }
        },
        async getTableData() {
            let {data : res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
                params: {
                    sel:this.activeTabs
                }
            })
            if(res.meta.status !== 200) return this.$message.error("参数获取失败")
            res.data.forEach(item => {
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                item.inputVisible = false
                item.inputValue = ''
            })
            if(this.activeTabs == 'many') {
                this.manyTableData = res.data
            }else {
                this.onlyTableData = res.data
            }
        },
        //添加属性按钮
        addParamsHandle() {
            this.addParamsDialogVisible = true
        },
        //添加属性dialog关闭
        addParamsDialogClose() {
            this.addParamsDialogVisible = false
            this.$refs.addParamsForm.resetFields()
        },
        // 保存新增的属性
        saveAddParams() {
            this.$refs.addParamsForm.validate(async valid => {
                if(!valid) return 
                let {data: res} = await this.$http.post(`categories/${this.cateId}/attributes`,{
                    attr_name: this.addParams.attr_name,
                    attr_sel: this.activeTabs
                })
                if(res.meta.status !== 201) return this.$message.error("参数添加失败")
                this.$message.success("参数添加成功")
                this.getTableData()
                this.addParamsDialogVisible = false
            })
        },
        // 删除分类
        deleteParams(id) {
            this.$confirm("确定删除该参数吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                closeOnClickModal: false,
            }).then(async ()=> {
                let {data: res} = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
                if(res.meta.status !== 200) return this.$message.error("参数删除失败")
                this.$message.success("参数删除成功")
                this.getTableData()
            }).catch(() => {
                this.$message.info("取消删除")
            })
        },
        //编辑dialog按钮
        async editParamsHandle(id) {
            let {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${id}`)
            if(res.meta.status !== 200) return this.$message.error("参数信息获取失败")
            this.editParams.attr_name = res.data.attr_name
            this.editParams.attr_id = res.data.attr_id
            this.editParamsDialogVisible = true
        },
        // 编辑参数dialog关闭
        editParamsDialogClose() {
            this.editParamsDialogVisible = false
            this.editParams.attr_name = ''
            this.editParams.attr_id = ''
            this.$refs.editParamsForm.resetFields()
        },
        // 编辑参数dialog保存
        saveEditParams() {
            this.$refs.editParamsForm.validate(async valid => {
                if(!valid) return
                let {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editParams.attr_id}`, {
                    attr_name : this.editParams.attr_name,
                    attr_sel : this.activeTabs
                })
                if(res.meta.status !== 200) return this.$message.error("参数修改失败")
                this.$message.success("参数修改成功")
                this.getTableData()
                this.editParams.attr_name = ''
                this.editParams.attr_id = ''
                this.editParamsDialogVisible = false

            })
        },
        //删除参数tag
        async deleteParamsTag(index,row) {
            row.attr_vals.splice(index,1).length
            let {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
                attr_name: row.attr_name,
                attr_sel: this.activeTabs,
                attr_vals: row.attr_vals.join(",")
            })
            if(res.meta.status !== 200) return this.$message.error("删除失败")
            this.$message.error("删除成功")
            
        },
        // 添加tag
        showInput(row) {
            row.inputVisible = true
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus()
            })
        },
        async handleInputConfirm(row) {
            if(row.inputValue.trim()) {
                row.attr_vals.push(row.inputValue)
                let {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
                    attr_name: row.attr_name,
                    attr_sel: this.activeTabs,
                    attr_vals: row.attr_vals.join(' ')
                })
                if(res.meta.status !== 200) return this.$message.error("添加属性失败")
                this.$message.success("属性添加成功")
            }
            row.inputVisible = false
            row.inputValue = ''
        }

    },
    computed: {
        cateId() {
            if(this.selectCateId.length === 3) {
                return this.selectCateId[2] 
            }
            return null
        },
        btnIsDisable() {
            if(this.selectCateId.length !== 3) {
                return true
            }
            return false
        },
        textTitle() {
            if(this.activeTabs == 'many') {
                return '动态参数'
            }else {
                return '静态属性'
            }
        }
    }
}
</script>
<style lang="less" scoped>
    .text {
        background-color: #E6A23C;
        height: 30px;
        color: #fff;
        font-size: 12px;
        line-height: 30px;
        padding: 0 20px;
    }
    .tag-item {
        margin-right: 30px;
        margin-bottom: 20px;
    }
    .input-tag {
        width: 120px;
    }
</style>
