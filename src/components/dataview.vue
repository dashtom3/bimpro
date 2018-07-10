<template>
  <div>
    <h4>工序数据</h4>
  <el-table
    :data="proData"
    border
    style="width: 100%">
    <el-table-column
      label="施工阶段编号"
      width="180">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.consPhaseNumber }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="工序名称"
      width="180">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.processName }}</span>
      </template>
    </el-table-column>
    <el-table-column label="关联单元">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.associatedUnit }}</span>
      </template>
    </el-table-column>
  </el-table>
  <!-- <h4>基础数据</h4>
  <div class="basic">
    <el-row class="basicTable">
      <div>
        <el-col :span="4"><div class="leftText"><span>构件编号</span></div></el-col>
        <el-col :span="20">
          <div class="leftText"><span>构件数据</span></div>
        </el-col>
      </div>
    </el-row>
    <el-row v-for="item in basicData" class="basicTable">
      <div v-for="value,key in item.jsonVal" >
      <el-col :span="4"><div class="leftText"><span>{{item.key}}</span><br><span class="leftBottom">({{key}})</span></div></el-col>
      <el-col :span="20">
          <el-row v-for="value2,key2 in value" v-if="typeof value2 != 'string'" class="basicContent">
            <span>{{key2}}:
            </span>
              <el-tag v-for="value3,key3 in value2" class="tagClass">
                {{key3}}:{{value3}}
              </el-tag>
          </el-row>
          <el-tag v-for="value2,key2 in value" v-if="typeof value2 == 'string'" class="tagClass">
              {{key2}}:{{value2}}
          </el-tag>
      </el-col>
      </div>
    </el-row> -->
  </div>
  </div>
</template>

<script>
  import global from './global.js'
  export default {
    data() {
      return {
        proData:null,
        basicData:null
      }
    },
    created(){
      this.getBasisDataList()
      this.getProDataList()
    },
    methods: {
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
      getProDataList(){
        var self = this
        global.apiGetWithToken(this,global.baseUrl+'returnProList').then((res)=>{
            console.log(res)
            self.proData = res.data.data
        })
      },
      getBasisDataList(){
        var self = this
        String.prototype.myReplace=function(f,e){//吧f替换成e
          var reg=new RegExp(f,"g"); //创建正则RegExp对象
          return this.replace(reg,e);
        }
        global.apiGetWithToken(this,global.baseUrl+'returnBasisData').then((res)=>{
            res.data.data.forEach(function(item){
              // item.jsonVal = JSON.parse(item.value)
              // item.jsonVal = item.value.parseJSON();
              item.value = item.value.myReplace("{", "{\"");
              item.value = item.value.myReplace("={", "\":{");
              item.value = item.value.myReplace("=", "\":\"");
              item.value = item.value.myReplace(",", "\",\"");
              item.value = item.value.myReplace("}\",", "},");
              item.value = item.value.myReplace("}", "\"}");
              item.value = item.value.myReplace("}\"}", "}}");
              item.value = item.value.myReplace("}\"}", "}}");
              console.log(item.value)
              item.jsonVal = JSON.parse(item.value);
            })
            self.basicData = res.data.data
            console.log(res)
        })
      }
    }
  }
</script>
<style scoped>
  .leftText {
    text-align:center;
  }
  .leftBottom{
    font-size: 12px;
    color: #393939;
  }
  .basicTable {
    border-bottom: 1px solid #e6e6e6;
    margin-top: 20px;
    padding-bottom: 20px;
  }
  .tagClass {
    margin-right: 2px;
    margin-bottom: 2px;
  }
  .basicContent {
    border-bottom: 1px solid #e6e6e6;
    margin-bottom: 5px;
    padding-bottom: 3px;
  }
  .basicContent span {
    font-size: 12px;
  }
  .basic {
    border:1px solid #e6e6e6;
  }
</style>
