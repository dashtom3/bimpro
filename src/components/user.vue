<template>
  <div class="user">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
  			<el-form :inline="true">
  				<el-form-item>
  					<el-button type="primary" @click="handleAdd">添加</el-button>
  				</el-form-item>
  			</el-form>
  		</el-col>
  <el-table
    :data="userList"
    border
    style="width: 100%">
    <el-table-column
      label="用户名"
      width="180">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.userName }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="密码"
      width="180">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.passWord }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="权限"
      width="180">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.identification | filterIdentify}}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="block">
    <el-pagination
      layout="prev, pager, next"
      :total="userListArgs.totalPage"
      @current-change="changePage">
    </el-pagination>
  </div>
  <el-dialog
    title="添加用户"
    :visible.sync="addUserShow"
    width="30%">
    <div>账号：<el-input v-model="userAdd.userName" placeholder=""></el-input>
    </div>
    <div>密码：<el-input v-model="userAdd.passWord" placeholder=""></el-input>
    </div>
    <div>
      权限：
      <el-select v-model="userAdd.identification" placeholder="请选择">
        <el-option
          label="用户"
          value=0>
        </el-option>
        <el-option
          label="管理员"
          value=1>
        </el-option>
      </el-select>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addUserShow = false">取 消</el-button>
      <el-button type="primary" @click="addUser()">确 定</el-button>
    </span>
  </el-dialog>
  <el-dialog
    title="修改用户"
    :visible.sync="editUserShow"
    width="30%">
    <div>账号：<el-input v-model="userEdit.userName" placeholder="" :disabled="true"></el-input>
    </div>
    <div>密码：<el-input v-model="userEdit.passWord" placeholder=""></el-input>
    </div>
    <div>
      权限：
      <el-select v-model="userEdit.identification" placeholder="请选择">
        <el-option
          label="用户"
          :value=0>
        </el-option>
        <el-option
          label="管理员"
          :value=1>
        </el-option>
      </el-select>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="editUserShow = false">取 消</el-button>
      <el-button type="primary" @click="editUser()">确 定</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
  import global from './global.js'
  export default {
    data() {
      return {
        userAdd:{
          userName:null,
          passWord:null,
          identification:0
        },
        userEdit:{
          userName:null,
          passWord:null,
          identification:0
        },
        userList:null,
        addUserShow:false,
        editUserShow:false,
        userListArgs:{
          currentPage:1,
          numberPerpage:10,
          totalPage:-1
        }
      }
    },
    created(){
      this.getUserList()
    },
    methods: {
      handleEdit(data) {
        this.userEdit = data
        this.editUserShow = !this.editUserShow
      },
      handleDelete(data) {
        var self = this
        this.$confirm('是否删除该用户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          global.apiGetWithToken(self,global.baseUrl+'deleteAccount',{userName:data.userName}).then((res)=>{
            if(res.data.msg=="1"){
              global.success(self,"删除成功",'')
              self.getUserList()
            } else {
              global.error(self,"删除失败",'')
            }
          })
        }).catch(() => {

        });
      },
      handleAdd(){
        this.userAdd={userName:null,passWord:null,identification:"0"}
        this.addUserShow = !this.addUserShow
      },
      getUserList(){
        var self = this
        global.apiGetWithToken(this,global.baseUrl+'queryUserList',this.userListArgs).then((res)=>{
          self.userListArgs.totalPage = res.data.totalPage
          self.userListArgs.currentPage = res.data.currentPage
          self.userList = res.data.data
        })
      },
      addUser(){
        var self = this
        if(this.userAdd.userName && this.userAdd.passWord){
          global.apiGetWithToken(this,global.baseUrl+'addAccount',this.userAdd).then((res)=>{
            if(res.data.msg == "1") {
              global.success(self,'添加成功','');
              self.addUserShow = !self.addUserShow
              self.getUserList()
            } else {
              global.error(self,'添加失败','');
            }
          })
        } else {
          global.error(self,'请输入账号密码','');
        }
      },
      editUser(){
        var self = this
        if(this.userEdit.userName && this.userEdit.passWord){
          global.apiGetWithToken(this,global.baseUrl+'updateAccount',this.userEdit).then((res)=>{
            if(res.data.msg == "1") {
              global.success(self,'修改成功','');
              self.editUserShow = !self.editUserShow
              self.getUserList()
            } else {
              global.error(self,'修改失败','');
            }
          })
        } else {
          global.error(self,'请输入账号密码','');
        }
      },
      changePage (value) {
        console.log(value)
        this.userListArgs.currentPage = value
        this.getUserList()
        // this.getOrderLists(this.orderArgs)
      }
    }
  }
</script>
