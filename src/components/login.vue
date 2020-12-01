<template>
    <div class="login_container">
        <div class="login_box">
            <div class="avator_box">
                <img src="../assets/img/logo.png">
            </div>
            <div class="form-box">
                <el-form ref="loginForm" :rules="loginFormRules" :model="loginFormData">
                    <el-form-item prop="username">
                        <el-input prefix-icon="iconfont icon-user" clearable v-model="loginFormData.username"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input prefix-icon="iconfont icon-3702mima" clearable show-password v-model="loginFormData.password"></el-input>
                    </el-form-item>
                    <el-form-item class="btns-box">
                        <el-button type="primary" @click="submitLoginForm" :disabled="!isAvalible">登录</el-button>
                        <el-button type="danger" @click="resetLoginForm()">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
import {mapMutations} from 'vuex'
export default {
    name : 'login',
    data () {
        return {

            //控制重复点击登录按钮
            isAvalible: true,

            // 表单登录数据
            loginFormData : {
                username : 'admin',
                password : '123456'
            },
            // 表单校验
            loginFormRules : {
                username : [
                    { required: true, message: '请输入用户名', trigger: 'blur' },

                ],
                password : [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 4, max: 16, message: '长度在 4 到  16个字符', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        ...mapMutations(["getUserName"]),
        // 提交表单
        submitLoginForm() {
            this.isAvalible = false
            this.$refs.loginForm.validate( async valide =>{
                this.isAvalible = true
                //校验不通过
                if(!valide) return 
                
                //通过校验,发起登录请求
                let {data : res} = await this.$http.post('login',this.loginFormData);
                
                if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
                
                //将用户信息存储到vuex中
                this.getUserName(res.data.username)

                //将服务端返回的token存储起来
                window.sessionStorage.setItem('token',res.data.token)
                //清除上次登陆时存储的菜单
                window.sessionStorage.removeItem('activePath')
                this.$message.success(res.meta.msg)
                this.$router.push('/home')
            })
        },

        // 重置表单
        resetLoginForm(ref) {
            this.$refs.loginForm.resetFields()
        }
    }
}
</script>
<style lang="less" scoped>
  .login_container {
      width: 100%;
      height: 100%;
      background-color: darkslategray;
  }
  .login_box {
      width: 450px;
      height: 300px;
      background-color: #fff;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);

      .avator_box {
          width: 130px;
          height: 130px;
          position: absolute;
          left: 50%;
          transform: translate(-50%,-50%);
          border: 1px solid #ddd;
          box-shadow: 0 0 10px #ddd;
          border-radius: 50%;
          padding: 10px;
          background-color: #fff;
          img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
          }
       }
       .form-box {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            padding: 0 10px;
            display: flex;
            align-items: flex-end;

            .el-form {
                width:100%;

                .btns-box {
                    display: flex;
                    justify-content: flex-end;
                }
            }
        }
   }
</style>
