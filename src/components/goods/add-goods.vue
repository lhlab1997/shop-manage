<template>
    <div>
        <el-card>
            <el-row class="mbt-20">
                <el-alert title="添加商品" type="info" center :closable="false" show-icon></el-alert>
            </el-row>
            <!-- 步骤 -->
            <el-row class="mbt-20">
                <el-steps :active="activeIndex - 0" finish-status="success" align-center="">
                    <el-step title="基本信息"></el-step>
                    <el-step title="商品参数"></el-step>
                    <el-step title="商品属性"></el-step>
                    <el-step title="商品图片"></el-step>
                    <el-step title="商品内容"></el-step>
                    <el-step title="完成"></el-step>
                </el-steps>
            </el-row>
            <!-- 商品信息 -->
            <el-row>
                <el-form ref="addGoodsRef" :rules="addGoodsRules" :model="addGoodsForm">
                    <el-tabs :tab-position="'left'" v-model="activeIndex" @tab-click="tabClick" :before-leave="tabLeaveBefore">
                        <el-tab-pane label="基本信息" name="0">
                            <el-form-item label="商品名称" prop="goods_name">
                                <el-input v-model="addGoodsForm.goods_name"></el-input>
                            </el-form-item>
                            <el-form-item label="商品价格" prop="goods_price">
                                <el-input v-model="addGoodsForm.goods_price"></el-input>
                            </el-form-item>
                            <el-form-item label="商品重量" prop="goods_weight">
                                <el-input v-model="addGoodsForm.goods_weight"></el-input>
                            </el-form-item>
                            <el-form-item label="商品数量" prop="goods_number">
                                <el-input v-model="addGoodsForm.goods_number"></el-input>
                            </el-form-item>
                            <el-form-item label="商品分类" >
                                <el-cascader
                                    v-model="addGoodsForm.goods_cat"
                                    :options="goodsCateList"
                                    :props="selectProps"
                                    @change="selectCateChange">
                                </el-cascader>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="商品参数" name="1">
                            <el-form-item v-for="item in manyTableData" :key="item.attr_id">
                                <div>{{item.attr_name}}</div>
                                <el-checkbox-group v-model="item.attr_vals">
                                    <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border=""></el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="商品属性" name="2">
                            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                                <el-input v-model="item.attr_vals"></el-input>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="商品图片" name="3">
                            <el-row>
                                <el-upload
                                    :action="uploadUrl"
                                    :headers="uploadHead"
                                    :on-preview="handlePreview"
                                    :on-remove="handleRemove"
                                    :on-success="handelSuccess"
                                    list-type="picture">
                                    <el-button size="small" type="primary">点击上传</el-button>
                                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                                </el-upload>
                            </el-row>

                        </el-tab-pane>
                        <el-tab-pane label="商品内容" name="4">
                            <quill-editor v-model="addGoodsForm.goods_introduce"></quill-editor>
                            <el-button type="primary" class="btnAdd" @click="addGoods">添加商品</el-button>
                        </el-tab-pane>
                    </el-tabs>
                </el-form>
            </el-row>
        </el-card>


        <!-- 图片预览dialog -->
        <el-dialog
            title="图片预览"
            :visible.sync="previewVisible"
            width="40%"
            :close-on-click-modal="false"
            @close="previewDialogClose">
            <div class="preview-img">
                <img :src="previewPath">
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'addGoods',
    data() {
        return {
            //图片上传地址
            uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
            uploadHead : {
                Authorization: window.sessionStorage.getItem('token')
            },
            // 图片预览
            previewVisible: false,


            activeIndex: '0',
            addGoodsForm: {
                goods_name: '',
                goods_price: '',
                goods_weight: '',
                goods_number: '',
                goods_cat: [],
                pics: [],
                goods_introduce: '',
                attrs: []
            },
            addGoodsRules: {
                goods_name: [
                    { required: true, message:'请输入商品名称', trigger: 'blur' }
                ],
                goods_price: [
                    { required: true, message:'请输入商品价格', trigger: 'blur' }
                ],
                goods_weight: [
                    { required: true, message:'请输入商品重量', trigger: 'blur' }
                ],
                goods_number: [
                    { required: true, message:'请输入商品数量', trigger: 'blur' }
                ]
            },
            // 商品分类
            goodsCateList: [],
            selectProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                expandTrigger: 'hover'
            },

            //动态参数列表
            manyTableData: [],
            // 静态参数列表
            onlyTableData: [],

            previewPath: '',
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        //请求商品分类参数
        async getCateList() {
            let {data: res} = await this.$http.get('categories',{
                params : {
                    type : 3
                }
            })
            if(res.meta.status !== 200) return this.$message.error("分类列表获取失败")
            this.goodsCateList = res.data
        },
        // 点击tabs标签
        async tabClick() {
            // 当activeIndex == 1 时，请求商品的动态参数
            if(this.activeIndex === '1') {
                let {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
                    params: {
                        sel : 'many'
                    }
                })
                if(res.meta.status !== 200) return this.$message.error("商品动态参数获取失败")
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals.length ? item.attr_vals.split(' ') : []
                })
                this.manyTableData = res.data
            }else if(this.activeIndex === '2') {
                let {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
                    params: {
                        sel : 'only'
                    }
                })
                if(res.meta.status !== 200) return this.$message.error("商品动态参数获取失败")
                // res.data.forEach(item => {
                //     item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                // })
                this.onlyTableData = res.data
            }
        },
        tabLeaveBefore(activeName,oldActiveName) {
            if(oldActiveName == '0' && this.addGoodsForm.goods_cat.length !== 3) {
                this.$message.error("请正确选择商品分类")
                this.addGoodsForm.goods_cat = []
                return false
            }else {
                return true
            }
        },
        // 选中商品分类
        selectCateChange() {
            if(this.addGoodsForm.goods_cat.length !== 3) {
                this.addGoodsForm.goods_cat = []
            }
        },
        // 图片预览
        handlePreview(file) {
            this.previewVisible = true
            this.previewPath = file.response.data.url
        },
        previewDialogClose() {
            this.previewPath = ''
        },
        // 图片删除
        handleRemove(file) {
            console.log(file);
            // 获取删除图片的临时路径
            let tmp_path = file.response.data.tmp_path
            // 获取图片的pics 中的下标
            let i = this.addGoodsForm.pics.findIndex(item => item.pic == tmp_path)
            // 根据下标将图片从pics 中删除
            this.addGoodsForm.pics.splice(i, 1)
            console.log(this.addGoodsForm.pics);
        },
        //图片上传成功
        handelSuccess(response,file) {
           if(response.meta.status !== 200) return this.$message.error("图片上传失败")
           let picInfo = {
               pic : response.data.tmp_path
           }
           this.addGoodsForm.pics.push(picInfo)
        },
        // 添加商品按钮
        addGoods() {
            this.$refs.addGoodsRef.validate(async valid => {
                if(!valid) return this.$message.error("请填写必要的商品信息")

                //处理动态参数
                this.manyTableData.forEach(item => {
                    let manyInfo = {
                        attr_id: item.attr_id,
                        attr_value: item.attr_vals.join(" ")
                    }
                    this.addGoodsForm.attrs.push(manyInfo)
                })

                //处理静态属性
                this.onlyTableData.forEach(item => {
                    let onlyInfo = {
                        attr_id: item.attr_id,
                        attr_value: item.value
                    }
                    this.addGoodsForm.attrs.push(onlyInfo)
                })

                // 复制一份表单数据
                let copyData = this.cloneObject(this.addGoodsForm)
                // 处理分类数组
                copyData.goods_cat = copyData.goods_cat.join(",")
                // 发起请求
                let {data: res} = await this.$http.post('goods',copyData)
                if(res.meta.status !== 201) return this.$message.error("商品添加失败")
                this.$message.success("商品添加成功")
                this.$router.push({name: 'Goods'})
            })
        },
        cloneObject(obj,target) {
            var target = target || {}
            let type = '[object Array]'
            let toStr = Object.prototype.toString
            for(let attr in obj) {
                if(obj.hasOwnProperty(attr)){
                    if( typeof (obj[attr]) == 'object' && obj[attr] !== null ) {
                        if(toStr.call(obj[attr]) == type) {
                            target[attr] = []
                        }else {
                            target[attr] = {}
                        }
                        this.cloneObject(obj[attr],target[attr])
                    }else {
                        target[attr] = obj[attr]
                    }
                }
            }
            return target
        }
    },
    computed: {
        cateId() {
            if(this.addGoodsForm.goods_cat.length === 3) {
                return this.addGoodsForm.goods_cat[2]
            }
            return null
        }
    }
}
</script>
<style lang="less" scoped>
    .el-checkbox{
        margin: 0 5px 5px 0 !important;
    }
    .preview-img {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 250px;
    }
    .preview-img img {
        max-width: 100%;
    }
    
    .btnAdd {
        margin-top: 20px;
    }
</style>