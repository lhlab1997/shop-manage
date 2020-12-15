<template>
    <div>
        <el-breadcrumb separator="/" class="mbt-20">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row class="mbt-20">
                <el-table :data="orderList" style="width: 100%" border>
                    <el-table-column label="序号" width="50" align="center">
                        <template slot-scope="scope">
                            <span v-text="getIndex(scope.$index)"></span>
                        </template>
                    </el-table-column>
                    <el-table-column label="订单号" prop="order_number"></el-table-column>
                    <el-table-column label="订单价格" prop="order_price" width="120" align="center"></el-table-column>
                    <el-table-column label="是否付款" width="120" align="center">
                        <template slot-scope="scope">
                            <el-tag type="success" v-if="scope.row.order_pay == 1">已付款</el-tag>
                            <el-tag type="danger" v-else>未付款</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="是否发货" prop="is_send" width="100" align="center"></el-table-column>
                    <el-table-column label="下单时间" width="200">
                        <template slot-scope="scope">
                            <span>
                                {{scope.row.create_time | dateFormat}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180px">
                        <template slot-scope="scope">
                            <el-tooltip effect="dark" content="编辑" placement="top">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editOrderBtn"></el-button>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="查看物流" placement="top">
                                <el-button type="danger" icon="el-icon-s-order" size="mini" @click="showProgress"></el-button>
                            </el-tooltip>             
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
            <el-row>
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[5, 10, 20]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </el-row>
        </el-card>

        <!-- 修改订单dialog -->
        <el-dialog
            title="修改订单"
            :visible.sync="orderDialogVisible"
            width="40%"
            :close-on-click-modal="false"
            @close="orderDialogClose">
            <el-form ref="editOrderRef" 
                                :model="addressInfo"
                                :hide-required-asterisk="true"
                                label-width="80px"
                                :rules="editOrderRules">
                <el-form-item label="省/市/区" prop="address1">
                    <el-cascader
                        v-model="addressInfo.address1"
                        :options="citydata"
                        :props="props">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="addressInfo.address2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="orderDialogClose">取 消</el-button>
                <el-button type="primary" @click="saveEditOrderDialog">确 定</el-button>
            </span>
        </el-dialog>


        <!-- 查看物流dialog -->
        <el-dialog
            title="查看物流"
            :visible.sync="progressDialogVisible"
            width="40%"
            :close-on-click-modal="false"
            @close="progressDialogClose">
            
            <span slot="footer">
                <el-button type="primary" @click="progressDialogClose">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import citydata from './citydata.js'
export default {
    
    name: 'orders',
    data() {
        let checkAddress1 = (rule, value, cb) => {
            if(value) {
                return cb()
            }
            cb(new Error('请选择地区'))
        }
        return {
            orderList: [],
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 10
            },
            total: 0,


            addressInfo: {
                address1: '',
                address2: ''
            },
            editOrderRules: {
                address1: [
                    {required: true, message:'请选择地区', trigger: 'blur'},
                    {validator: checkAddress1, trigger: 'blur'}
                ],
                address2: [
                    {required: true, message:'请输入详细地址', trigger: 'blur'}
                ]
            },
            orderDialogVisible: false,

            citydata: citydata,
            props: {
                expandTrigger: 'hover'
            },

            // 物流dialog
            progressDialogVisible: false

        }
    },
    created() {
        this.getOrderList()
    },
    methods: {
        getIndex($index) {
            return (this.queryInfo.pagenum -1) * this.queryInfo.pagesize + $index + 1
        },
        async getOrderList() {
            let {data: res} = await this.$http.get('orders',{
                params: this.queryInfo
            })
            if(res.meta.status !== 200) return this.$message.error("订单列表获取失败")
            this.orderList = res.data.goods
            this.total = res.data.total
        },
        editOrderBtn() {
            this.orderDialogVisible = true
        },
        orderDialogClose() {
            this.orderDialogVisible = false
            this.$refs.editOrderRef.resetFields()
        },

        saveEditOrderDialog() {
            this.$refs.editOrderRef.validate(valid => {
                if(!valid) return
                this.orderDialogVisible = false
            })
        },
        // 显示物流dialog
        async showProgress() {
            this.progressDialogVisible = true
        },
        // 物流dialog关闭
        progressDialogClose(){
            this.progressDialogVisible = false
        },
        // 分页处理方法
        handleSizeChange(size) {
            this.queryInfo.pagesize = size
            this.getOrderList()
        },
        handleCurrentChange(num) {
            this.queryInfo.pagenum = num
            this.getOrderList()
        }
    }
}
</script>
<style lang="less" scoped>
    .el-cascader {
        width: 100%;
    }
</style>