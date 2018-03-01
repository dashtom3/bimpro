<template>
	<el-form ref="form" label-width="80px" style="margin:20px;width:60%;min-width:600px;">
		<el-form-item label="数据上传">
			<el-upload
			  class="upload-demo"
			  :action="uploadURL"
			  :on-preview="handlePreview"
			  :on-remove="handleRemove"
			  :before-remove="beforeRemove"
				:on-success="handleAvatarSuccess"
			  multiple
			  :limit="1"
			  :on-exceed="handleExceed"
			  :file-list="fileList">
			  <el-button size="small" type="primary">点击上传</el-button>
			  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
			</el-upload>
		</el-form-item>
	</el-form>
</template>

<script>
import global from './global.js'
	export default {
		data() {
			return {
				uploadURL:global.baseUrl+"uploadExcel?token="+global.getToken(),
				fileList:[]
			}
		},
		methods: {
			handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
			handleAvatarSuccess(res, file) {
				console.log(res)
        if(res.msg == '1') {
					global.success(this,"上传成功",'')
				} else {
					global.success(this,"上传失败",'')
				}
      }
		}
	}

</script>
