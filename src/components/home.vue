<template>
    <div>
        <el-button type="primary" @click="exitLogin">退出登录</el-button>
    </div>
</template>
<script>
export default {
    name : 'home',
    data () {
        return {

        }
    },
    methods: {
        exitLogin() {
            window.sessionStorage.removeItem('token')
            this.$message.success("退出成功")
            // this.$confirm('确定退出吗?', '提示', {
            //     confirmButtonText: '确定',
            //     cancelButtonText: '取消',
            //     type: 'warning'
            // }).then(()=> {
            //     this.$message.success("退出成功")
            // }).catch(() => {ss})
        }
    }
}
</script>
<style lang="less" scoped>
    
</style>