<<template>
    <div>
        <el-breadcrumb separator="/" class="mbt-20">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row :gutter="20" class="mbt-20">
                <el-col :span="6">
                    <el-input placeholder="请输入商品名称" clearable v-model="queryInfo.query" @input="searchGoods">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addGoodsBtn">添加商品</el-button>
                </el-col>
            </el-row>

            <!-- 商品列表区域 -->
            <el-row class="mbt-20">
                <el-table :data="goodsList" border>
                  <el-table-column label="序号" width="50" align="center">
                      <template slot-scope="scope">
                          <span v-text="getIndex(scope.$index)"></span>
                      </template>
                  </el-table-column>
                  <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                  <el-table-column label="商品价格" prop="goods_price" width="80" align="center"></el-table-column>
                  <el-table-column label="商品数量" prop="goods_number" width="80" align="center"></el-table-column>
                  <el-table-column label="商品重量" prop="goods_weight" width="80" align="center"></el-table-column>
                  <el-table-column label="添加时间" width="160" align="center">
                      <template slot-scope="scope">
                          <span>{{scope.row.add_time | dateFormat}}</span>
                      </template>
                  </el-table-column>
                  <el-table-column label="操作" width="170">
                      <template slot-scope="scope">
                            <el-button type="primary" class="el-icon-edit" size="mini">修改</el-button>
                            <el-button type="danger" class="el-icon-delete" size="mini" @click="deleteGoodsItem(scope.row.goods_id)">删除</el-button>
                      </template>
                  </el-table-column>
                </el-table>
            </el-row>
            <!-- 分页区域 -->
            <el-row>
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[10, 20]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </el-row>
        </el-card>
    </div>
</template>
<script>
export default {
    name : 'goods',
    data() {
        return {
            // 商品列表
            goodsList: [],
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 10
            },
            total: 0
        }
    },
    created() {
        this.getGoodsList()
    },
    methods: {
        // 序号
        getIndex($index) {
            return (this.queryInfo.pagenum -1) * this.queryInfo.pagesize + $index + 1
        },
        async getGoodsList() {
            let {data: res} = await this.$http.get('goods',{
                params : this.queryInfo
            })
            if(res.meta.status !== 200) return this.$message.error("商品列表获取失败")
            this.total = res.data.total
            this.goodsList = res.data.goods
        },
        //搜索商品
        searchGoods() {
            this.queryInfo.pagenum = 1
            this.queryInfo.pagesize = 10
            this.getGoodsList()
        },
        handleSizeChange(size) {
            this.queryInfo.pagesize = size
            this.getGoodsList()
        },
        handleCurrentChange(num) {
            this.queryInfo.pagenum = num
            this.getGoodsList()
        },
        //删除商品
        deleteGoodsItem(goodsId) {
            this.$confirm("确定删除该商品吗?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                closeOnClickModal: false
            }).then(async () => {
                let {data: res} = await this.$http.delete('goods/' + goodsId)
                if(res.meta.status !== 200) return this.$message.error("商品删除失败")
                this.$message.success("商品删除成功")
                this.getGoodsList()
            }).catch((err) => err);
        },
        //添加商品
        addGoodsBtn() {
            this.$router.push({name: 'addGoods'})
            // this.$router.push({path:'/home/add-goods'})
        }
    }
}
</script>
<style lang="less" scoped>
   
</style>
