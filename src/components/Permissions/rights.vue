<template>
    <div>
        <el-breadcrumb separator="/" class="mbt-20">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>

            <!-- 筛选权限等级 -->
            <el-row class="mbt-20">
                <el-col>
                    <el-button type="primary" size="small">筛选权限等级</el-button>
                    <el-select v-model="level" 
                        placeholder="请选择" 
                        clearable size="small" style="width:130px;"
                        >
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
            </el-row>

            <!-- 权限列表区域 -->
            <el-row>
                <el-table :data="showRights" style="width: 100%" :border="true"> 
                    <el-table-column label="#" type="index" width="50"></el-table-column>
                    <el-table-column label="权限名称" prop="authName"></el-table-column>
                    <el-table-column label="路径" prop="path"></el-table-column>
                    <el-table-column label="权限等级">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.level == 0">一级</el-tag>
                            <el-tag type="success" v-else-if="scope.row.level == 1">二级</el-tag>
                            <el-tag type="info" v-else-if="scope.row.level == 2">三级</el-tag>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
        </el-card>
    </div>
</template>
<script>
export default {
    name : 'rights',
    data () {
        return {
            // 权限列表
            rightsList: [],

            // 权限筛选
            options:[
                {value: "", label: '全部权限'},
                {value: "0", label: '一级权限'},
                {value: "1", label: '二级权限'},
                {value: "2", label: '三级权限'}
            ],
            level: ''
        }
    },
    created() {
        this.getRightsList()
    },
    methods: {
        //获取权限列表
        async getRightsList() {
            let {data :res} = await this.$http.get('rights/list')
            if(res.meta.status !== 200) return this.$message.error("获取权限列表失败")
            this.rightsList = res.data
        },
        //选中的权限
        selectLevel() {
            console.log(this.showRights);
        }
    },
    computed: {
        showRights() {
            if(this.level == '') {
                return this.rightsList
            }
            return this.rightsList.filter(item => item.level == parseInt(this.level))
        }
    }

}
</script>
<style lang="less" scoped>
    
</style>