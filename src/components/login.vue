<template>
  <div>
  <img src="../assets/bg.jpeg" class="image">
  <h2 class="headTxt">深圳地铁6号线合水口—薯田埔区间V墩刚构桥施工信息系统</h2>
  <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <h3 class="title">用户登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="checkPass">
      <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
      <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
    </el-form-item>
  </el-form>

  </div>
</template>

<script>
  import global from './global.js';
  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
        logining: false,
        ruleForm2: {
          account: 'admin',
          checkPass: '123456'
        },
        rules2: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            //{ validator: validaePass }
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            //{ validator: validaePass2 }
          ]
        },
        checked: true
      };
    },
    created(){

    },
    methods: {
      handleReset2() {
        this.$refs.ruleForm2.resetFields();
      },

      handleSubmit2(ev) {
        var _this = this;
        this.$refs.ruleForm2.validate((valid) => {
          if (valid) {
            //_this.$router.replace('/table');
            this.logining = true;
            //NProgress.start();
            var loginParams = { userName: this.ruleForm2.account, passWord: this.ruleForm2.checkPass };
            global.apiGet(_this,global.baseUrl+'login',loginParams).then((res)=>{
              this.logining = false;
              if(res.data.msg == '0') {
                this.$message("用户不存在或者密码错误")
              } else {
                global.setToken(res.data.token)
                global.setUser(res.data.data)
                global.success(_this,"登录成功","/modelData")
              }
            }).catch(()=>{

            })

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }

</script>

<style scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
  .image {
    position: fixed;
    left:0;
    top:0;
    z-index: -1;
    width:100%;
    height:100%;
  }
  .headTxt {
    font-size: 30px;
    text-align: center;
    position: absolute;
    top: 80px;
    left: 0;
    right: 0;
    margin: auto
  }
</style>
