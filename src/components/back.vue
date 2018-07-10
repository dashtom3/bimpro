<template>
  <div class="hello">
    <el-row class="tac">
      <el-col :span = "4" style="text-align:center">
        <h5>后台管理</h5>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          router
          >
          <el-menu-item index="user" v-if="userIdentify == 2">
            <i class="el-icon-edit"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>
          <el-menu-item index="dataview">
            <i class="el-icon-document"></i>
            <span slot="title">工序数据</span>
          </el-menu-item>
          <el-menu-item index="basicData">
            <i class="el-icon-document"></i>
            <span slot="title">基础数据</span>
          </el-menu-item>
          <el-menu-item index="upload">
            <i class="el-icon-upload"></i>
            <span slot="title">数据上传</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="20" class="backcontent">
        <div class="backTop">
          <el-button @click="logout" type="text">退出账户</el-button>
        </div>
        <div class="backData">
          <router-view></router-view>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import global from './global.js'
export default {
  name: 'HelloWorld',
  data () {
    return {
      userIdentify:0
    }
  },
  created(){
    this.userIdentify = global.getUser().identification
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    logout(){
      global.logout()
      this.$router.push('/adminLogin')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  height: 100%;
}
.tac {
 /*width: 200px;*/

 height: 100%;
}
.backcontent {
  padding: 8px;
}
.backTop {
  text-align: right;
  padding-right: 40px;
  border-bottom: 1px solid #f9f9f9;
}
.backData {
  margin-top: 20px;
}
/*h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}*/
</style>
