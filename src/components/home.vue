<template>
  <div class="home-container">
    <el-container class="app-container">
      <el-header>
        <div class="top-bar">
          <div class="top-left">我的VUE后台管理系统</div>
          <div class="top-right">
            <el-button type="primary" size="small" @click="exitLogin"
              >退出</el-button
            >
          </div>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px" class="left-aside">
          <el-row class="left-menu">
            <el-col :span="12">

              <!-- 菜单容器 -->
              <el-menu class="menu-container"
                        background-color="#456789"
                        text-color="#efefef"
                        active-text-color="#85a2c0"
                        :unique-opened="true"
                        :router="true"
                        :default-active = activePath
                        >
                <!-- 一级菜单 -->
                <el-submenu :index="item.path" v-for="item in menuList" :key="item.id">
                    <template slot="title">
                        <i :class="iconsObj[item.id]"></i>
                        <span>{{item.authName}}</span>
                    </template>

                    <!-- 二级菜单 -->
                    <el-menu-item :index="'/'+subItem.path + ''" 
                                  v-for="subItem in item.children" 
                                  :key="subItem.id"
                                  @click="saveActivePath('/' + subItem.path)">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>{{subItem.authName}}</span>
                        </template>
                    </el-menu-item>
                </el-submenu>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <el-main>
            <router-view>1111</router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  name: "home",
  data() {
    return {
        // 菜单数组
        menuList : [],
        iconsObj: {
            '125': 'iconfont icon-user',
            '103': 'iconfont icon-tijikongjian',
            '101': 'iconfont icon-shangpin',
            '102': 'iconfont icon-danju',
            '145': 'iconfont icon-baobiao'
        },
        //当前激活菜单
        activePath: ''
    };
  },
  created() {
      this.getMenuList()
      this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    // 退出登录
    exitLogin() {
      this.$confirm("确定退出吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          window.sessionStorage.removeItem("token");
          window.sessionStorage.removeItem("activePath");
          this.$router.push("/login");
          this.$message.success("退出成功");
        })
        .catch(err => err);
    },
    // 获取导航菜单列表
    async getMenuList() {
        let {data:res} = await this.$http.get('menus')
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.menuList = res.data
    },
    // 当前选中的二级菜单
    saveActivePath(path) {
      //将当前激活菜单存储到sessionStorage中
      window.sessionStorage.setItem('activePath', path)
      this.activePath = path
    }
  },
  watch: {
    $route(to,form) {
      this.activePath = to.path
      window.sessionStorage.setItem('activePath',to.path)
    }
  },
  beforeDestroy() {
    window.sessionStorage.setItem("state","{}")
    this.$store.replaceState({})
  }
};
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
  .app-container {
    height: 100%;
  }
}
.el-header {
  padding: 0;

  .top-bar {
    height: 100%;
    display: flex;
    flex-direction: row;
    background-color: #85a2c0;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 20px;

    .top-left {
      font-size: 20px;
      color: #fff;
    }
  }
}
.left-aside {
    background-color: #456789;
}
.left-menu {
    width: 100%;

    .el-col {
        width: 100%;
    }
    .menu-container {
        
        border-right: none;
    }
}
.iconfont {
    margin-right: 10px;
}
</style>